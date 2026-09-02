"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { locales, stripLocaleFromPath, type Locale } from "@/lib/i18n";
import { cn } from "@/lib/utils";

export function LanguageSwitcher({
  locale,
  labels,
}: {
  locale: Locale;
  labels: { english: string; arabic: string };
}) {
  const pathname = usePathname() || "/";
  const pathWithoutLocale = stripLocaleFromPath(pathname);

  return (
    <div className="flex items-center gap-1 rounded-lg border border-border p-1 text-xs">
      {locales.map((item) => {
        const href =
          pathWithoutLocale === "/"
            ? `/${item}`
            : `/${item}${pathWithoutLocale}`;
        const active = item === locale;
        return (
          <Link
            key={item}
            href={href}
            className={cn(
              "rounded-md px-2 py-1 transition-colors",
              active
                ? "bg-primary text-white"
                : "text-muted hover:text-foreground"
            )}
            hrefLang={item}
          >
            {item === "ar" ? labels.arabic : labels.english}
          </Link>
        );
      })}
    </div>
  );
}
