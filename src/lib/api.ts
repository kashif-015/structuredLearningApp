// src/lib/api.ts
const API_BASE = "/api";

export async function resolveYouTubeUrl(url: string) {
  const res = await fetch(`${API_BASE}/youtube/resolve`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ url }),
  });
  if (!res.ok) throw new Error(await res.text());
  return res.json();
}

export async function fetchChannelPlaylists(channelId: string) {
  const res = await fetch(`${API_BASE}/youtube/channel`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ channelId }),
  });
  if (!res.ok) throw new Error(await res.text());
  return res.json();
}

export async function importPlaylistAsCourse(playlistId: string) {
  const res = await fetch(`${API_BASE}/youtube/playlist`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ playlistId }),
  });
  if (!res.ok) throw new Error(await res.text());
  return res.json();
}

export async function generateSummary(videoTitle: string, videoDescription?: string) {
  const res = await fetch(`${API_BASE}/ai/summarize`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ videoTitle, videoDescription }),
  });
  if (!res.ok) throw new Error(await res.text());
  const data = await res.json();
  return data.summary;
}

export async function generateQuiz(videoTitle: string) {
  const res = await fetch(`${API_BASE}/ai/quiz`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ videoTitle }),
  });
  if (!res.ok) throw new Error(await res.text());
  const data = await res.json();
  return data.quiz;
}

export async function generateFlashcards(videoTitle: string) {
  const res = await fetch(`${API_BASE}/ai/flashcards`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ videoTitle }),
  });
  if (!res.ok) throw new Error(await res.text());
  const data = await res.json();
  return data.flashcards;
}

export async function sendChatMessage(messages: { role: string; content: string }[], context: { title: string }) {
  const res = await fetch(`${API_BASE}/ai/chat`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ messages, context }),
  });
  if (!res.ok) throw new Error(await res.text());
  const data = await res.json();
  return data.response;
}
