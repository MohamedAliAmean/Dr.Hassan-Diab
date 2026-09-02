import type { Metadata } from "next";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { Card, CardTitle, CardDescription } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { getDictionary, getLocaleFromParam, localizedPath } from "@/lib/i18n";

export const metadata: Metadata = { title: "Results" };

export default async function TransformationsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale: localeParam } = await params;
  const locale = getLocaleFromParam(localeParam);
  const t = getDictionary(locale);
  const supabase = await createClient();
  const { data: transformations } = await supabase
    .from("transformations")
    .select("*")
    .eq("is_published", true)
    .order("sort_order");

  return (
    <div className="mx-auto max-w-6xl px-4 py-16">
      <div className="text-center">
        <h1 className="text-4xl font-bold">{t.results.title}</h1>
        <p className="mt-4 text-muted">{t.results.subtitle}</p>
      </div>

      {transformations && transformations.length > 0 ? (
        <div className="mt-12 grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {transformations.map((item) => (
            <Link
              key={item.id}
              href={localizedPath(locale, `/transformations/${item.slug}`)}
            >
              <Card className="overflow-hidden transition-shadow hover:shadow-md">
                <div className="grid grid-cols-2 gap-1">
                  <div className="flex aspect-square items-center justify-center bg-primary/10 text-xs text-muted">
                    Before
                  </div>
                  <div className="flex aspect-square items-center justify-center bg-primary/20 text-xs text-muted">
                    After
                  </div>
                </div>
                <div className="p-4">
                  <CardTitle>{item.title}</CardTitle>
                  <CardDescription>{item.summary}</CardDescription>
                  {item.duration_weeks && (
                    <Badge className="mt-2">
                      {item.duration_weeks} {t.results.weeks}
                    </Badge>
                  )}
                </div>
              </Card>
            </Link>
          ))}
        </div>
      ) : (
        <div className="mt-12 text-center text-muted">
          <p>{t.results.empty}</p>
        </div>
      )}
    </div>
  );
}
