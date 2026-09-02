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

export default function AdminHomePageEditor() {
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
        saveKey("hero_title", settings.hero_title || ""),
        saveKey("hero_subtitle", settings.hero_subtitle || ""),
        saveKey("hero_title_ar", settings.hero_title_ar || ""),
        saveKey("hero_subtitle_ar", settings.hero_subtitle_ar || ""),
        saveKey("hero_image", settings.hero_image || ""),
        saveKey("trainer_name", settings.trainer_name || ""),
        saveKey("trainer_name_ar", settings.trainer_name_ar || ""),
        saveKey("tagline", settings.tagline || ""),
        saveKey("tagline_ar", settings.tagline_ar || ""),
      ]);
      setMessage("Home page saved.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div>
      <PageEditorHeader
        title={t.admin.pages.home}
        publicPath="/"
        description={t.admin.pages.homeDesc}
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
              <label className="text-sm font-medium">Trainer / Brand Name</label>
              <Input
                className="mt-1"
                value={settings.trainer_name || ""}
                onChange={(e) =>
                  setSettings({ ...settings, trainer_name: e.target.value })
                }
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
              <label className="text-sm font-medium">
                Hero Title (use \n for line break)
              </label>
              <Input
                className="mt-1"
                value={settings.hero_title || ""}
                onChange={(e) =>
                  setSettings({ ...settings, hero_title: e.target.value })
                }
              />
            </div>
            <div>
              <label className="text-sm font-medium">Hero Subtitle</label>
              <Textarea
                className="mt-1"
                value={settings.hero_subtitle || ""}
                onChange={(e) =>
                  setSettings({ ...settings, hero_subtitle: e.target.value })
                }
              />
            </div>
          </div>
        </Card>

        <Card>
          <CardTitle>{t.admin.editor.arabic}</CardTitle>
          <div className="mt-4 space-y-4" dir="rtl">
            <div>
              <label className="text-sm font-medium">اسم المدرب / البراند</label>
              <Input
                className="mt-1"
                value={settings.trainer_name_ar || ""}
                onChange={(e) =>
                  setSettings({ ...settings, trainer_name_ar: e.target.value })
                }
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
              <label className="text-sm font-medium">
                عنوان الهيرو (استخدم \n لسطر جديد)
              </label>
              <Input
                className="mt-1"
                value={settings.hero_title_ar || ""}
                onChange={(e) =>
                  setSettings({ ...settings, hero_title_ar: e.target.value })
                }
              />
            </div>
            <div>
              <label className="text-sm font-medium">وصف الهيرو</label>
              <Textarea
                className="mt-1"
                value={settings.hero_subtitle_ar || ""}
                onChange={(e) =>
                  setSettings({ ...settings, hero_subtitle_ar: e.target.value })
                }
              />
            </div>
          </div>
        </Card>

        <Card>
          <CardTitle>{t.admin.editor.sharedMedia}</CardTitle>
          <div className="mt-4">
            <MediaUpload
              bucket={STORAGE_BUCKETS.general}
              folder="hero"
              accept="image/*"
              label={t.admin.pages.homeMedia}
              currentUrl={settings.hero_image || null}
              onUpload={async (url) => {
                setSettings({ ...settings, hero_image: url });
                await saveKey("hero_image", url);
                setMessage("Hero image uploaded and saved.");
              }}
              onRemove={async () => {
                setSettings({ ...settings, hero_image: "" });
                await saveKey("hero_image", "");
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
