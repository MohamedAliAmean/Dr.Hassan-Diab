"use client";

import { useState } from "react";
import { CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";
import { Card } from "@/components/ui/Card";
import type { Dictionary } from "@/lib/i18n";

export function BookForm({ t }: { t: Dictionary }) {
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({
    full_name: "",
    email: "",
    phone: "",
    scheduled_at: "",
    notes: "",
  });

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    try {
      const res = await fetch("/api/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, type: "assessment" }),
      });
      if (res.ok) setSubmitted(true);
    } finally {
      setSubmitting(false);
    }
  }

  if (submitted) {
    return (
      <div className="mx-auto max-w-lg px-4 py-16">
        <Card className="text-center">
          <CheckCircle className="mx-auto h-16 w-16 text-primary" />
          <h2 className="mt-4 text-2xl font-bold">{t.book.confirmedTitle}</h2>
          <p className="mt-2 text-muted">{t.book.confirmedBody}</p>
        </Card>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-lg px-4 py-16">
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-bold">{t.book.title}</h1>
        <p className="mt-2 text-muted">{t.book.subtitle}</p>
      </div>

      <Card>
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            placeholder={t.book.fullName}
            value={form.full_name}
            onChange={(e) => setForm({ ...form, full_name: e.target.value })}
            required
          />
          <Input
            type="email"
            placeholder={t.book.email}
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            required
          />
          <Input
            type="tel"
            placeholder={t.book.phone}
            value={form.phone}
            onChange={(e) => setForm({ ...form, phone: e.target.value })}
          />
          <div>
            <label className="text-sm font-medium">{t.book.preferred}</label>
            <Input
              type="datetime-local"
              value={form.scheduled_at}
              onChange={(e) => setForm({ ...form, scheduled_at: e.target.value })}
              required
              className="mt-1"
            />
          </div>
          <Textarea
            placeholder={t.book.notes}
            value={form.notes}
            onChange={(e) => setForm({ ...form, notes: e.target.value })}
          />
          <Button type="submit" className="w-full" disabled={submitting}>
            {submitting ? t.book.booking : t.book.submit}
          </Button>
        </form>
      </Card>
    </div>
  );
}
