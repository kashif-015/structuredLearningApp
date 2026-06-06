import { NextResponse } from "next/server";
import { askGemini, extractJSON } from "@/lib/gemini";

export async function POST(req: Request) {
  try {
    const { videoTitle } = await req.json();
    if (!videoTitle) return NextResponse.json({ error: "videoTitle is required" }, { status: 400 });
    if (!process.env.GEMINI_API_KEY) {
      // Dev fallback: simple mock quiz
      const quiz = Array.from({ length: 5 }).map((_, i) => ({
        question: `${videoTitle} - sample question ${i + 1}`,
        options: ["A) Option 1", "B) Option 2", "C) Option 3", "D) Option 4"],
        correct_answer: "A) Option 1",
      }));
      return NextResponse.json({ quiz });
    }

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
