import "dotenv/config";
import express from "express";
import cors from "cors";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { getTranscript, extractKeywords, getEmbedding, clusterVideos, generateModuleTitle } from "./ml.js";
// ── Config ────────────────────────────────────────────────
const PORT = process.env.PORT || 3001;
const YT_KEY = process.env.YOUTUBE_API_KEY;
const GEMINI_KEY = process.env.GEMINI_API_KEY;

if (!YT_KEY) console.warn("⚠  YOUTUBE_API_KEY is missing — YouTube endpoints will fail.");
if (!GEMINI_KEY) console.warn("⚠  GEMINI_API_KEY is missing — AI endpoints will fail.");

const genAI = GEMINI_KEY ? new GoogleGenerativeAI(GEMINI_KEY) : null;
const geminiModel = genAI?.getGenerativeModel({ model: "gemini-2.5-flash" });

const app = express();
app.use(cors());
app.use(express.json());

// ── Helpers ───────────────────────────────────────────────

/** Fetch JSON from YouTube Data API v3 */
async function ytFetch(endpoint, params) {
  const url = new URL(`https://www.googleapis.com/youtube/v3/${endpoint}`);
  url.searchParams.set("key", YT_KEY);
  for (const [k, v] of Object.entries(params)) url.searchParams.set(k, v);
  const res = await fetch(url.toString());
  if (!res.ok) {
    const body = await res.text();
    throw Object.assign(new Error(`YouTube API ${res.status}: ${body}`), { status: res.status });
  }
  return res.json();
}

/** Parse ISO-8601 duration (PT1H2M3S) → total seconds */
function parseDuration(iso) {
  if (!iso) return 0;
  const m = iso.match(/PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/);
  if (!m) return 0;
  return (parseInt(m[1] || 0) * 3600) + (parseInt(m[2] || 0) * 60) + parseInt(m[3] || 0);
}

/** Chunk an array of lectures into modules of 5-8 items */
function chunkIntoModules(lectures) {
  const total = lectures.length;
  if (total === 0) return [];

  // Determine ideal chunk size (prefer 6-7, min 5, max 8)
  let chunkSize = 6;
  if (total <= 8) chunkSize = total;
  else {
    for (let s = 6; s <= 8; s++) {
      if (total % s === 0 || total % s >= 3) { chunkSize = s; break; }
    }
  }

  const modules = [];
  for (let i = 0; i < total; i += chunkSize) {
    const slice = lectures.slice(i, i + chunkSize);
    const idx = modules.length + 1;
    modules.push({
      id: `mod-${idx}`,
      title: `Module ${idx}: Lectures ${i + 1}–${i + slice.length}`,
      lectures: slice,
    });
  }

  // If the last module has fewer than 3 items, merge it into the previous one
  if (modules.length > 1) {
    const last = modules[modules.length - 1];
    if (last.lectures.length < 3) {
      const prev = modules[modules.length - 2];
      prev.lectures.push(...last.lectures);
      prev.title = `Module ${modules.length - 1}: Lectures ${prev.lectures[0].position}–${prev.lectures[prev.lectures.length - 1].position}`;
      modules.pop();
    }
  }
  return modules;
}

/** Call Gemini and return text */
async function askGemini(prompt) {
  if (!geminiModel) throw Object.assign(new Error("GEMINI_API_KEY not configured"), { status: 503 });
  const result = await geminiModel.generateContent(prompt);
  return result.response.text();
}

/** Extract JSON from Gemini response (strips markdown fences) */
function extractJSON(text) {
  const cleaned = text.replace(/```(?:json)?\s*/gi, "").replace(/```/g, "").trim();
  return JSON.parse(cleaned);
}

// ── Health ─────────────────────────────────────────────────
app.get("/api/health", (_req, res) => {
  res.json({
    status: "ok",
    timestamp: new Date().toISOString(),
    services: {
      youtube: !!YT_KEY,
      gemini: !!GEMINI_KEY,
    },
  });
});

// ════════════════════════════════════════════════════════════
//  YOUTUBE ENDPOINTS
// ════════════════════════════════════════════════════════════

// POST /api/youtube/resolve — Detect playlist or channel from URL
app.post("/api/youtube/resolve", (req, res) => {
  const { url } = req.body;
  if (!url) return res.status(400).json({ error: "url is required" });

  // Playlist
  const listMatch = url.match(/[?&]list=([a-zA-Z0-9_-]+)/);
  if (listMatch) return res.json({ type: "playlist", id: listMatch[1] });

  // Channel handle (@handle)
  const handleMatch = url.match(/youtube\.com\/@([a-zA-Z0-9_.-]+)/);
  if (handleMatch) return res.json({ type: "channel", id: `@${handleMatch[1]}` });

  // Channel ID (/channel/UCxxxx)
  const channelMatch = url.match(/youtube\.com\/channel\/([a-zA-Z0-9_-]+)/);
  if (channelMatch) return res.json({ type: "channel", id: channelMatch[1] });

  // Custom URL (/c/name)
  const customMatch = url.match(/youtube\.com\/c\/([a-zA-Z0-9_.-]+)/);
  if (customMatch) return res.json({ type: "channel", id: customMatch[1] });

  // Single video (no playlist)
  const videoMatch = url.match(/(?:v=|youtu\.be\/)([a-zA-Z0-9_-]{11})/);
  if (videoMatch) return res.json({ type: "video", id: videoMatch[1] });

  res.status(400).json({ error: "Could not parse YouTube URL" });
});

// POST /api/youtube/channel — Resolve channel and list playlists
app.post("/api/youtube/channel", async (req, res) => {
  try {
    const { channelId } = req.body;
    if (!channelId) return res.status(400).json({ error: "channelId is required" });

    // Step 1: Resolve to canonical channel ID
    let resolvedId = channelId;
    if (channelId.startsWith("@")) {
      const data = await ytFetch("channels", { forHandle: channelId.slice(1), part: "id,snippet" });
      if (!data.items?.length) return res.status(404).json({ error: "Channel not found" });
      resolvedId = data.items[0].id;
      var channelName = data.items[0].snippet.title;
    } else if (!channelId.startsWith("UC")) {
      // Try as custom URL / username
      const data = await ytFetch("search", { q: channelId, type: "channel", part: "snippet", maxResults: "1" });
      if (!data.items?.length) return res.status(404).json({ error: "Channel not found" });
      resolvedId = data.items[0].snippet.channelId;
    }

    // Step 2: Get channel name if not already fetched
    if (!channelName) {
      const data = await ytFetch("channels", { id: resolvedId, part: "snippet" });
      if (!data.items?.length) return res.status(404).json({ error: "Channel not found" });
      channelName = data.items[0].snippet.title;
    }

    // Step 3: Fetch all playlists (paginated)
    const playlists = [];
    let pageToken = "";
    do {
      const params = { channelId: resolvedId, part: "snippet,contentDetails", maxResults: "50" };
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

    res.json({ type: "channel_playlists", channelName, playlists });
  } catch (err) {
    console.error("Error in /api/youtube/channel:", err.message);
    res.status(err.status || 500).json({ error: err.message });
  }
});

// POST /api/youtube/playlist — Fetch full playlist with durations
app.post("/api/youtube/playlist", async (req, res) => {
  try {
    const { playlistId } = req.body;
    if (!playlistId) return res.status(400).json({ error: "playlistId is required" });

    // Step 1: Get playlist metadata
    const plMeta = await ytFetch("playlists", { id: playlistId, part: "snippet" });
    if (!plMeta.items?.length) return res.status(404).json({ error: "Playlist not found" });
    const plSnippet = plMeta.items[0].snippet;
    const playlistTitle = plSnippet.title;
    const playlistChannel = plSnippet.channelTitle;
    const playlistThumbnail = plSnippet.thumbnails?.high?.url || plSnippet.thumbnails?.medium?.url || "";

    // Step 2: Fetch all playlist items (paginated)
    const rawItems = [];
    let pageToken = "";
    do {
      const params = { playlistId, part: "snippet,contentDetails", maxResults: "50" };
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
    const durationMap = {};
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
      .map((clusterVideos, idx) => ({
        id: `mod-${idx + 1}`,
        title: generateModuleTitle(clusterVideos),
        // Within each module videos are already sorted by position (done in clusterVideos)
        lectures: clusterVideos.map(v => {
          const { embedding, keywords, ...rest } = v;
          return rest;
        }),
      }))
      // Sort modules so the one containing the earliest playlist video comes first
      .sort((a, b) => {
        const minA = Math.min(...a.lectures.map(l => l.position));
        const minB = Math.min(...b.lectures.map(l => l.position));
        return minA - minB;
      })
      // Re-assign sequential IDs after sorting
      .map((m, idx) => ({ ...m, id: `mod-${idx + 1}` }));

    // Generate Course-level metadata
    const allKeywords = processedLectures.flatMap(l => l.keywords);
    const topKeywordsCounts = {};
    allKeywords.forEach(k => topKeywordsCounts[k] = (topKeywordsCounts[k] || 0) + 1);
    const topKeywords = Object.entries(topKeywordsCounts).sort((a, b) => b[1] - a[1]).slice(0, 5).map(x => x[0]);

    // Simple outcome generation
    const learningOutcomes = [
      `Understand fundamentals of ${topKeywords[0] || playlistTitle}`,
      `Apply concepts related to ${topKeywords[1] || 'various topics'}`,
      `Master practical skills in ${topKeywords[2] || 'development'}`
    ];

    res.json({
      title: playlistTitle,
      channel: playlistChannel,
      thumbnail: playlistThumbnail,
      totalLectures: lectures.length,
      totalDuration,
      learningOutcomes,
      modules,
    });
  } catch (err) {
    console.error("Error in /api/youtube/playlist:", err.message);
    res.status(err.status || 500).json({ error: err.message });
  }
});

// ════════════════════════════════════════════════════════════
//  AI ENDPOINTS (Gemini)
// ════════════════════════════════════════════════════════════

// POST /api/ai/summarize
app.post("/api/ai/summarize", async (req, res) => {
  try {
    const { videoTitle, videoDescription } = req.body;
    if (!videoTitle) return res.status(400).json({ error: "videoTitle is required" });

    const prompt = `You are an expert educational content summarizer.

Summarize the following lecture in 3–5 concise key points that a student should remember. Be specific, actionable, and avoid filler.

Title: ${videoTitle}
${videoDescription ? `Description: ${videoDescription}` : ""}

Respond with a clean markdown bulleted list (no intro sentence, no numbering, just bullet points starting with •).`;

    const summary = await askGemini(prompt);
    res.json({ summary });
  } catch (err) {
    console.error("Error in /api/ai/summarize:", err.message);
    res.status(err.status || 500).json({ error: err.message });
  }
});

// POST /api/ai/quiz
app.post("/api/ai/quiz", async (req, res) => {
  try {
    const { videoTitle } = req.body;
    if (!videoTitle) return res.status(400).json({ error: "videoTitle is required" });

    const prompt = `You are an expert quiz creator for educational content.

Generate exactly 5 multiple-choice questions about: "${videoTitle}"

Each question must have 4 options and one correct answer. Questions should test real understanding, not trivia.

Respond with ONLY a JSON array (no markdown, no explanation) in this exact format:
[
  {
    "question": "...",
    "options": ["A) ...", "B) ...", "C) ...", "D) ..."],
    "correct_answer": "A) ..."
  }
]`;

    const raw = await askGemini(prompt);
    const quiz = extractJSON(raw);
    res.json({ quiz });
  } catch (err) {
    console.error("Error in /api/ai/quiz:", err.message);
    res.status(err.status || 500).json({ error: err.message });
  }
});

// POST /api/ai/flashcards
app.post("/api/ai/flashcards", async (req, res) => {
  try {
    const { videoTitle } = req.body;
    if (!videoTitle) return res.status(400).json({ error: "videoTitle is required" });

    const prompt = `You are an expert at creating study flashcards for educational content.

Generate exactly 10 flashcards about: "${videoTitle}"

Each card should have a clear, focused question on the front and a concise, accurate answer on the back. Cover the most important concepts a student needs to memorize.

Respond with ONLY a JSON array (no markdown, no explanation) in this exact format:
[
  { "question": "...", "answer": "..." }
]`;

    const raw = await askGemini(prompt);
    const flashcards = extractJSON(raw);
    res.json({ flashcards });
  } catch (err) {
    console.error("Error in /api/ai/flashcards:", err.message);
    res.status(err.status || 500).json({ error: err.message });
  }
});

// POST /api/ai/chat
app.post("/api/ai/chat", async (req, res) => {
  try {
    const { messages, context } = req.body;
    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      return res.status(400).json({ error: "messages array is required" });
    }

    const topicContext = context?.title ? `The student is currently studying: "${context.title}".` : "";

    const conversationHistory = messages
      .map((m) => `${m.role === "user" ? "Student" : "Assistant"}: ${m.content}`)
      .join("\n");

    const prompt = `You are a helpful, friendly AI learning assistant for an educational platform called EduFlow. ${topicContext}

Keep your responses concise (2-4 sentences max unless the student asks for a detailed explanation). Be encouraging but accurate. If you don't know something, say so.

Conversation so far:
${conversationHistory}

Respond to the student's latest message as the Assistant:`;

    const response = await askGemini(prompt);
    res.json({ response });
  } catch (err) {
    console.error("Error in /api/ai/chat:", err.message);
    res.status(err.status || 500).json({ error: err.message });
  }
});

// ── Error handler ──────────────────────────────────────────
app.use((err, _req, res, _next) => {
  console.error("Unhandled error:", err);
  res.status(500).json({ error: "Internal server error" });
});

// ── Start ──────────────────────────────────────────────────
app.listen(PORT, () => {
  console.log(`\n  🚀 EduFlow API running on http://localhost:${PORT}`);
  console.log(`  📡 Health check:  http://localhost:${PORT}/api/health\n`);
});
