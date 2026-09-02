"use client";

import { useState } from "react";
import { Menu, X } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { LocaleLink } from "@/components/i18n/LocaleLink";
import { LanguageSwitcher } from "@/components/i18n/LanguageSwitcher";
import type { Dictionary, Locale } from "@/lib/i18n";

export function Header({ locale, t }: { locale: Locale; t: Dictionary }) {
  const [open, setOpen] = useState(false);

  const nav = [
    { href: "/about", label: t.nav.about },
    { href: "/services", label: t.nav.services },
    { href: "/transformations", label: t.nav.results },
    { href: "/exercises", label: t.nav.exercises },
    { href: "/blog", label: t.nav.blog },
    { href: "/contact", label: t.nav.contact },
  ];

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-background/95 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-3 px-4">
        <LocaleLink href="/" className="text-xl font-bold text-primary">
          {t.brand}
        </LocaleLink>

        <nav className="hidden items-center gap-6 lg:flex">
          {nav.map((item) => (
            <LocaleLink
              key={item.href}
              href={item.href}
              className="text-sm text-muted transition-colors hover:text-foreground"
            >
              {item.label}
            </LocaleLink>
          ))}
        </nav>

        <div className="hidden items-center gap-3 md:flex">
          <LanguageSwitcher
            locale={locale}
            labels={{ english: t.common.english, arabic: t.common.arabic }}
          />
          <LocaleLink href="/start">
            <Button size="sm">{t.nav.findPath}</Button>
          </LocaleLink>
          <LocaleLink href="/book">
            <Button variant="outline" size="sm">
              {t.nav.bookAssessment}
            </Button>
          </LocaleLink>
        </div>

        <button
          className="md:hidden"
          onClick={() => setOpen(!open)}
          aria-label="Toggle menu"
        >
          {open ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {open && (
        <div className="border-t border-border bg-background px-4 py-4 md:hidden">
          <nav className="flex flex-col gap-4">
            {nav.map((item) => (
              <LocaleLink
                key={item.href}
                href={item.href}
                className="text-sm"
                onClick={() => setOpen(false)}
              >
                {item.label}
              </LocaleLink>
            ))}
            <LanguageSwitcher
              locale={locale}
              labels={{ english: t.common.english, arabic: t.common.arabic }}
            />
            <LocaleLink href="/start" onClick={() => setOpen(false)}>
              <Button className="w-full">{t.nav.findPath}</Button>
            </LocaleLink>
          </nav>
        </div>
      )}
    </header>
  );
}
