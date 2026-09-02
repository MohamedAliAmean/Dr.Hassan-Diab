"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  LayoutGrid,
  Home,
  UserRound,
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
  Phone,
  LogOut,
  Menu,
  X,
} from "lucide-react";
import { useState } from "react";
import { ADMIN_NAV_GROUPS } from "@/lib/constants";
import { cn } from "@/lib/utils";
import { createClient } from "@/lib/supabase/client";
import { localizedPath } from "@/lib/i18n";
import { useAdminLocale } from "@/components/i18n/AdminLocaleProvider";
import { AdminLanguageSwitcher } from "@/components/i18n/AdminLanguageSwitcher";

const iconMap = {
  LayoutDashboard,
  LayoutGrid,
  Home,
  UserRound,
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
  Phone,
};

export function AdminSidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const { locale, t } = useAdminLocale();

  async function handleLogout() {
    const supabase = createClient();
    await supabase.auth.signOut();
    document.cookie = "hd_role=;path=/;max-age=0";
    router.push("/login");
    router.refresh();
  }

  const navContent = (
    <>
      <div className="mb-4 px-4">
        <Link href="/admin" className="text-lg font-bold text-primary">
          {t.admin.title}
        </Link>
        <p className="text-xs text-muted">{t.admin.subtitle}</p>
        <div className="mt-3">
          <AdminLanguageSwitcher />
        </div>
      </div>

      <nav className="flex-1 space-y-5 overflow-y-auto px-2 pb-4">
        {ADMIN_NAV_GROUPS.map((group) => (
          <div key={group.titleKey}>
            <p className="mb-2 px-3 text-[11px] font-semibold uppercase tracking-wide text-muted">
              {t.admin.groups[group.titleKey]}
            </p>
            <div className="space-y-1">
              {group.items.map((item) => {
                const Icon = iconMap[item.icon as keyof typeof iconMap];
                const isActive =
                  pathname === item.href ||
                  (item.href !== "/admin" &&
                    item.href !== "/admin/pages" &&
                    pathname.startsWith(item.href)) ||
                  (item.href === "/admin/pages" && pathname === "/admin/pages");

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
                    {t.admin.items[item.itemKey]}
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </nav>

      <div className="border-t border-border p-4">
        <Link
          href={localizedPath(locale)}
          className="mb-2 flex items-center gap-2 text-sm text-muted hover:text-foreground"
        >
          {t.admin.viewSite}
        </Link>
        <button
          onClick={handleLogout}
          className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm text-red-600 hover:bg-red-50"
        >
          <LogOut size={18} />
          {t.admin.logout}
        </button>
      </div>
    </>
  );

  return (
    <>
      <button
        className="fixed start-4 top-4 z-50 rounded-lg border border-border bg-card p-2 lg:hidden"
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
          "fixed inset-y-0 start-0 z-40 flex w-64 flex-col border-e border-border bg-background transition-transform lg:translate-x-0",
          open ? "translate-x-0" : "-translate-x-full rtl:translate-x-full lg:rtl:translate-x-0"
        )}
      >
        {navContent}
      </aside>
    </>
  );
}
