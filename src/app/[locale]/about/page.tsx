import type { Metadata } from "next";
import { Card, CardTitle, CardDescription } from "@/components/ui/Card";
import { OptimizedImage } from "@/components/ui/OptimizedImage";
import { getSiteSettings } from "@/lib/site-settings";
import {
  getDictionary,
  getLocaleFromParam,
  settingLocalized,
} from "@/lib/i18n";

export const metadata: Metadata = {
  title: "About",
};

export const revalidate = 60;

export default async function AboutPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale: localeParam } = await params;
  const locale = getLocaleFromParam(localeParam);
  const t = getDictionary(locale);
  const settings = await getSiteSettings();

  const name = settingLocalized(settings, "trainer_name", locale, t.brand);
  const tagline = settingLocalized(
    settings,
    "tagline",
    locale,
    locale === "ar" ? "قوة مستدامة. نتائج حقيقية." : "Sustainable Strength. Real Results."
  );
  const title = settingLocalized(
    settings,
    "about_title",
    locale,
    locale === "ar" ? `عن ${name}` : `About ${name}`
  );
  const body = settingLocalized(
    settings,
    "about_body",
    locale,
    locale === "ar"
      ? "أؤمن إن التدريب لازم يتناسب مع حياتك — مش العكس. بخبرة أكتر من 5 سنين في تدريب العملاء من المبتدئين للمحترفين، بركز على بناء عادات مستدامة.\n\nأسلوبي بيجمع بين البرمجة المبنية على الدليل والاهتمام الشخصي. كل عميل بياخد خطة مخصصة حسب جسمه وأهدافه وجدولته وحدوده.\n\nمفيش برامج جاهزة ولا دايت متطرف. تدريب ذكي بيجيب نتائج قابلة للقياس."
      : "I believe training should fit your life — not the other way around. With over 5 years of experience coaching clients from beginners to competitive athletes, I focus on building sustainable habits that last.\n\nMy approach combines evidence-based programming with personalized attention. Every client gets a custom plan based on their body, goals, schedule, and limitations.\n\nNo cookie-cutter programs. No extreme diets. Just smart training that delivers measurable results."
  );
  const photo = settings.trainer_photo?.trim() || settings.hero_image?.trim() || "";
  const paragraphs = body.split(/\n+/).map((p) => p.trim()).filter(Boolean);

  return (
    <div className="mx-auto max-w-6xl px-4 py-16">
      <div className="grid gap-12 md:grid-cols-2 md:items-center">
        <div>
          <h1 className="text-4xl font-bold">{title}</h1>
          <p className="mt-2 text-lg font-medium text-secondary">{tagline}</p>
          <div className="mt-6 space-y-4 text-muted">
            {paragraphs.map((paragraph, i) => (
              <p key={i}>{paragraph}</p>
            ))}
          </div>
        </div>

        <div className="relative aspect-square overflow-hidden rounded-2xl bg-primary/10">
          {photo ? (
            <OptimizedImage
              src={photo}
              alt={name}
              fill
              sizes="(max-width: 768px) 100vw, 50vw"
              className="object-cover"
            />
          ) : (
            <div className="flex h-full items-center justify-center p-6 text-center text-sm text-muted">
              {t.about.uploadHint}
            </div>
          )}
        </div>
      </div>

      <div className="mt-20">
        <h2 className="text-center text-2xl font-bold">{t.about.philosophy}</h2>
        <div className="mt-8 grid gap-6 md:grid-cols-3">
          <Card>
            <CardTitle>{t.about.consistencyTitle}</CardTitle>
            <CardDescription>{t.about.consistencyBody}</CardDescription>
          </Card>
          <Card>
            <CardTitle>{t.about.formTitle}</CardTitle>
            <CardDescription>{t.about.formBody}</CardDescription>
          </Card>
          <Card>
            <CardTitle>{t.about.dataTitle}</CardTitle>
            <CardDescription>{t.about.dataBody}</CardDescription>
          </Card>
        </div>
      </div>
    </div>
  );
}
