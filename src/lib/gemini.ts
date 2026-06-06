import { GoogleGenerativeAI } from "@google/generative-ai";

const GEMINI_KEY = process.env.GEMINI_API_KEY;
if (!GEMINI_KEY) console.warn("⚠  GEMINI_API_KEY is missing — AI endpoints will fail.");

const genAI = GEMINI_KEY ? new GoogleGenerativeAI(GEMINI_KEY) : null;
const geminiModel = genAI?.getGenerativeModel({ model: "gemini-2.5-flash" });

export async function askGemini(prompt: string) {
  if (!geminiModel) throw Object.assign(new Error("GEMINI_API_KEY not configured"), { status: 503 });
  const result = await geminiModel.generateContent(prompt);
  return result.response.text();
}

export function extractJSON(text: string) {
  const cleaned = text.replace(/```(?:json)?\s*/gi, "").replace(/```/g, "").trim();
  return JSON.parse(cleaned);
}
