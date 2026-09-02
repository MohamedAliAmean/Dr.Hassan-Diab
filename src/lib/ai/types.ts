export type ChatMessage = {
  role: "user" | "assistant";
  content: string;
};

export type AiProviderName = "cursor" | "gemini";

export function getAiProviderName(): AiProviderName {
  const raw = (process.env.AI_PROVIDER || "gemini").toLowerCase();
  return raw === "cursor" ? "cursor" : "gemini";
}
