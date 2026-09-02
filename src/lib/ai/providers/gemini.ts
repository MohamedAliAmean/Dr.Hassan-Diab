import { GoogleGenerativeAI } from "@google/generative-ai";
import type { ChatMessage } from "@/lib/ai/types";

export async function askWithGemini(params: {
  systemPrompt: string;
  messages: ChatMessage[];
}): Promise<string> {
  const apiKey = process.env.GEMINI_API_KEY?.trim();
  if (!apiKey) {
    throw new Error(
      "GEMINI_API_KEY is missing. Add it to .env.local then set AI_PROVIDER=gemini."
    );
  }

  const modelId = process.env.GEMINI_MODEL?.trim() || "gemini-3.6-flash";
  const genAI = new GoogleGenerativeAI(apiKey);
  const model = genAI.getGenerativeModel({
    model: modelId,
    systemInstruction: params.systemPrompt,
  });

  const contents = params.messages.map((m) => ({
    role: m.role === "assistant" ? "model" : "user",
    parts: [{ text: m.content }],
  }));

  const result = await model.generateContent({ contents });
  const text = result.response.text()?.trim();
  if (!text) throw new Error("Gemini returned an empty answer.");
  return text;
}
