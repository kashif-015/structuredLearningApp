import { NextResponse } from "next/server";
import { ytFetch } from "@/lib/youtube-utils";

export async function POST(req: Request) {
  try {
    const { channelId } = await req.json();
    if (!channelId) return NextResponse.json({ error: "channelId is required" }, { status: 400 });

    // Step 1: Resolve to canonical channel ID
    let resolvedId = channelId;
    let channelName;
    if (channelId.startsWith("@")) {
      const data = await ytFetch("channels", { forHandle: channelId.slice(1), part: "id,snippet" });
      if (!data.items?.length) return NextResponse.json({ error: "Channel not found" }, { status: 404 });
      resolvedId = data.items[0].id;
      channelName = data.items[0].snippet.title;
    } else if (!channelId.startsWith("UC")) {
      // Try as custom URL / username
      const data = await ytFetch("search", { q: channelId, type: "channel", part: "snippet", maxResults: "1" });
      if (!data.items?.length) return NextResponse.json({ error: "Channel not found" }, { status: 404 });
      resolvedId = data.items[0].snippet.channelId;
    }

    // Step 2: Get channel name if not already fetched
    if (!channelName) {
      const data = await ytFetch("channels", { id: resolvedId, part: "snippet" });
      if (!data.items?.length) return NextResponse.json({ error: "Channel not found" }, { status: 404 });
      channelName = data.items[0].snippet.title;
    }

    // Step 3: Fetch all playlists (paginated)
    const playlists = [];
    let pageToken = "";
    do {
      const params: any = { channelId: resolvedId, part: "snippet,contentDetails", maxResults: "50" };
      if (pageToken) params.pageToken = pageToken;
      const data = await ytFetch("playlists", params);
      for (const item of data.items || []) {
        const count = item.contentDetails?.itemCount || 0;
        if (count === 0) continue;
        playlists.push({
          id: item.id,
          title: item.snippet.title,
          thumbnail: item.snippet.thumbnails?.medium?.url || item.snippet.thumbnails?.default?.url || "",
          itemCount: count,
        });
      }
      pageToken = data.nextPageToken || "";
    } while (pageToken);

    return NextResponse.json({ type: "channel_playlists", channelName, playlists });
  } catch (err: any) {
    console.error("Error in /api/youtube/channel:", err.message);
    return NextResponse.json({ error: err.message }, { status: err.status || 500 });
  }
}
