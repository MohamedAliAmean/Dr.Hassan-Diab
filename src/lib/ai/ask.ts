import { askWithCursor } from "@/lib/ai/providers/cursor";
import { askWithGemini } from "@/lib/ai/providers/gemini";
import { getAiProviderName, type ChatMessage } from "@/lib/ai/types";

export async function askCoachAi(params: {
  systemPrompt: string;
  messages: ChatMessage[];
}): Promise<{ answer: string; provider: string }> {
  const provider = getAiProviderName();

  if (provider === "gemini") {
    const answer = await askWithGemini(params);
    return { answer, provider };
  }

  const answer = await askWithCursor(params);
  return { answer, provider: "cursor" };
}
