"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { PageEditorHeader } from "@/components/admin/PageEditorHeader";
import { MediaUpload } from "@/components/admin/MediaUpload";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";
import { Card, CardTitle } from "@/components/ui/Card";
import { STORAGE_BUCKETS } from "@/lib/constants";
import type { SiteSetting } from "@/types/database";
import { useAdminLocale } from "@/components/i18n/AdminLocaleProvider";

export default function AdminAboutPageEditor() {
  const { t } = useAdminLocale();
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
      await Promise.all([
        saveKey("about_title", settings.about_title || ""),
        saveKey("about_body", settings.about_body || ""),
        saveKey("about_title_ar", settings.about_title_ar || ""),
        saveKey("about_body_ar", settings.about_body_ar || ""),
        saveKey("tagline", settings.tagline || ""),
        saveKey("tagline_ar", settings.tagline_ar || ""),
        saveKey("trainer_name", settings.trainer_name || ""),
        saveKey("trainer_name_ar", settings.trainer_name_ar || ""),
        saveKey("trainer_photo", settings.trainer_photo || ""),
      ]);
      setMessage("About page saved.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div>
      <PageEditorHeader
        title={t.admin.pages.about}
        publicPath="/about"
        description={t.admin.pages.aboutDesc}
      />

      {message && (
        <p className="mb-4 rounded-lg bg-primary/10 px-4 py-3 text-sm text-primary">
          {message}
        </p>
      )}

      <div className="space-y-6">
        <Card>
          <CardTitle>{t.admin.editor.english}</CardTitle>
          <div className="mt-4 space-y-4">
            <div>
              <label className="text-sm font-medium">Page Title</label>
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
              <label className="text-sm font-medium">Tagline</label>
              <Input
                className="mt-1"
                value={settings.tagline || ""}
                onChange={(e) => setSettings({ ...settings, tagline: e.target.value })}
              />
            </div>
            <div>
              <label className="text-sm font-medium">About Text</label>
              <Textarea
                className="mt-1 min-h-[200px]"
                value={settings.about_body || ""}
                onChange={(e) =>
                  setSettings({ ...settings, about_body: e.target.value })
                }
                placeholder="Write the about story. Use empty lines between paragraphs."
              />
            </div>
          </div>
        </Card>

        <Card>
          <CardTitle>{t.admin.editor.arabic}</CardTitle>
          <div className="mt-4 space-y-4" dir="rtl">
            <div>
              <label className="text-sm font-medium">عنوان الصفحة</label>
              <Input
                className="mt-1"
                value={settings.about_title_ar || ""}
                onChange={(e) =>
                  setSettings({ ...settings, about_title_ar: e.target.value })
                }
                placeholder="عن حسن"
              />
            </div>
            <div>
              <label className="text-sm font-medium">الشعار</label>
              <Input
                className="mt-1"
                value={settings.tagline_ar || ""}
                onChange={(e) =>
                  setSettings({ ...settings, tagline_ar: e.target.value })
                }
              />
            </div>
            <div>
              <label className="text-sm font-medium">نص عن المدرب</label>
              <Textarea
                className="mt-1 min-h-[200px]"
                value={settings.about_body_ar || ""}
                onChange={(e) =>
                  setSettings({ ...settings, about_body_ar: e.target.value })
                }
                placeholder="اكتب قصة المدرب. استخدم سطر فاضي بين الفقرات."
              />
            </div>
          </div>
        </Card>

        <Card>
          <CardTitle>{t.admin.editor.sharedMedia}</CardTitle>
          <div className="mt-4">
            <MediaUpload
              bucket={STORAGE_BUCKETS.avatars}
              folder="trainer"
              accept="image/*"
              label={t.admin.pages.aboutMedia}
              currentUrl={settings.trainer_photo || null}
              onUpload={async (url) => {
                setSettings({ ...settings, trainer_photo: url });
                await saveKey("trainer_photo", url);
                setMessage("Trainer photo uploaded and saved.");
              }}
              onRemove={async () => {
                setSettings({ ...settings, trainer_photo: "" });
                await saveKey("trainer_photo", "");
              }}
            />
          </div>
          <Button className="mt-6" onClick={handleSave} disabled={saving}>
            {saving ? t.admin.editor.saving : t.admin.editor.save}
          </Button>
        </Card>
      </div>
    </div>
  );
}
