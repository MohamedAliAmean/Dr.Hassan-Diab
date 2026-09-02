import Link from "next/link";
import { ArrowRight, Dumbbell, Heart, Zap } from "lucide-react";
import { Hero } from "@/components/home/Hero";
import { Button } from "@/components/ui/Button";
import { Card, CardTitle, CardDescription } from "@/components/ui/Card";
import { getSiteSettings } from "@/lib/site-settings";
import {
  getDictionary,
  getLocaleFromParam,
  localizedPath,
  settingLocalized,
} from "@/lib/i18n";

export const revalidate = 60;

export default async function HomePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale: localeParam } = await params;
  const locale = getLocaleFromParam(localeParam);
  const t = getDictionary(locale);
  const settings = await getSiteSettings();

  const heroTitle = settingLocalized(
    settings,
    "hero_title",
    locale,
    t.home.defaultTitle
  );
  const heroSubtitle = settingLocalized(
    settings,
    "hero_subtitle",
    locale,
    t.home.defaultSubtitle
  );
  const heroImage = settings.hero_image?.trim() || null;

  return (
    <>
      <Hero title={heroTitle} subtitle={heroSubtitle} imageUrl={heroImage} t={t} />

      <section className="mx-auto max-w-6xl px-4 py-20">
        <div className="text-center">
          <h2 className="text-3xl font-bold">{t.home.notAverageTitle}</h2>
          <p className="mx-auto mt-4 max-w-2xl text-muted">{t.home.notAverageBody}</p>
          <Link href={localizedPath(locale, "/start")} className="mt-6 inline-block">
            <Button size="lg">
              {t.home.startQuiz} <ArrowRight className="ms-2 h-4 w-4" />
            </Button>
          </Link>
        </div>
      </section>

      <section className="bg-card py-20">
        <div className="mx-auto max-w-6xl px-4">
          <h2 className="text-center text-3xl font-bold">{t.home.howItWorks}</h2>
          <div className="mt-12 grid gap-8 md:grid-cols-3">
            <Card className="text-center">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                <Zap className="h-6 w-6 text-primary" />
              </div>
              <CardTitle className="mt-4">{t.home.step1Title}</CardTitle>
              <CardDescription>{t.home.step1Body}</CardDescription>
            </Card>
            <Card className="text-center">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                <Heart className="h-6 w-6 text-primary" />
              </div>
              <CardTitle className="mt-4">{t.home.step2Title}</CardTitle>
              <CardDescription>{t.home.step2Body}</CardDescription>
            </Card>
            <Card className="text-center">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                <Dumbbell className="h-6 w-6 text-primary" />
              </div>
              <CardTitle className="mt-4">{t.home.step3Title}</CardTitle>
              <CardDescription>{t.home.step3Body}</CardDescription>
            </Card>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-20">
        <div className="flex flex-col items-center justify-between gap-6 rounded-2xl bg-primary p-12 text-center text-white md:flex-row md:text-start">
          <div>
            <h2 className="text-3xl font-bold">{t.home.readyTitle}</h2>
            <p className="mt-2 text-white/80">{t.home.readyBody}</p>
          </div>
          <Link href={localizedPath(locale, "/book")}>
            <Button variant="secondary" size="lg">
              {t.nav.bookAssessment}
            </Button>
          </Link>
        </div>
      </section>
    </>
  );
}
