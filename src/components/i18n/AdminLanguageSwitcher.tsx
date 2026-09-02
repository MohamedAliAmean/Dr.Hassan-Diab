"use client";

import { locales, type Locale } from "@/lib/i18n";
import { cn } from "@/lib/utils";
import { useAdminLocale } from "@/components/i18n/AdminLocaleProvider";

export function AdminLanguageSwitcher() {
  const { locale, setLocale, t } = useAdminLocale();

  return (
    <div className="flex items-center gap-1 rounded-lg border border-border p-1 text-xs">
      {locales.map((item) => {
        const active = item === locale;
        return (
          <button
            key={item}
            type="button"
            onClick={() => setLocale(item as Locale)}
            className={cn(
              "rounded-md px-2 py-1 transition-colors",
              active
                ? "bg-primary text-white"
                : "text-muted hover:text-foreground"
            )}
          >
            {item === "ar" ? t.common.arabic : t.common.english}
          </button>
        );
      })}
    </div>
  );
}
