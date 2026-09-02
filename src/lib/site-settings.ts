import { createClient } from "@/lib/supabase/server";

export type SiteSettingsMap = Record<string, string>;

export async function getSiteSettings(): Promise<SiteSettingsMap> {
  try {
    const supabase = await createClient();
    const { data } = await supabase.from("site_settings").select("key, value");
    const map: SiteSettingsMap = {};
    data?.forEach((row) => {
      map[row.key] = row.value || "";
    });
    return map;
  } catch {
    return {};
  }
}

export function setting(map: SiteSettingsMap, key: string, fallback = "") {
  return map[key]?.trim() || fallback;
}
