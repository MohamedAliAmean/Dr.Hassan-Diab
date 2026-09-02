import { defaultLocale, isLocale, type Locale } from "./config";
import { getDictionary, type Dictionary } from "./dictionaries";

export { defaultLocale, isLocale, locales, getDirection } from "./config";
export { getDictionary } from "./dictionaries";
export type { Locale, Dictionary };

export function getLocaleFromParam(param: string | string[] | undefined): Locale {
  const value = Array.isArray(param) ? param[0] : param;
  if (value && isLocale(value)) return value;
  return defaultLocale;
}

export async function getLocaleDictionary(locale: Locale) {
  return getDictionary(locale);
}

export function localizedPath(locale: Locale, path = "/") {
  const clean = path.startsWith("/") ? path : `/${path}`;
  if (clean === "/") return `/${locale}`;
  return `/${locale}${clean}`;
}

export function stripLocaleFromPath(pathname: string) {
  const segments = pathname.split("/").filter(Boolean);
  if (segments.length > 0 && isLocale(segments[0])) {
    const rest = segments.slice(1).join("/");
    return rest ? `/${rest}` : "/";
  }
  return pathname || "/";
}

export function settingLocalized(
  settings: Record<string, string>,
  key: string,
  locale: Locale,
  fallback = ""
) {
  if (locale === "ar") {
    const arValue = settings[`${key}_ar`]?.trim();
    if (arValue) return arValue;
  }
  return settings[key]?.trim() || fallback;
}

export async function getRequestLocale(): Promise<Locale> {
  const { cookies } = await import("next/headers");
  const store = await cookies();
  const value = store.get("locale")?.value;
  return value && isLocale(value) ? value : defaultLocale;
}

export const LOCALE_COOKIE = "locale";

export function setLocaleCookieClient(locale: Locale) {
  document.cookie = `${LOCALE_COOKIE}=${locale};path=/;max-age=31536000;samesite=lax`;
}
