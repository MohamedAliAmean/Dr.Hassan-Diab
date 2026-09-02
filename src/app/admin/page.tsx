import { createClient } from "@/lib/supabase/server";
import { Card, CardTitle, CardDescription } from "@/components/ui/Card";
import { Users, UserPlus, CalendarCheck, MessageSquare } from "lucide-react";

export default async function AdminDashboard() {
  const supabase = await createClient();

  const [
    { count: clientsCount },
    { count: leadsCount },
    { count: bookingsCount },
    { count: messagesCount },
  ] = await Promise.all([
    supabase.from("profiles").select("*", { count: "exact", head: true }).eq("role", "client"),
    supabase.from("leads").select("*", { count: "exact", head: true }).eq("status", "new"),
    supabase.from("bookings").select("*", { count: "exact", head: true }).eq("status", "pending"),
    supabase.from("messages").select("*", { count: "exact", head: true }).eq("is_read", false),
  ]);

  const stats = [
    { label: "Active Clients", value: clientsCount ?? 0, icon: Users, href: "/admin/clients" },
    { label: "New Leads", value: leadsCount ?? 0, icon: UserPlus, href: "/admin/leads" },
    { label: "Pending Bookings", value: bookingsCount ?? 0, icon: CalendarCheck, href: "/admin/bookings" },
    { label: "Unread Messages", value: messagesCount ?? 0, icon: MessageSquare, href: "/admin/messages" },
  ];

  return (
    <div>
      <h1 className="text-2xl font-bold">Dashboard</h1>
      <p className="text-muted">Welcome back, Hassan.</p>

      <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <Card key={stat.label}>
            <div className="flex items-center justify-between">
              <div>
                <CardDescription>{stat.label}</CardDescription>
                <CardTitle className="text-3xl">{stat.value}</CardTitle>
              </div>
              <stat.icon className="h-8 w-8 text-primary/50" />
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
