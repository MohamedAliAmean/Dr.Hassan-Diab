import { createClient } from "@/lib/supabase/server";
import { Badge } from "@/components/ui/Badge";
import { format } from "date-fns";

export default async function AdminClientsPage() {
  const supabase = await createClient();
  const { data: clients } = await supabase
    .from("profiles")
    .select("*")
    .eq("role", "client")
    .order("created_at", { ascending: false });

  return (
    <div>
      <h1 className="text-2xl font-bold">Clients</h1>
      <p className="text-muted">Manage your coaching clients.</p>

      <div className="mt-6 overflow-x-auto rounded-xl border border-border">
        <table className="w-full text-sm">
          <thead className="bg-card">
            <tr>
              <th className="px-4 py-3 text-left font-medium">Name</th>
              <th className="px-4 py-3 text-left font-medium">Phone</th>
              <th className="px-4 py-3 text-left font-medium">Experience</th>
              <th className="px-4 py-3 text-left font-medium">Joined</th>
            </tr>
          </thead>
          <tbody>
            {clients?.map((client) => (
              <tr key={client.id} className="border-t border-border">
                <td className="px-4 py-3 font-medium">{client.full_name || "—"}</td>
                <td className="px-4 py-3">{client.phone || "—"}</td>
                <td className="px-4 py-3">
                  {client.experience_level ? (
                    <Badge>{client.experience_level}</Badge>
                  ) : "—"}
                </td>
                <td className="px-4 py-3 text-muted">
                  {format(new Date(client.created_at), "MMM d, yyyy")}
                </td>
              </tr>
            ))}
            {(!clients || clients.length === 0) && (
              <tr>
                <td colSpan={4} className="px-4 py-8 text-center text-muted">
                  No clients yet. Create client accounts from Supabase Auth.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
