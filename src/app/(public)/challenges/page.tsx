import type { Metadata } from "next";
import { createClient } from "@/lib/supabase/server";
import { Card, CardTitle, CardDescription } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";

export const metadata: Metadata = {
  title: "Monthly Challenges",
};

export default async function ChallengesPage() {
  const supabase = await createClient();
  const { data: challenges } = await supabase
    .from("challenges")
    .select("*")
    .eq("is_active", true)
    .order("start_date", { ascending: false });

  return (
    <div className="mx-auto max-w-6xl px-4 py-16">
      <div className="text-center">
        <h1 className="text-4xl font-bold">Monthly Challenges</h1>
        <p className="mt-4 text-muted">
          Join the community challenge and push yourself alongside other clients.
        </p>
      </div>

      {challenges && challenges.length > 0 ? (
        <div className="mt-12 grid gap-8 md:grid-cols-2">
          {challenges.map((challenge) => (
            <Card key={challenge.id}>
              <Badge variant="success" className="mb-4">Active</Badge>
              <CardTitle>{challenge.title}</CardTitle>
              <CardDescription>{challenge.description}</CardDescription>
              {challenge.rules.length > 0 && (
                <ul className="mt-4 list-disc space-y-1 pl-5 text-sm text-muted">
                  {challenge.rules.map((rule: string, i: number) => (
                    <li key={i}>{rule}</li>
                  ))}
                </ul>
              )}
            </Card>
          ))}
        </div>
      ) : (
        <div className="mt-12 text-center text-muted">
          <p>No active challenges right now. Check back soon!</p>
        </div>
      )}
    </div>
  );
}
