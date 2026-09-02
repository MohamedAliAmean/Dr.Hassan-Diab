import { NextResponse } from "next/server";
import { z } from "zod";
import { askCoachAi } from "@/lib/ai/ask";
import {
  buildSystemPrompt,
  buildTrainingKnowledgeBase,
} from "@/lib/ai/knowledge";

export const runtime = "nodejs";
export const maxDuration = 120;

const bodySchema = z.object({
  locale: z.enum(["en", "ar"]).default("en"),
  messages: z
    .array(
      z.object({
        role: z.enum(["user", "assistant"]),
        content: z.string().min(1).max(2000),
      })
    )
    .min(1)
    .max(20),
});

export async function POST(request: Request) {
  try {
    const json = await request.json();
    const parsed = bodySchema.safeParse(json);
    if (!parsed.success) {
      return NextResponse.json(
        { error: "Invalid chat payload." },
        { status: 400 }
      );
    }

    const { locale, messages } = parsed.data;
    const last = messages[messages.length - 1];
    if (last.role !== "user") {
      return NextResponse.json(
        { error: "Last message must be from the user." },
        { status: 400 }
      );
    }

    const knowledge = await buildTrainingKnowledgeBase();
    const systemPrompt = buildSystemPrompt(knowledge, locale);
    const { answer, provider } = await askCoachAi({
      systemPrompt,
      messages,
    });

    return NextResponse.json({ answer, provider });
  } catch (err) {
    const message =
      err instanceof Error ? err.message : "Chat request failed.";
    console.error("[api/chat]", message);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
