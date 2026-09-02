import { createClient } from "@/lib/supabase/server";
import { Badge } from "@/components/ui/Badge";

export default async function AdminChallengesPage() {
  const supabase = await createClient();
  const { data: challenges } = await supabase
    .from("challenges")
    .select("*")
    .order("created_at", { ascending: false });

  return (
    <div>
      <h1 className="text-2xl font-bold">Challenges</h1>
      <p className="text-muted">Monthly community challenges for clients.</p>

      <div className="mt-6 grid gap-4 md:grid-cols-2">
        {challenges?.map((challenge) => (
          <div key={challenge.id} className="rounded-xl border border-border p-6">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold">{challenge.title}</h3>
              <Badge variant={challenge.is_active ? "success" : "warning"}>
                {challenge.is_active ? "Active" : "Inactive"}
              </Badge>
            </div>
            <p className="mt-2 text-sm text-muted">{challenge.description}</p>
          </div>
        ))}
        {(!challenges || challenges.length === 0) && (
          <p className="text-muted">No challenges yet. Challenge management coming in Phase 2.</p>
        )}
      </div>
    </div>
  );
}
