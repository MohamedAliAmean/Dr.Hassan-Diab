"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Users,
  Calendar,
  Dumbbell,
  TrendingUp,
  Trophy,
  UserPlus,
  CalendarCheck,
  MessageSquare,
  FileText,
  Package,
  Image,
  Settings,
  LogOut,
  Menu,
  X,
} from "lucide-react";
import { useState } from "react";
import { ADMIN_NAV } from "@/lib/constants";
import { cn } from "@/lib/utils";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";

const iconMap = {
  LayoutDashboard,
  Users,
  Calendar,
  Dumbbell,
  TrendingUp,
  Trophy,
  UserPlus,
  CalendarCheck,
  MessageSquare,
  FileText,
  Package,
  Image,
  Settings,
};

export function AdminSidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const [open, setOpen] = useState(false);

  async function handleLogout() {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/login");
    router.refresh();
  }

  const navContent = (
    <>
      <div className="mb-8 px-4">
        <Link href="/admin" className="text-lg font-bold text-primary">
          Admin Panel
        </Link>
        <p className="text-xs text-muted">Hassan Diab Fitness</p>
      </div>

      <nav className="flex-1 space-y-1 px-2">
        {ADMIN_NAV.map((item) => {
          const Icon = iconMap[item.icon as keyof typeof iconMap];
          const isActive =
            pathname === item.href ||
            (item.href !== "/admin" && pathname.startsWith(item.href));

          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setOpen(false)}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors",
                isActive
                  ? "bg-primary text-white"
                  : "text-muted hover:bg-card hover:text-foreground"
              )}
            >
              <Icon size={18} />
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className="border-t border-border p-4">
        <Link
          href="/"
          className="mb-2 flex items-center gap-2 text-sm text-muted hover:text-foreground"
        >
          View Site
        </Link>
        <button
          onClick={handleLogout}
          className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm text-red-600 hover:bg-red-50"
        >
          <LogOut size={18} />
          Logout
        </button>
      </div>
    </>
  );

  return (
    <>
      <button
        className="fixed left-4 top-4 z-50 rounded-lg border border-border bg-card p-2 lg:hidden"
        onClick={() => setOpen(!open)}
        aria-label="Toggle sidebar"
      >
        {open ? <X size={20} /> : <Menu size={20} />}
      </button>

      {open && (
        <div
          className="fixed inset-0 z-40 bg-black/50 lg:hidden"
          onClick={() => setOpen(false)}
        />
      )}

      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-40 flex w-64 flex-col border-r border-border bg-background transition-transform lg:translate-x-0",
          open ? "translate-x-0" : "-translate-x-full"
        )}
      >
        {navContent}
      </aside>
    </>
  );
}
