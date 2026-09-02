import type { Metadata } from "next";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { Card, CardTitle } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { getDictionary, getLocaleFromParam, localizedPath } from "@/lib/i18n";

export const metadata: Metadata = { title: "Exercises" };

export default async function ExercisesPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale: localeParam } = await params;
  const locale = getLocaleFromParam(localeParam);
  const t = getDictionary(locale);
  const supabase = await createClient();
  const { data: exercises } = await supabase
    .from("exercises")
    .select("*")
    .eq("is_published", true)
    .order("name");

  return (
    <div className="mx-auto max-w-6xl px-4 py-16">
      <div className="text-center">
        <h1 className="text-4xl font-bold">{t.exercises.title}</h1>
        <p className="mt-4 text-muted">{t.exercises.subtitle}</p>
      </div>

      {exercises && exercises.length > 0 ? (
        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {exercises.map((exercise) => (
            <Link
              key={exercise.id}
              href={localizedPath(locale, `/exercises/${exercise.slug}`)}
            >
              <Card className="overflow-hidden transition-shadow hover:shadow-md">
                <div className="flex aspect-video items-center justify-center bg-primary/10 text-sm text-muted">
                  {exercise.thumbnail_url ? "Video" : t.exercises.videoSoon}
                </div>
                <div className="p-4">
                  <CardTitle>{exercise.name}</CardTitle>
                  <div className="mt-2 flex gap-2">
                    <Badge>{exercise.muscle_group}</Badge>
                    <Badge variant="info">{exercise.difficulty}</Badge>
                  </div>
                </div>
              </Card>
            </Link>
          ))}
        </div>
      ) : (
        <div className="mt-12 text-center text-muted">
          <p>{t.exercises.empty}</p>
        </div>
      )}
    </div>
  );
}
