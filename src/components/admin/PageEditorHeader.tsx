"use client";

import Link from "next/link";
import { ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/Button";

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
  return (
    <div className="mb-6 rounded-xl border border-border bg-card p-5">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <p className="text-xs font-medium uppercase tracking-wide text-primary">
            Editing website page
          </p>
          <h1 className="mt-1 text-2xl font-bold">{title}</h1>
          <p className="mt-1 text-sm text-muted">{description}</p>
          <p className="mt-2 font-mono text-xs text-muted">Public URL: {publicPath}</p>
        </div>
        <Link href={publicPath} target="_blank">
          <Button variant="outline" size="sm">
            View live page <ExternalLink className="ml-2 h-3.5 w-3.5" />
          </Button>
        </Link>
      </div>
    </div>
  );
}
