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
  const { data } = await supabase
    .from("transformations")
    .select("title")
    .eq("slug", slug)
    .single();
  return { title: data?.title || "Transformation" };
}

export default async function TransformationDetailPage({ params }: Props) {
  const { slug } = await params;
  const supabase = await createClient();

  const { data: transformation } = await supabase
    .from("transformations")
    .select("*")
    .eq("slug", slug)
    .eq("is_published", true)
    .single();

  if (!transformation) notFound();

  const { data: milestones } = await supabase
    .from("transformation_milestones")
    .select("*")
    .eq("transformation_id", transformation.id)
    .order("sort_order");

  return (
    <div className="mx-auto max-w-4xl px-4 py-16">
      <h1 className="text-4xl font-bold">{transformation.title}</h1>
      <p className="mt-2 text-lg text-muted">{transformation.summary}</p>

      <div className="mt-4 flex gap-2">
        {transformation.goal && <Badge>{transformation.goal}</Badge>}
        {transformation.duration_weeks && (
          <Badge variant="info">{transformation.duration_weeks} weeks</Badge>
        )}
      </div>

      <div className="mt-8 grid grid-cols-2 gap-4">
        <div className="aspect-[3/4] rounded-xl bg-primary/10 flex items-center justify-center text-muted">
          Before
        </div>
        <div className="aspect-[3/4] rounded-xl bg-primary/20 flex items-center justify-center text-muted">
          After
        </div>
      </div>

      {milestones && milestones.length > 0 && (
        <div className="mt-12">
          <h2 className="text-2xl font-bold">The Journey</h2>
          <div className="mt-6 space-y-6">
            {milestones.map((m) => (
              <div key={m.id} className="flex gap-4 border-l-2 border-primary pl-6">
                <div>
                  <h3 className="font-semibold">{m.title}</h3>
                  <p className="text-sm text-muted">{m.description}</p>
                  <div className="mt-2 flex gap-4 text-sm">
                    {m.weight_kg && <span>Weight: {m.weight_kg} kg</span>}
                    {m.body_fat_pct && <span>Body fat: {m.body_fat_pct}%</span>}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
