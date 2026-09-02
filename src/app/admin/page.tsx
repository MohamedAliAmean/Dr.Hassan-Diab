import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { Card, CardTitle, CardDescription } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Users, UserPlus, CalendarCheck, MessageSquare, LayoutGrid } from "lucide-react";
import { getDictionary, getRequestLocale } from "@/lib/i18n";

export default async function AdminDashboard() {
  const locale = await getRequestLocale();
  const t = getDictionary(locale);
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
    {
      label: t.admin.dashboard.activeClients,
      value: clientsCount ?? 0,
      icon: Users,
      href: "/admin/clients",
    },
    {
      label: t.admin.dashboard.newLeads,
      value: leadsCount ?? 0,
      icon: UserPlus,
      href: "/admin/leads",
    },
    {
      label: t.admin.dashboard.pendingBookings,
      value: bookingsCount ?? 0,
      icon: CalendarCheck,
      href: "/admin/bookings",
    },
    {
      label: t.admin.dashboard.unreadMessages,
      value: messagesCount ?? 0,
      icon: MessageSquare,
      href: "/admin/messages",
    },
  ];

  return (
    <div>
      <h1 className="text-2xl font-bold">{t.admin.dashboard.title}</h1>
      <p className="text-muted">{t.admin.dashboard.welcome}</p>

      <Card className="mt-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <CardTitle>{t.admin.dashboard.editPagesTitle}</CardTitle>
            <CardDescription>{t.admin.dashboard.editPagesBody}</CardDescription>
          </div>
          <Link href="/admin/pages">
            <Button>
              <LayoutGrid className="me-2 h-4 w-4" /> {t.admin.dashboard.openAllPages}
            </Button>
          </Link>
        </div>
      </Card>

      <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <Link key={stat.href} href={stat.href}>
            <Card className="transition-shadow hover:shadow-md">
              <div className="flex items-center justify-between">
                <div>
                  <CardDescription>{stat.label}</CardDescription>
                  <CardTitle className="text-3xl">{stat.value}</CardTitle>
                </div>
                <stat.icon className="h-8 w-8 text-primary/50" />
              </div>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
