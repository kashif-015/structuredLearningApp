import { NextResponse } from "next/server";
import { askGemini } from "@/lib/gemini";

export async function POST(req: Request) {
  try {
    const { messages, context } = await req.json();
    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      return NextResponse.json({ error: "messages array is required" }, { status: 400 });
    }

    const topicContext = [
      context?.title ? `Course/Lecture: "${context.title}".` : "",
      context?.lessonTitle ? `Current lecture title: "${context.lessonTitle}".` : "",
      context?.lessonSummary ? `Lecture summary: ${context.lessonSummary}` : "",
    ]
      .filter(Boolean)
      .join("\n");

    const conversationHistory = messages
      .map((m: any) => `${m.role === "user" ? "Student" : "Assistant"}: ${m.content}`)
      .join("\n");

    const prompt = `You are a helpful, friendly AI learning assistant for an educational platform called EduFlow.
  ${topicContext}

  Keep your responses concise (2-4 sentences max unless the student asks for a detailed explanation). Be encouraging but accurate.
  Focus on the current lecture and resolve doubts with simple explanations, small examples, and clear next steps.
  If a question goes beyond the lecture context, say that clearly and still provide a best-effort explanation.

Conversation so far:
${conversationHistory}

Respond to the student's latest message as the Assistant:`;

    const response = await askGemini(prompt);
    if (!process.env.GEMINI_API_KEY) {
      return NextResponse.json({ response: "Thanks for your question — here's a short helpful reply (development mode)." });
    }

    return NextResponse.json({ response });
  } catch (err: any) {
    console.error("Error in /api/ai/chat:", err.message);
    return NextResponse.json({ error: err.message }, { status: err.status || 500 });
  }
}
