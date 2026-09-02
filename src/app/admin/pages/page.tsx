"use client";

import Link from "next/link";
import { ADMIN_PAGES_MAP } from "@/lib/constants";
import { Card, CardTitle, CardDescription } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { ExternalLink, Pencil } from "lucide-react";
import { useAdminLocale } from "@/components/i18n/AdminLocaleProvider";
import { localizedPath } from "@/lib/i18n";

export default function AdminPagesOverview() {
  const { locale, t } = useAdminLocale();
  const pages = t.admin.pages;

  return (
    <div>
      <h1 className="text-2xl font-bold">{pages.title}</h1>
      <p className="text-muted">{pages.subtitle}</p>

      <div className="mt-8 grid gap-4 md:grid-cols-2">
        {ADMIN_PAGES_MAP.map((page) => {
          const livePath = localizedPath(locale, page.publicPath);
          const title = pages[page.pageKey];
          const description = pages[`${page.pageKey}Desc` as keyof typeof pages];
          const media = pages[`${page.pageKey}Media` as keyof typeof pages];

          return (
            <Card key={page.adminHref}>
              <div className="flex items-start justify-between gap-3">
                <div>
                  <CardTitle>{title}</CardTitle>
                  <p className="mt-1 font-mono text-xs text-muted">{livePath}</p>
                  <CardDescription className="mt-2">{description}</CardDescription>
                  <p className="mt-2 text-xs text-primary">
                    {t.admin.media}: {media}
                  </p>
                </div>
              </div>
              <div className="mt-4 flex flex-wrap gap-2">
                <Link href={page.adminHref}>
                  <Button size="sm">
                    <Pencil className="me-1 h-3.5 w-3.5" /> {t.admin.editPage}
                  </Button>
                </Link>
                <Link href={livePath} target="_blank">
                  <Button size="sm" variant="outline">
                    {t.admin.viewLive} <ExternalLink className="ms-1 h-3.5 w-3.5" />
                  </Button>
                </Link>
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
