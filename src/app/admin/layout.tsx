import { AdminSidebar } from "@/components/admin/AdminSidebar";
import { AdminLocaleProvider } from "@/components/i18n/AdminLocaleProvider";
import { getRequestLocale } from "@/lib/i18n";

export const dynamic = "force-dynamic";

export default async function AdminLayout({ children }: LayoutProps<"/admin">) {
  const locale = await getRequestLocale();

  return (
    <AdminLocaleProvider initialLocale={locale}>
      <div className="min-h-screen bg-background">
        <AdminSidebar />
        <main className="lg:ps-64">
          <div className="p-6 pt-16 lg:pt-6">{children}</div>
        </main>
      </div>
    </AdminLocaleProvider>
  );
}
