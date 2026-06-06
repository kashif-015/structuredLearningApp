import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { url } = await req.json();
    if (!url) return NextResponse.json({ error: "url is required" }, { status: 400 });

    // Playlist
    const listMatch = url.match(/[?&]list=([a-zA-Z0-9_-]+)/);
    if (listMatch) return NextResponse.json({ type: "playlist", id: listMatch[1] });

    // Channel handle (@handle)
    const handleMatch = url.match(/youtube\.com\/@([a-zA-Z0-9_.-]+)/);
    if (handleMatch) return NextResponse.json({ type: "channel", id: `@${handleMatch[1]}` });

    // Channel ID (/channel/UCxxxx)
    const channelMatch = url.match(/youtube\.com\/channel\/([a-zA-Z0-9_-]+)/);
    if (channelMatch) return NextResponse.json({ type: "channel", id: channelMatch[1] });

    // Custom URL (/c/name)
    const customMatch = url.match(/youtube\.com\/c\/([a-zA-Z0-9_.-]+)/);
    if (customMatch) return NextResponse.json({ type: "channel", id: customMatch[1] });

    // Single video (no playlist)
    const videoMatch = url.match(/(?:v=|youtu\.be\/)([a-zA-Z0-9_-]{11})/);
    if (videoMatch) return NextResponse.json({ type: "video", id: videoMatch[1] });

    return NextResponse.json({ error: "Could not parse YouTube URL" }, { status: 400 });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
