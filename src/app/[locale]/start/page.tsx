import type { Metadata } from "next";
import { PathFinderQuiz } from "@/components/path-finder/PathFinderQuiz";
import { getDictionary, getLocaleFromParam } from "@/lib/i18n";

export const metadata: Metadata = {
  title: "Find Your Path",
};

export default async function StartPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale: localeParam } = await params;
  const locale = getLocaleFromParam(localeParam);
  const t = getDictionary(locale);

  return (
    <div className="mx-auto max-w-6xl px-4 py-16">
      <div className="mb-12 text-center">
        <h1 className="text-3xl font-bold md:text-4xl">{t.start.title}</h1>
        <p className="mt-4 text-muted">{t.start.subtitle}</p>
      </div>
      <PathFinderQuiz locale={locale} t={t} />
    </div>
  );
}
