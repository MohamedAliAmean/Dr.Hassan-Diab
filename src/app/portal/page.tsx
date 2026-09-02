import { createClient } from "@/lib/supabase/server";
import { Card, CardTitle, CardDescription } from "@/components/ui/Card";
import { Calendar, TrendingUp, Dumbbell } from "lucide-react";
import Link from "next/link";

export default async function PortalDashboard() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user!.id)
    .single();

  const { data: activeProgram } = await supabase
    .from("programs")
    .select("*")
    .eq("client_id", user!.id)
    .eq("status", "active")
    .limit(1)
    .single();

  const { data: latestProgress } = await supabase
    .from("progress_entries")
    .select("*")
    .eq("client_id", user!.id)
    .order("recorded_at", { ascending: false })
    .limit(1)
    .single();

  return (
    <div>
      <h1 className="text-2xl font-bold">
        Welcome back, {profile?.full_name?.split(" ")[0] || "Athlete"}
      </h1>
      <p className="text-muted">Here&apos;s your training overview.</p>

      <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        <Link href="/portal/program">
          <Card className="transition-shadow hover:shadow-md">
            <Calendar className="h-8 w-8 text-primary" />
            <CardTitle className="mt-4">Current Program</CardTitle>
            <CardDescription>
              {activeProgram ? activeProgram.name : "No active program assigned yet"}
            </CardDescription>
          </Card>
        </Link>

        <Link href="/portal/progress">
          <Card className="transition-shadow hover:shadow-md">
            <TrendingUp className="h-8 w-8 text-primary" />
            <CardTitle className="mt-4">Latest Weight</CardTitle>
            <CardDescription>
              {latestProgress?.weight_kg ? `${latestProgress.weight_kg} kg` : "No data logged yet"}
            </CardDescription>
          </Card>
        </Link>

        <Link href="/portal/log">
          <Card className="transition-shadow hover:shadow-md">
            <Dumbbell className="h-8 w-8 text-primary" />
            <CardTitle className="mt-4">Log Workout</CardTitle>
            <CardDescription>Record today&apos;s training session</CardDescription>
          </Card>
        </Link>
      </div>
    </div>
  );
}
