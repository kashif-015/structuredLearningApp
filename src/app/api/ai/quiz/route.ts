import { NextResponse } from "next/server";
import { askGemini, extractJSON } from "@/lib/gemini";

export async function POST(req: Request) {
  try {
    const { videoTitle } = await req.json();
    if (!videoTitle) return NextResponse.json({ error: "videoTitle is required" }, { status: 400 });

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
    return NextResponse.json({ quiz });
  } catch (err: any) {
    console.error("Error in /api/ai/quiz:", err.message);
    return NextResponse.json({ error: err.message }, { status: err.status || 500 });
  }
}
