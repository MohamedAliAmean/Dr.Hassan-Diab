import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { Badge } from "@/components/ui/Badge";
import { OptimizedVideo } from "@/components/ui/OptimizedVideo";
import { getDictionary, getLocaleFromParam } from "@/lib/i18n";
import { decodeParam } from "@/lib/utils";

interface Props {
  params: Promise<{ slug: string; locale: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug: rawSlug } = await params;
  const slug = decodeParam(rawSlug);
  const supabase = await createClient();
  const { data } = await supabase.from("exercises").select("name").eq("slug", slug).single();
  return { title: data?.name || "Exercise" };
}

export default async function ExerciseDetailPage({ params }: Props) {
  const { slug: rawSlug, locale: localeParam } = await params;
  const slug = decodeParam(rawSlug);
  const locale = getLocaleFromParam(localeParam);
  const t = getDictionary(locale);
  const supabase = await createClient();

  const { data: exercise } = await supabase
    .from("exercises")
    .select("*")
    .eq("slug", slug)
    .eq("is_published", true)
    .single();

  if (!exercise) notFound();

  return (
    <div className="mx-auto max-w-4xl px-4 py-16">
      <div className="mb-4 flex gap-2">
        <Badge>{exercise.muscle_group}</Badge>
        <Badge variant="info">{exercise.difficulty}</Badge>
      </div>

      <h1 className="text-4xl font-bold">{exercise.name}</h1>
      {exercise.description && (
        <p className="mt-4 text-lg text-muted">{exercise.description}</p>
      )}

      <div className="mt-8 flex aspect-video items-center justify-center overflow-hidden rounded-xl bg-primary/10">
        {exercise.video_url ? (
          <OptimizedVideo
            src={exercise.video_url}
            className="h-full w-full object-cover"
          />
        ) : (
          <p className="text-muted">{t.exercises.videoSoon}</p>
        )}
      </div>

      {exercise.instructions.length > 0 && (
        <div className="mt-8">
          <h2 className="text-xl font-bold">{t.exercises.instructions}</h2>
          <ol className="mt-4 list-decimal space-y-2 ps-5">
            {exercise.instructions.map((step: string, i: number) => (
              <li key={i}>{step}</li>
            ))}
          </ol>
        </div>
      )}

      {exercise.common_mistakes.length > 0 && (
        <div className="mt-8">
          <h2 className="text-xl font-bold">{t.exercises.mistakes}</h2>
          <ul className="mt-4 list-disc space-y-2 ps-5 text-muted">
            {exercise.common_mistakes.map((mistake: string, i: number) => (
              <li key={i}>{mistake}</li>
            ))}
          </ul>
        </div>
      )}

      {exercise.tips && (
        <div className="mt-8 rounded-lg bg-primary/5 p-6">
          <h2 className="font-bold text-primary">{t.exercises.coachTip}</h2>
          <p className="mt-2">{exercise.tips}</p>
        </div>
      )}
    </div>
  );
}
