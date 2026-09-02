"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Card, CardTitle } from "@/components/ui/Card";
import type { SiteSetting } from "@/types/database";

export default function AdminSettingsPage() {
  const [settings, setSettings] = useState<Record<string, string>>({});
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    async function load() {
      const supabase = createClient();
      const { data } = await supabase.from("site_settings").select("*");
      const map: Record<string, string> = {};
      data?.forEach((s: SiteSetting) => {
        map[s.key] = s.value || "";
      });
      setSettings(map);
    }
    load();
  }, []);

  async function handleSave() {
    setSaving(true);
    setMessage(null);
    try {
      const supabase = createClient();
      await supabase.from("site_settings").upsert({
        key: "trainer_name",
        value: settings.trainer_name || "",
        updated_at: new Date().toISOString(),
      });
      setMessage("General settings saved.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div>
      <h1 className="text-2xl font-bold">General Settings</h1>
      <p className="text-muted">
        For page content and images, use the Website Pages section in the sidebar.
      </p>

      <Card className="mt-6">
        <CardTitle>Quick Links</CardTitle>
        <div className="mt-4 flex flex-wrap gap-2">
          <Link href="/admin/pages"><Button variant="outline" size="sm">All Pages</Button></Link>
          <Link href="/admin/pages/home"><Button variant="outline" size="sm">Home</Button></Link>
          <Link href="/admin/pages/about"><Button variant="outline" size="sm">About</Button></Link>
          <Link href="/admin/blog"><Button variant="outline" size="sm">Blog</Button></Link>
          <Link href="/admin/pages/contact"><Button variant="outline" size="sm">Contact</Button></Link>
          <Link href="/admin/media"><Button variant="outline" size="sm">Media Library</Button></Link>
        </div>
      </Card>

      <Card className="mt-6">
        <CardTitle>Brand Name</CardTitle>
        <div className="mt-4">
          <Input
            value={settings.trainer_name || ""}
            onChange={(e) => setSettings({ ...settings, trainer_name: e.target.value })}
            placeholder="Hassan Diab"
          />
        </div>
        {message && <p className="mt-3 text-sm text-primary">{message}</p>}
        <Button className="mt-4" onClick={handleSave} disabled={saving}>
          {saving ? "Saving..." : "Save"}
        </Button>
      </Card>
    </div>
  );
}
