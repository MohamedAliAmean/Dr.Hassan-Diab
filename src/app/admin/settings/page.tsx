"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";
import { Card, CardTitle } from "@/components/ui/Card";
import { MediaUpload } from "@/components/admin/MediaUpload";
import { STORAGE_BUCKETS } from "@/lib/constants";
import type { SiteSetting } from "@/types/database";

const SETTING_FIELDS = [
  { key: "trainer_name", label: "Trainer Name", type: "text" },
  { key: "tagline", label: "Tagline", type: "text" },
  { key: "hero_title", label: "Hero Title", type: "text" },
  { key: "hero_subtitle", label: "Hero Subtitle", type: "textarea" },
  { key: "email", label: "Email", type: "email" },
  { key: "phone", label: "Phone", type: "tel" },
  { key: "whatsapp", label: "WhatsApp Number", type: "tel" },
  { key: "instagram", label: "Instagram URL", type: "url" },
  { key: "facebook", label: "Facebook URL", type: "url" },
  { key: "address", label: "Gym Address", type: "textarea" },
] as const;

export default function AdminSettingsPage() {
  const [settings, setSettings] = useState<Record<string, string>>({});
  const [saving, setSaving] = useState(false);
  const supabase = createClient();

  useEffect(() => {
    async function load() {
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
    for (const [key, value] of Object.entries(settings)) {
      await supabase
        .from("site_settings")
        .upsert({ key, value, updated_at: new Date().toISOString() });
    }
    setSaving(false);
  }

  return (
    <div>
      <h1 className="text-2xl font-bold">Settings</h1>
      <p className="text-muted">Manage your profile and site configuration.</p>

      <Card className="mt-6">
        <CardTitle>Site Information</CardTitle>
        <div className="mt-4 grid gap-4 md:grid-cols-2">
          {SETTING_FIELDS.map((field) => (
            <div key={field.key} className={field.type === "textarea" ? "md:col-span-2" : ""}>
              <label className="text-sm font-medium">{field.label}</label>
              {field.type === "textarea" ? (
                <Textarea
                  className="mt-1"
                  value={settings[field.key] || ""}
                  onChange={(e) => setSettings({ ...settings, [field.key]: e.target.value })}
                />
              ) : (
                <Input
                  type={field.type}
                  className="mt-1"
                  value={settings[field.key] || ""}
                  onChange={(e) => setSettings({ ...settings, [field.key]: e.target.value })}
                />
              )}
            </div>
          ))}
        </div>
      </Card>

      <Card className="mt-6">
        <CardTitle>Hero Image</CardTitle>
        <div className="mt-4">
          <MediaUpload
            bucket={STORAGE_BUCKETS.general}
            folder="hero"
            accept="image/*"
            label="Homepage hero image"
            currentUrl={settings.hero_image || null}
            onUpload={(url) => setSettings({ ...settings, hero_image: url })}
            onRemove={() => setSettings({ ...settings, hero_image: "" })}
          />
        </div>
      </Card>

      <Button className="mt-6" onClick={handleSave} disabled={saving}>
        {saving ? "Saving..." : "Save Settings"}
      </Button>
    </div>
  );
}
