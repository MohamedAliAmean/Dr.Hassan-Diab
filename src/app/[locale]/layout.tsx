import { notFound } from "next/navigation";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { LocaleAttributes } from "@/components/i18n/LocaleAttributes";
import { getDictionary, isLocale, type Locale } from "@/lib/i18n";

export function generateStaticParams() {
  return [{ locale: "en" }, { locale: "ar" }];
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale: localeParam } = await params;
  if (!isLocale(localeParam)) notFound();

  const locale = localeParam as Locale;
  const t = getDictionary(locale);

  return (
    <>
      <LocaleAttributes locale={locale} />
      <Header locale={locale} t={t} />
      <main className="flex-1">{children}</main>
      <Footer t={t} />
    </>
  );
}
