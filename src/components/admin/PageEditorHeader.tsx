"use client";

import Link from "next/link";
import { ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { useAdminLocale } from "@/components/i18n/AdminLocaleProvider";
import { localizedPath } from "@/lib/i18n";

interface PageEditorHeaderProps {
  title: string;
  publicPath: string;
  description: string;
}

export function PageEditorHeader({
  title,
  publicPath,
  description,
}: PageEditorHeaderProps) {
  const { locale, t } = useAdminLocale();
  const livePath = localizedPath(locale, publicPath);

  return (
    <div className="mb-6 rounded-xl border border-border bg-card p-5">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <p className="text-xs font-medium uppercase tracking-wide text-primary">
            {t.admin.editor.editing}
          </p>
          <h1 className="mt-1 text-2xl font-bold">{title}</h1>
          <p className="mt-1 text-sm text-muted">{description}</p>
          <p className="mt-2 font-mono text-xs text-muted">
            {t.admin.editor.publicUrl}: {livePath}
          </p>
        </div>
        <Link href={livePath} target="_blank">
          <Button variant="outline" size="sm">
            {t.admin.editor.viewLivePage}{" "}
            <ExternalLink className="ms-2 h-3.5 w-3.5" />
          </Button>
        </Link>
      </div>
    </div>
  );
}
