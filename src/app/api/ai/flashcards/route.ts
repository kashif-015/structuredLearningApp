import { NextResponse } from "next/server";
import { askGemini, extractJSON } from "@/lib/gemini";

export async function POST(req: Request) {
  try {
    const { videoTitle } = await req.json();
    if (!videoTitle) return NextResponse.json({ error: "videoTitle is required" }, { status: 400 });
    if (!process.env.GEMINI_API_KEY) {
      const flashcards = Array.from({ length: 10 }).map((_, i) => ({ question: `${videoTitle} - Q${i+1}`, answer: `A concise answer ${i+1}` }));
      return NextResponse.json({ flashcards });
    }

    const prompt = `You are an expert at creating study flashcards for educational content.

Generate exactly 10 flashcards about: "${videoTitle}"

Each card should have a clear, focused question on the front and a concise, accurate answer on the back. Cover the most important concepts a student needs to memorize.

Respond with ONLY a JSON array (no markdown, no explanation) in this exact format:
[
  { "question": "...", "answer": "..." }
]`;

    const raw = await askGemini(prompt);
    const flashcards = extractJSON(raw);
    return NextResponse.json({ flashcards });
  } catch (err: any) {
    console.error("Error in /api/ai/flashcards:", err.message);
    return NextResponse.json({ error: err.message }, { status: err.status || 500 });
  }
}
