import { NextResponse } from "next/server";
import { askGemini } from "@/lib/gemini";

export async function POST(req: Request) {
  try {
    const { videoTitle, videoDescription } = await req.json();
    if (!videoTitle) return NextResponse.json({ error: "videoTitle is required" }, { status: 400 });

    if (!process.env.GEMINI_API_KEY) {
      // Dev fallback
      const summary = `• ${videoTitle} — key concept 1\n• ${videoTitle} — key concept 2\n• ${videoTitle} — key concept 3`;
      return NextResponse.json({ summary });
    }

    const prompt = `You are an expert educational content summarizer.

Summarize the following lecture in 3–5 concise key points that a student should remember. Be specific, actionable, and avoid filler.

Title: ${videoTitle}
${videoDescription ? `Description: ${videoDescription}` : ""}

Respond with a clean markdown bulleted list (no intro sentence, no numbering, just bullet points starting with •).`;

    const summary = await askGemini(prompt);
    return NextResponse.json({ summary });
  } catch (err: any) {
    console.error("Error in /api/ai/summarize:", err.message);
    return NextResponse.json({ error: err.message }, { status: err.status || 500 });
  }
}
