import type { Metadata } from "next";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { Card, CardTitle } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";

export const metadata: Metadata = {
  title: "Exercise Library",
};

export default async function ExercisesPage() {
  const supabase = await createClient();
  const { data: exercises } = await supabase
    .from("exercises")
    .select("*")
    .eq("is_published", true)
    .order("name");

  return (
    <div className="mx-auto max-w-6xl px-4 py-16">
      <div className="text-center">
        <h1 className="text-4xl font-bold">Exercise Library</h1>
        <p className="mt-4 text-muted">
          Learn proper form with video demonstrations and coaching tips from Hassan.
        </p>
      </div>

      {exercises && exercises.length > 0 ? (
        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {exercises.map((exercise) => (
            <Link key={exercise.id} href={`/exercises/${exercise.slug}`}>
              <Card className="overflow-hidden transition-shadow hover:shadow-md">
                <div className="aspect-video bg-primary/10 flex items-center justify-center text-muted text-sm">
                  {exercise.thumbnail_url ? "Video" : "No thumbnail"}
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
          <p>Exercise library coming soon. Hassan will add exercises from the admin panel.</p>
        </div>
      )}
    </div>
  );
}
