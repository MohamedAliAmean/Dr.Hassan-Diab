import { createClient } from "@/lib/supabase/server";
import { Card, CardTitle } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";

export default async function PortalProgramPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  const { data: program } = await supabase
    .from("programs")
    .select("*")
    .eq("client_id", user!.id)
    .eq("status", "active")
    .limit(1)
    .single();

  let days: Array<{
    id: string;
    day_name: string;
    day_number: number;
    program_exercises: Array<{
      sets: number | null;
      reps: string | null;
      exercises: { name: string } | null;
    }>;
  }> = [];

  if (program) {
    const { data } = await supabase
      .from("program_days")
      .select("*, program_exercises(*, exercises(name))")
      .eq("program_id", program.id)
      .order("sort_order");
    days = data || [];
  }

  return (
    <div>
      <h1 className="text-2xl font-bold">My Program</h1>

      {program ? (
        <div className="mt-6">
          <h2 className="text-lg font-semibold">{program.name}</h2>
          {program.description && <p className="text-muted">{program.description}</p>}

          <div className="mt-6 space-y-6">
            {days.map((day) => (
              <Card key={day.id}>
                <CardTitle>
                  Day {day.day_number}: {day.day_name}
                </CardTitle>
                <div className="mt-4 space-y-3">
                  {day.program_exercises.map((pe, i) => (
                    <div key={i} className="flex items-center justify-between rounded-lg bg-background p-3">
                      <span className="font-medium">{pe.exercises?.name || "Exercise"}</span>
                      <Badge>
                        {pe.sets}×{pe.reps}
                      </Badge>
                    </div>
                  ))}
                  {day.program_exercises.length === 0 && (
                    <p className="text-sm text-muted">No exercises assigned for this day.</p>
                  )}
                </div>
              </Card>
            ))}
          </div>
        </div>
      ) : (
        <Card className="mt-6 text-center">
          <p className="text-muted">No active program assigned yet. Hassan will set up your program soon.</p>
        </Card>
      )}
    </div>
  );
}
