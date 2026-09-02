import { createClient } from "@/lib/supabase/server";
import { Badge } from "@/components/ui/Badge";

export default async function AdminProgramsPage() {
  const supabase = await createClient();
  const { data: programs } = await supabase
    .from("programs")
    .select("*, profiles(full_name)")
    .order("created_at", { ascending: false });

  const statusVariant = {
    active: "success" as const,
    completed: "info" as const,
    paused: "warning" as const,
  };

  return (
    <div>
      <h1 className="text-2xl font-bold">Training Programs</h1>
      <p className="text-muted">Create and manage client training programs.</p>

      <div className="mt-6 overflow-x-auto rounded-xl border border-border">
        <table className="w-full text-sm">
          <thead className="bg-card">
            <tr>
              <th className="px-4 py-3 text-left font-medium">Program</th>
              <th className="px-4 py-3 text-left font-medium">Client</th>
              <th className="px-4 py-3 text-left font-medium">Status</th>
              <th className="px-4 py-3 text-left font-medium">Period</th>
            </tr>
          </thead>
          <tbody>
            {programs?.map((program) => {
              const client = program.profiles as unknown as { full_name: string } | null;
              return (
                <tr key={program.id} className="border-t border-border">
                  <td className="px-4 py-3 font-medium">{program.name}</td>
                  <td className="px-4 py-3">{client?.full_name || "—"}</td>
                  <td className="px-4 py-3">
                    <Badge variant={statusVariant[program.status as keyof typeof statusVariant]}>{program.status}</Badge>
                  </td>
                  <td className="px-4 py-3 text-muted">
                    {program.start_date || "—"} → {program.end_date || "—"}
                  </td>
                </tr>
              );
            })}
            {(!programs || programs.length === 0) && (
              <tr>
                <td colSpan={4} className="px-4 py-8 text-center text-muted">
                  No programs yet. Program builder coming in Phase 2.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
