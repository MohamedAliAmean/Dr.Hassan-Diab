import { createClient } from "@/lib/supabase/server";
import { Badge } from "@/components/ui/Badge";
import { format } from "date-fns";

export default async function AdminBookingsPage() {
  const supabase = await createClient();
  const { data: bookings } = await supabase
    .from("bookings")
    .select("*, leads(full_name, email, phone)")
    .order("scheduled_at", { ascending: true });

  const statusVariant = {
    pending: "warning" as const,
    confirmed: "info" as const,
    completed: "success" as const,
    cancelled: "danger" as const,
  };

  return (
    <div>
      <h1 className="text-2xl font-bold">Bookings</h1>
      <p className="text-muted">Movement assessments and session bookings.</p>

      <div className="mt-6 overflow-x-auto rounded-xl border border-border">
        <table className="w-full text-sm">
          <thead className="bg-card">
            <tr>
              <th className="px-4 py-3 text-left font-medium">Client</th>
              <th className="px-4 py-3 text-left font-medium">Type</th>
              <th className="px-4 py-3 text-left font-medium">Scheduled</th>
              <th className="px-4 py-3 text-left font-medium">Duration</th>
              <th className="px-4 py-3 text-left font-medium">Status</th>
              <th className="px-4 py-3 text-left font-medium">Notes</th>
            </tr>
          </thead>
          <tbody>
            {bookings?.map((booking) => {
              const lead = booking.leads as unknown as { full_name: string; email: string; phone: string } | null;
              return (
                <tr key={booking.id} className="border-t border-border">
                  <td className="px-4 py-3">
                    <p>{lead?.full_name || "—"}</p>
                    <p className="text-xs text-muted">{lead?.email}</p>
                  </td>
                  <td className="px-4 py-3 capitalize">{booking.type}</td>
                  <td className="px-4 py-3">
                    {format(new Date(booking.scheduled_at), "MMM d, yyyy HH:mm")}
                  </td>
                  <td className="px-4 py-3">{booking.duration_min} min</td>
                  <td className="px-4 py-3">
                    <Badge variant={statusVariant[booking.status as keyof typeof statusVariant]}>{booking.status}</Badge>
                  </td>
                  <td className="px-4 py-3 text-muted">{booking.notes || "—"}</td>
                </tr>
              );
            })}
            {(!bookings || bookings.length === 0) && (
              <tr>
                <td colSpan={6} className="px-4 py-8 text-center text-muted">
                  No bookings yet.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
