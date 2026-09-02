"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import type { ComponentProps } from "react";
import { defaultLocale, isLocale, localizedPath, type Locale } from "@/lib/i18n";

type LocaleLinkProps = Omit<ComponentProps<typeof Link>, "href"> & {
  href: string;
  locale?: Locale;
};

export function LocaleLink({ href, locale, ...props }: LocaleLinkProps) {
  const params = useParams();
  const paramLocale = params?.locale;
  const activeLocale =
    locale ||
    (typeof paramLocale === "string" && isLocale(paramLocale)
      ? paramLocale
      : defaultLocale);

  return <Link href={localizedPath(activeLocale, href)} {...props} />;
}
