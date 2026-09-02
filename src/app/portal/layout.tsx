import { PortalSidebar } from "@/components/portal/PortalSidebar";

export const dynamic = "force-dynamic";

export default function PortalLayout({ children }: LayoutProps<"/portal">) {
  return (
    <div className="min-h-screen bg-background">
      <PortalSidebar />
      <main className="lg:pl-64">
        <div className="p-6 pt-16 lg:pt-6">{children}</div>
      </main>
    </div>
  );
}
