"use client";

import { useState } from "react";
import { Mail, Phone, MapPin } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";
import { Card } from "@/components/ui/Card";
import type { Dictionary, Locale } from "@/lib/i18n";

export function ContactForm({
  t,
  settings,
}: {
  locale: Locale;
  t: Dictionary;
  settings: {
    email: string;
    phone: string;
    whatsapp: string;
    address: string;
  };
}) {
  const [sent, setSent] = useState(false);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSent(true);
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-16">
      <div className="text-center">
        <h1 className="text-4xl font-bold">{t.contact.title}</h1>
        <p className="mt-4 text-muted">{t.contact.subtitle}</p>
      </div>

      <div className="mt-12 grid gap-12 md:grid-cols-2">
        <div className="space-y-6">
          <div className="flex items-center gap-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
              <Mail className="h-5 w-5 text-primary" />
            </div>
            <div>
              <p className="font-medium">{t.contact.email}</p>
              <p className="text-sm text-muted">
                {settings.email || t.contact.addEmail}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
              <Phone className="h-5 w-5 text-primary" />
            </div>
            <div>
              <p className="font-medium">{t.contact.phone}</p>
              <p className="text-sm text-muted">
                {settings.whatsapp || settings.phone || t.contact.addPhone}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
              <MapPin className="h-5 w-5 text-primary" />
            </div>
            <div>
              <p className="font-medium">{t.contact.location}</p>
              <p className="text-sm text-muted">
                {settings.address || t.contact.addAddress}
              </p>
            </div>
          </div>
        </div>

        <Card>
          {sent ? (
            <p className="text-center font-medium text-primary">{t.contact.sent}</p>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <Input placeholder={t.contact.name} required />
              <Input type="email" placeholder={t.contact.yourEmail} required />
              <Textarea placeholder={t.contact.message} required />
              <Button type="submit" className="w-full">
                {t.contact.send}
              </Button>
            </form>
          )}
        </Card>
      </div>
    </div>
  );
}
