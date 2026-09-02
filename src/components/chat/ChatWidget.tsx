"use client";

import { useEffect, useRef, useState } from "react";
import { MessageCircle, Send, X, Loader2 } from "lucide-react";
import { useParams } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils";
import { defaultLocale, isLocale, type Locale } from "@/lib/i18n";

type Msg = { role: "user" | "assistant"; content: string };

const copy = {
  en: {
    title: "Ask the coach",
    subtitle: "Answers from Hassan’s site content only",
    placeholder: "Ask about training, packages, or tips…",
    send: "Send",
    thinking: "Thinking…",
    empty: "Hi! Ask me about training packages, blogs, or coaching with Hassan.",
    error: "Something went wrong. Try again.",
    open: "Open chat",
    close: "Close chat",
  },
  ar: {
    title: "اسأل المدرب",
    subtitle: "إجابات من محتوى موقع حسن فقط",
    placeholder: "اسأل عن التدريب أو الباقات أو النصائح…",
    send: "إرسال",
    thinking: "جاري التفكير…",
    empty: "أهلاً! اسألني عن الباقات أو المدونة أو التدريب مع حسن.",
    error: "حصل خطأ. حاول تاني.",
    open: "فتح الشات",
    close: "إغلاق الشات",
  },
} as const;

export function ChatWidget() {
  const params = useParams();
  const paramLocale = params?.locale;
  const locale: Locale =
    typeof paramLocale === "string" && isLocale(paramLocale)
      ? paramLocale
      : defaultLocale;
  const t = copy[locale];

  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState<Msg[]>([]);
  const [error, setError] = useState<string | null>(null);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, open, loading]);

  async function sendMessage() {
    const text = input.trim();
    if (!text || loading) return;

    const nextMessages: Msg[] = [...messages, { role: "user", content: text }];
    setMessages(nextMessages);
    setInput("");
    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ locale, messages: nextMessages }),
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || t.error);
      }
      setMessages([
        ...nextMessages,
        { role: "assistant", content: data.answer as string },
      ]);
    } catch (err) {
      setError(err instanceof Error ? err.message : t.error);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="fixed bottom-5 end-5 z-[60] flex flex-col items-end gap-3">
      {open && (
        <div className="flex h-[min(560px,70vh)] w-[min(380px,calc(100vw-2rem))] flex-col overflow-hidden rounded-2xl border border-border bg-background shadow-2xl">
          <div className="flex items-start justify-between gap-3 bg-primary px-4 py-3 text-white">
            <div>
              <p className="font-semibold">{t.title}</p>
              <p className="text-xs text-white/75">{t.subtitle}</p>
            </div>
            <button
              type="button"
              onClick={() => setOpen(false)}
              aria-label={t.close}
              className="rounded-lg p-1 hover:bg-white/10"
            >
              <X size={18} />
            </button>
          </div>

          <div className="flex-1 space-y-3 overflow-y-auto px-4 py-3">
            {messages.length === 0 && (
              <p className="rounded-xl bg-card px-3 py-2 text-sm text-muted">
                {t.empty}
              </p>
            )}
            {messages.map((m, i) => (
              <div
                key={`${m.role}-${i}`}
                className={cn(
                  "max-w-[90%] rounded-2xl px-3 py-2 text-sm whitespace-pre-wrap",
                  m.role === "user"
                    ? "ms-auto bg-primary text-white"
                    : "me-auto bg-card text-foreground"
                )}
              >
                {m.content}
              </div>
            ))}
            {loading && (
              <div className="me-auto flex items-center gap-2 rounded-2xl bg-card px-3 py-2 text-sm text-muted">
                <Loader2 className="h-4 w-4 animate-spin" />
                {t.thinking}
              </div>
            )}
            {error && (
              <p className="rounded-xl bg-red-50 px-3 py-2 text-sm text-red-700">
                {error}
              </p>
            )}
            <div ref={bottomRef} />
          </div>

          <form
            className="flex gap-2 border-t border-border p-3"
            onSubmit={(e) => {
              e.preventDefault();
              void sendMessage();
            }}
          >
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder={t.placeholder}
              className="min-w-0 flex-1 rounded-xl border border-border bg-background px-3 py-2 text-sm outline-none focus:border-primary"
              disabled={loading}
            />
            <Button type="submit" size="sm" disabled={loading || !input.trim()}>
              <Send className="h-4 w-4" />
              <span className="sr-only">{t.send}</span>
            </Button>
          </form>
        </div>
      )}

      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-label={open ? t.close : t.open}
        className="flex h-14 w-14 items-center justify-center rounded-full bg-primary text-white shadow-lg transition hover:scale-105"
      >
        {open ? <X size={22} /> : <MessageCircle size={22} />}
      </button>
    </div>
  );
}
