"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { PageEditorHeader } from "@/components/admin/PageEditorHeader";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";
import { Card, CardTitle } from "@/components/ui/Card";
import type { SiteSetting } from "@/types/database";

export default function AdminContactPageEditor() {
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
      const keys = ["email", "phone", "whatsapp", "address", "instagram", "facebook"];
      for (const key of keys) {
        await supabase.from("site_settings").upsert({
          key,
          value: settings[key] || "",
          updated_at: new Date().toISOString(),
        });
      }
      setMessage("Contact page saved. Open /contact to see it.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div>
      <PageEditorHeader
        title="Contact Page"
        publicPath="/contact"
        description="Edit email, phone, WhatsApp, address, and social links shown on Contact."
      />

      {message && (
        <p className="mb-4 rounded-lg bg-primary/10 px-4 py-3 text-sm text-primary">
          {message}
        </p>
      )}

      <Card>
        <CardTitle>Contact Details</CardTitle>
        <div className="mt-4 grid gap-4 md:grid-cols-2">
          <div>
            <label className="text-sm font-medium">Email</label>
            <Input
              className="mt-1"
              type="email"
              value={settings.email || ""}
              onChange={(e) => setSettings({ ...settings, email: e.target.value })}
            />
          </div>
          <div>
            <label className="text-sm font-medium">Phone</label>
            <Input
              className="mt-1"
              value={settings.phone || ""}
              onChange={(e) => setSettings({ ...settings, phone: e.target.value })}
            />
          </div>
          <div>
            <label className="text-sm font-medium">WhatsApp</label>
            <Input
              className="mt-1"
              value={settings.whatsapp || ""}
              onChange={(e) => setSettings({ ...settings, whatsapp: e.target.value })}
            />
          </div>
          <div>
            <label className="text-sm font-medium">Instagram URL</label>
            <Input
              className="mt-1"
              value={settings.instagram || ""}
              onChange={(e) => setSettings({ ...settings, instagram: e.target.value })}
            />
          </div>
          <div className="md:col-span-2">
            <label className="text-sm font-medium">Facebook URL</label>
            <Input
              className="mt-1"
              value={settings.facebook || ""}
              onChange={(e) => setSettings({ ...settings, facebook: e.target.value })}
            />
          </div>
          <div className="md:col-span-2">
            <label className="text-sm font-medium">Address</label>
            <Textarea
              className="mt-1"
              value={settings.address || ""}
              onChange={(e) => setSettings({ ...settings, address: e.target.value })}
            />
          </div>
        </div>
        <Button className="mt-6" onClick={handleSave} disabled={saving}>
          {saving ? "Saving..." : "Save Contact Page"}
        </Button>
      </Card>
    </div>
  );
}
