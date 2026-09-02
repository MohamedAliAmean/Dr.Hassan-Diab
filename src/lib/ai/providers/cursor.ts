import { mkdtemp, rm, writeFile } from "fs/promises";
import { tmpdir } from "os";
import { join } from "path";
import type { ChatMessage } from "@/lib/ai/types";

/**
 * Local-only Cursor experiments. Does not work on Vercel serverless.
 */
export async function askWithCursor(params: {
  systemPrompt: string;
  messages: ChatMessage[];
}): Promise<string> {
  if (process.env.VERCEL) {
    throw new Error(
      "Cursor provider is blocked on Vercel. Use AI_PROVIDER=gemini with GEMINI_API_KEY."
    );
  }

  const apiKey = process.env.CURSOR_API_KEY?.trim();
  if (!apiKey) {
    throw new Error(
      "CURSOR_API_KEY is missing. Add it to .env.local (never commit it)."
    );
  }

  const modelId = process.env.CURSOR_MODEL?.trim() || "composer-2";
  const latestUser =
    [...params.messages].reverse().find((m) => m.role === "user")?.content ||
    "";

  const history = params.messages
    .slice(-8)
    .map((m) => `${m.role.toUpperCase()}: ${m.content}`)
    .join("\n");

  const workspace = await mkdtemp(join(tmpdir(), "hd-chat-"));
  try {
    await writeFile(
      join(workspace, "KNOWLEDGE.md"),
      params.systemPrompt,
      "utf8"
    );

    const prompt = `Read KNOWLEDGE.md in this workspace.

You are answering a website visitor. Do NOT edit, create, or delete any files.
Do NOT run tools that change the filesystem. Reply with the final answer text only.

Conversation:
${history}

Visitor question:
${latestUser}`;

    const { Agent } = await import("@cursor/sdk");

    const result = await Agent.prompt(prompt, {
      apiKey,
      model: { id: modelId },
      local: { cwd: workspace },
    });

    if (result.status === "error") {
      throw new Error("Cursor agent run failed. Switch to Gemini for production.");
    }

    const text = (result.result || "").trim();
    if (!text) {
      throw new Error("Cursor returned an empty answer.");
    }
    return text;
  } catch (err) {
    const message = err instanceof Error ? err.message : "Cursor request failed";
    throw new Error(`Cursor error: ${message}`);
  } finally {
    await rm(workspace, { recursive: true, force: true }).catch(() => undefined);
  }
}
