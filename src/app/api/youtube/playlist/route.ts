import { NextResponse } from "next/server";
import { ytFetch, parseDuration } from "@/lib/youtube-utils";
import { getTranscript, extractKeywords, getEmbedding, clusterVideos, generateModuleTitle } from "@/lib/ml";

export async function POST(req: Request) {
  try {
    const { playlistId } = await req.json();
    if (!playlistId) return NextResponse.json({ error: "playlistId is required" }, { status: 400 });

    // Step 1: Get playlist metadata
    const plMeta = await ytFetch("playlists", { id: playlistId, part: "snippet" });
    if (!plMeta.items?.length) return NextResponse.json({ error: "Playlist not found" }, { status: 404 });
    const plSnippet = plMeta.items[0].snippet;
    const playlistTitle = plSnippet.title;
    const playlistChannel = plSnippet.channelTitle;
    const playlistThumbnail = plSnippet.thumbnails?.high?.url || plSnippet.thumbnails?.medium?.url || "";

    // Step 2: Fetch all playlist items (paginated)
    const rawItems = [];
    let pageToken = "";
    do {
      const params: any = { playlistId, part: "snippet,contentDetails", maxResults: "50" };
      if (pageToken) params.pageToken = pageToken;
      const data = await ytFetch("playlistItems", params);
      for (const item of data.items || []) {
        const vid = item.contentDetails?.videoId;
        if (!vid) continue;
        // Skip deleted/private videos
        if (item.snippet.title === "Deleted video" || item.snippet.title === "Private video") continue;
        rawItems.push({
          videoId: vid,
          title: item.snippet.title,
          thumbnail: item.snippet.thumbnails?.medium?.url || item.snippet.thumbnails?.default?.url || "",
          position: item.snippet.position + 1,
        });
      }
      pageToken = data.nextPageToken || "";
    } while (pageToken);

    // Step 3: Batch-fetch video durations (50 at a time)
    const durationMap: Record<string, number> = {};
    for (let i = 0; i < rawItems.length; i += 50) {
      const batch = rawItems.slice(i, i + 50);
      const ids = batch.map((v) => v.videoId).join(",");
      const data = await ytFetch("videos", { id: ids, part: "contentDetails" });
      for (const v of data.items || []) {
        durationMap[v.id] = parseDuration(v.contentDetails?.duration);
      }
    }

    // Step 4: Build final lectures array with durations
    const lectures = rawItems.map((item) => ({
      id: `lec-${item.position}`,
      title: item.title,
      videoId: item.videoId,
      thumbnail: item.thumbnail,
      duration: durationMap[item.videoId] || 0,
      position: item.position,
    }));

    const totalDuration = lectures.reduce((sum, l) => sum + l.duration, 0);

    // Step 5: AI Processing (Local Embeddings & Clustering)
    console.log(`Processing ${lectures.length} videos with local ML...`);
    const processedLectures = [];
    for (const l of lectures) {
      // Fetch transcript
      let text = await getTranscript(l.videoId);
      if (!text || text.length < 50) text = l.title; // fallback

      // Extract keywords
      const keywords = extractKeywords(text);

      // Get embedding (cached by videoId)
      const embeddingText = `${l.title}. ${keywords.join(", ")}`;
      const embedding = await getEmbedding(l.videoId, embeddingText);

      processedLectures.push({ ...l, keywords, embedding });
    }

    // Step 6: Cluster into modules then sort by earliest playlist position
    const clusters = clusterVideos(processedLectures);

    const modules = clusters
      .map((clusterVideos: any[], idx: number) => ({
        id: `mod-${idx + 1}`,
        title: generateModuleTitle(clusterVideos),
        // Within each module videos are already sorted by position (done in clusterVideos)
        lectures: clusterVideos.map(v => {
          const { embedding, keywords, ...rest } = v;
          return rest;
        }),
      }))
      // Sort modules so the one containing the earliest playlist video comes first
      .sort((a: any, b: any) => {
        const minA = Math.min(...a.lectures.map((l: any) => l.position));
        const minB = Math.min(...b.lectures.map((l: any) => l.position));
        return minA - minB;
      })
      // Re-assign sequential IDs after sorting
      .map((m: any, idx: number) => ({ ...m, id: `mod-${idx + 1}` }));

    // Generate Course-level metadata
    const allKeywords = processedLectures.flatMap(l => l.keywords);
    const topKeywordsCounts: Record<string, number> = {};
    allKeywords.forEach(k => topKeywordsCounts[k] = (topKeywordsCounts[k] || 0) + 1);
    const topKeywords = Object.entries(topKeywordsCounts).sort((a, b) => b[1] - a[1]).slice(0, 5).map(x => x[0]);

    // Simple outcome generation
    const learningOutcomes = [
      `Understand fundamentals of ${topKeywords[0] || playlistTitle}`,
      `Apply concepts related to ${topKeywords[1] || 'various topics'}`,
      `Master practical skills in ${topKeywords[2] || 'development'}`
    ];

    return NextResponse.json({
      title: playlistTitle,
      channel: playlistChannel,
      thumbnail: playlistThumbnail,
      totalLectures: lectures.length,
      totalDuration,
      learningOutcomes,
      modules,
    });
  } catch (err: any) {
    console.error("Error in /api/youtube/playlist:", err.message);
    return NextResponse.json({ error: err.message }, { status: err.status || 500 });
  }
}
