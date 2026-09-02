"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { useRouter } from "next/navigation";
import {
  defaultLocale,
  getDictionary,
  getDirection,
  isLocale,
  setLocaleCookieClient,
  type Dictionary,
  type Locale,
} from "@/lib/i18n";

type AdminLocaleContextValue = {
  locale: Locale;
  t: Dictionary;
  setLocale: (locale: Locale) => void;
};

const AdminLocaleContext = createContext<AdminLocaleContextValue | null>(null);

function readLocaleCookie(): Locale {
  if (typeof document === "undefined") return defaultLocale;
  const match = document.cookie.match(/(?:^|; )locale=([^;]*)/);
  const value = match?.[1];
  return value && isLocale(value) ? value : defaultLocale;
}

export function AdminLocaleProvider({
  initialLocale,
  children,
}: {
  initialLocale: Locale;
  children: ReactNode;
}) {
  const router = useRouter();
  const [locale, setLocaleState] = useState<Locale>(initialLocale);

  useEffect(() => {
    const fromCookie = readLocaleCookie();
    if (fromCookie !== locale) setLocaleState(fromCookie);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    document.documentElement.lang = locale;
    document.documentElement.dir = getDirection(locale);
  }, [locale]);

  const setLocale = useCallback(
    (next: Locale) => {
      setLocaleCookieClient(next);
      setLocaleState(next);
      router.refresh();
    },
    [router]
  );

  const value = useMemo(
    () => ({
      locale,
      t: getDictionary(locale),
      setLocale,
    }),
    [locale, setLocale]
  );

  return (
    <AdminLocaleContext.Provider value={value}>{children}</AdminLocaleContext.Provider>
  );
}

export function useAdminLocale() {
  const ctx = useContext(AdminLocaleContext);
  if (!ctx) {
    throw new Error("useAdminLocale must be used within AdminLocaleProvider");
  }
  return ctx;
}
