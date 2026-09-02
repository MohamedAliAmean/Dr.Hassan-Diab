import type { Metadata } from "next";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { Card, CardTitle, CardDescription } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";

export const metadata: Metadata = {
  title: "Client Transformations",
};

export default async function TransformationsPage() {
  const supabase = await createClient();
  const { data: transformations } = await supabase
    .from("transformations")
    .select("*")
    .eq("is_published", true)
    .order("sort_order");

  return (
    <div className="mx-auto max-w-6xl px-4 py-16">
      <div className="text-center">
        <h1 className="text-4xl font-bold">Real Results</h1>
        <p className="mt-4 text-muted">
          Every transformation tells a story. See the journeys of clients who committed to the process.
        </p>
      </div>

      {transformations && transformations.length > 0 ? (
        <div className="mt-12 grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {transformations.map((t) => (
            <Link key={t.id} href={`/transformations/${t.slug}`}>
              <Card className="overflow-hidden transition-shadow hover:shadow-md">
                <div className="grid grid-cols-2 gap-1">
                  <div className="aspect-square bg-primary/10 flex items-center justify-center text-xs text-muted">
                    Before
                  </div>
                  <div className="aspect-square bg-primary/20 flex items-center justify-center text-xs text-muted">
                    After
                  </div>
                </div>
                <div className="p-4">
                  <CardTitle>{t.title}</CardTitle>
                  <CardDescription>{t.summary}</CardDescription>
                  {t.duration_weeks && (
                    <Badge className="mt-2">{t.duration_weeks} weeks</Badge>
                  )}
                </div>
              </Card>
            </Link>
          ))}
        </div>
      ) : (
        <div className="mt-12 text-center text-muted">
          <p>Transformation stories coming soon. Check back after admin adds content.</p>
        </div>
      )}
    </div>
  );
}
