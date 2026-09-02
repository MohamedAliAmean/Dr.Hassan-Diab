import { createClient } from "@/lib/supabase/server";
import { Badge } from "@/components/ui/Badge";
import { format } from "date-fns";

export default async function AdminLeadsPage() {
  const supabase = await createClient();
  const { data: leads } = await supabase
    .from("leads")
    .select("*")
    .order("created_at", { ascending: false });

  const statusVariant = {
    new: "info" as const,
    contacted: "warning" as const,
    converted: "success" as const,
    lost: "danger" as const,
  };

  return (
    <div>
      <h1 className="text-2xl font-bold">Leads</h1>
      <p className="text-muted">Path Finder submissions and inquiries.</p>

      <div className="mt-6 overflow-x-auto rounded-xl border border-border">
        <table className="w-full text-sm">
          <thead className="bg-card">
            <tr>
              <th className="px-4 py-3 text-left font-medium">Name</th>
              <th className="px-4 py-3 text-left font-medium">Email</th>
              <th className="px-4 py-3 text-left font-medium">Goal</th>
              <th className="px-4 py-3 text-left font-medium">Experience</th>
              <th className="px-4 py-3 text-left font-medium">Status</th>
              <th className="px-4 py-3 text-left font-medium">Date</th>
            </tr>
          </thead>
          <tbody>
            {leads?.map((lead) => (
              <tr key={lead.id} className="border-t border-border">
                <td className="px-4 py-3">{lead.full_name}</td>
                <td className="px-4 py-3">{lead.email}</td>
                <td className="px-4 py-3">{lead.goal?.replace("_", " ") || "—"}</td>
                <td className="px-4 py-3">{lead.experience || "—"}</td>
                <td className="px-4 py-3">
                  <Badge variant={statusVariant[lead.status as keyof typeof statusVariant]}>{lead.status}</Badge>
                </td>
                <td className="px-4 py-3 text-muted">
                  {format(new Date(lead.created_at), "MMM d, yyyy")}
                </td>
              </tr>
            ))}
            {(!leads || leads.length === 0) && (
              <tr>
                <td colSpan={6} className="px-4 py-8 text-center text-muted">
                  No leads yet. They will appear here when visitors complete the Path Finder.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
