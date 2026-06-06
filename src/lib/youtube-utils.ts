export async function ytFetch(endpoint: string, params: Record<string, string>) {
  const YT_KEY = process.env.YOUTUBE_API_KEY;
  if (!YT_KEY) throw new Error("YOUTUBE_API_KEY is missing");
  
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

export function parseDuration(iso: string) {
  if (!iso) return 0;
  const m = iso.match(/PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/);
  if (!m) return 0;
  return (parseInt(m[1] || "0") * 3600) + (parseInt(m[2] || "0") * 60) + parseInt(m[3] || "0");
}
