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

const SITE_FIELDS = [
  { key: "trainer_name", label: "Trainer Name", type: "text" },
  { key: "tagline", label: "Tagline", type: "text" },
  { key: "hero_title", label: "Hero Title (use \\n for new line)", type: "text" },
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

  async function saveKey(key: string, value: string) {
    const supabase = createClient();
    await supabase.from("site_settings").upsert({
      key,
      value,
      updated_at: new Date().toISOString(),
    });
  }

  async function handleSave() {
    setSaving(true);
    setMessage(null);
    try {
      for (const [key, value] of Object.entries(settings)) {
        await saveKey(key, value);
      }
      setMessage("Settings saved. Refresh the public site to see changes.");
    } catch {
      setMessage("Failed to save settings.");
    } finally {
      setSaving(false);
    }
  }

  async function handleImageUpload(key: string, url: string) {
    setSettings((prev) => ({ ...prev, [key]: url }));
    await saveKey(key, url);
    setMessage(`${key === "trainer_photo" ? "About photo" : "Hero image"} saved.`);
  }

  async function handleImageRemove(key: string) {
    setSettings((prev) => ({ ...prev, [key]: "" }));
    await saveKey(key, "");
    setMessage("Image removed.");
  }

  return (
    <div>
      <h1 className="text-2xl font-bold">Settings</h1>
      <p className="text-muted">
        Edit homepage, About page, contact info, and images from here.
      </p>

      {message && (
        <p className="mt-4 rounded-lg bg-primary/10 px-4 py-3 text-sm text-primary">
          {message}
        </p>
      )}

      <Card className="mt-6">
        <CardTitle>Site Information</CardTitle>
        <div className="mt-4 grid gap-4 md:grid-cols-2">
          {SITE_FIELDS.map((field) => (
            <div key={field.key} className={field.type === "textarea" ? "md:col-span-2" : ""}>
              <label className="text-sm font-medium">{field.label}</label>
              {field.type === "textarea" ? (
                <Textarea
                  className="mt-1"
                  value={settings[field.key] || ""}
                  onChange={(e) =>
                    setSettings({ ...settings, [field.key]: e.target.value })
                  }
                />
              ) : (
                <Input
                  type={field.type}
                  className="mt-1"
                  value={settings[field.key] || ""}
                  onChange={(e) =>
                    setSettings({ ...settings, [field.key]: e.target.value })
                  }
                />
              )}
            </div>
          ))}
        </div>
      </Card>

      <Card className="mt-6">
        <CardTitle>About Page</CardTitle>
        <p className="mt-1 text-sm text-muted">
          This controls the public page: /about
        </p>
        <div className="mt-4 space-y-4">
          <div>
            <label className="text-sm font-medium">About Title</label>
            <Input
              className="mt-1"
              value={settings.about_title || ""}
              onChange={(e) =>
                setSettings({ ...settings, about_title: e.target.value })
              }
              placeholder="About Hassan"
            />
          </div>
          <div>
            <label className="text-sm font-medium">About Text</label>
            <Textarea
              className="mt-1 min-h-[160px]"
              value={settings.about_body || ""}
              onChange={(e) =>
                setSettings({ ...settings, about_body: e.target.value })
              }
              placeholder="Write the About page story here..."
            />
          </div>
          <MediaUpload
            bucket={STORAGE_BUCKETS.avatars}
            folder="trainer"
            accept="image/*"
            label="Trainer Photo (shows on About page)"
            currentUrl={settings.trainer_photo || null}
            onUpload={(url) => handleImageUpload("trainer_photo", url)}
            onRemove={() => handleImageRemove("trainer_photo")}
          />
        </div>
      </Card>

      <Card className="mt-6">
        <CardTitle>Homepage Hero Image</CardTitle>
        <div className="mt-4">
          <MediaUpload
            bucket={STORAGE_BUCKETS.general}
            folder="hero"
            accept="image/*"
            label="Background image for homepage hero"
            currentUrl={settings.hero_image || null}
            onUpload={(url) => handleImageUpload("hero_image", url)}
            onRemove={() => handleImageRemove("hero_image")}
          />
        </div>
      </Card>

      <Button className="mt-6" onClick={handleSave} disabled={saving}>
        {saving ? "Saving..." : "Save All Settings"}
      </Button>
    </div>
  );
}
