import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { Badge } from "@/components/ui/Badge";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const supabase = await createClient();
  const { data } = await supabase.from("exercises").select("name").eq("slug", slug).single();
  return { title: data?.name || "Exercise" };
}

export default async function ExerciseDetailPage({ params }: Props) {
  const { slug } = await params;
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
      <div className="flex gap-2 mb-4">
        <Badge>{exercise.muscle_group}</Badge>
        <Badge variant="info">{exercise.difficulty}</Badge>
      </div>

      <h1 className="text-4xl font-bold">{exercise.name}</h1>
      {exercise.description && (
        <p className="mt-4 text-lg text-muted">{exercise.description}</p>
      )}

      <div className="mt-8 aspect-video rounded-xl bg-primary/10 flex items-center justify-center">
        {exercise.video_url ? (
          <video src={exercise.video_url} controls className="w-full h-full rounded-xl object-cover" />
        ) : (
          <p className="text-muted">Video coming soon</p>
        )}
      </div>

      {exercise.instructions.length > 0 && (
        <div className="mt-8">
          <h2 className="text-xl font-bold">Instructions</h2>
          <ol className="mt-4 list-decimal space-y-2 pl-5">
            {exercise.instructions.map((step: string, i: number) => (
              <li key={i}>{step}</li>
            ))}
          </ol>
        </div>
      )}

      {exercise.common_mistakes.length > 0 && (
        <div className="mt-8">
          <h2 className="text-xl font-bold">Common Mistakes</h2>
          <ul className="mt-4 list-disc space-y-2 pl-5 text-muted">
            {exercise.common_mistakes.map((mistake: string, i: number) => (
              <li key={i}>{mistake}</li>
            ))}
          </ul>
        </div>
      )}

      {exercise.tips && (
        <div className="mt-8 rounded-lg bg-primary/5 p-6">
          <h2 className="font-bold text-primary">Coach Tip</h2>
          <p className="mt-2">{exercise.tips}</p>
        </div>
      )}
    </div>
  );
}
