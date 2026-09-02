import { askWithCursor } from "@/lib/ai/providers/cursor";
import { askWithGemini } from "@/lib/ai/providers/gemini";
import { getAiProviderName, type ChatMessage } from "@/lib/ai/types";

function isServerlessRuntime() {
  return Boolean(process.env.VERCEL || process.env.AWS_LAMBDA_FUNCTION_NAME);
}

export async function askCoachAi(params: {
  systemPrompt: string;
  messages: ChatMessage[];
}): Promise<{ answer: string; provider: string }> {
  const requested = getAiProviderName();
  const hasGemini = Boolean(process.env.GEMINI_API_KEY?.trim());
  const hasCursor = Boolean(process.env.CURSOR_API_KEY?.trim());

  // Cursor local agent cannot run on Vercel/serverless — use Gemini there.
  const provider =
    requested === "cursor" && isServerlessRuntime()
      ? hasGemini
        ? "gemini"
        : "cursor-blocked"
      : requested;

  if (provider === "cursor-blocked") {
    throw new Error(
      "Cursor chat لا يشتغل على Vercel. حط GEMINI_API_KEY في Vercel Environment Variables وخلّي AI_PROVIDER=gemini"
    );
  }

  if (provider === "gemini") {
    if (!hasGemini) {
      throw new Error(
        "GEMINI_API_KEY missing. Add it in .env.local / Vercel env, then set AI_PROVIDER=gemini"
      );
    }
    const answer = await askWithGemini(params);
    return { answer, provider: "gemini" };
  }

  if (!hasCursor) {
    throw new Error(
      "CURSOR_API_KEY missing. For production use GEMINI_API_KEY + AI_PROVIDER=gemini"
    );
  }

  const answer = await askWithCursor(params);
  return { answer, provider: "cursor" };
}
