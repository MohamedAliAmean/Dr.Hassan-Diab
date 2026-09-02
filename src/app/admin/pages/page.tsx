import Link from "next/link";
import { ADMIN_PAGES_MAP } from "@/lib/constants";
import { Card, CardTitle, CardDescription } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { ExternalLink, Pencil } from "lucide-react";

export default function AdminPagesOverview() {
  return (
    <div>
      <h1 className="text-2xl font-bold">Website Pages</h1>
      <p className="text-muted">
        Each card is one public page. Open it to edit its text, images, and videos.
      </p>

      <div className="mt-8 grid gap-4 md:grid-cols-2">
        {ADMIN_PAGES_MAP.map((page) => (
          <Card key={page.path}>
            <div className="flex items-start justify-between gap-3">
              <div>
                <CardTitle>{page.title}</CardTitle>
                <p className="mt-1 font-mono text-xs text-muted">{page.path}</p>
                <CardDescription className="mt-2">{page.description}</CardDescription>
                <p className="mt-2 text-xs text-primary">Media: {page.media}</p>
              </div>
            </div>
            <div className="mt-4 flex flex-wrap gap-2">
              <Link href={page.adminHref}>
                <Button size="sm">
                  <Pencil className="mr-1 h-3.5 w-3.5" /> Edit page
                </Button>
              </Link>
              <Link href={page.path} target="_blank">
                <Button size="sm" variant="outline">
                  View live <ExternalLink className="ml-1 h-3.5 w-3.5" />
                </Button>
              </Link>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
