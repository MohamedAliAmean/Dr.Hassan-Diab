import type { Metadata } from "next";
import Link from "next/link";
import { Check } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { Card, CardTitle, CardDescription } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { formatPrice } from "@/lib/utils";
import { getDictionary, getLocaleFromParam, localizedPath } from "@/lib/i18n";

export const metadata: Metadata = {
  title: "Services",
};

export default async function ServicesPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale: localeParam } = await params;
  const locale = getLocaleFromParam(localeParam);
  const t = getDictionary(locale);
  const supabase = await createClient();
  const { data: services } = await supabase
    .from("services")
    .select("*")
    .eq("is_active", true)
    .order("sort_order");

  const defaultServices = [
    {
      id: "1",
      name: locale === "ar" ? "تدريب شهري" : "Monthly Coaching",
      description:
        locale === "ar"
          ? "تدريب كامل مع برنامج مخصص وإرشاد غذائي ومتابعة أسبوعية."
          : "Full coaching with custom program, nutrition guidance, and weekly check-ins.",
      price: 2500,
      currency: "EGP",
      duration_weeks: 4,
      features:
        locale === "ar"
          ? ["برنامج تدريب مخصص", "إرشاد غذائي", "متابعة أسبوعية", "دخول البوابة"]
          : ["Custom training program", "Nutrition guidance", "Weekly check-ins", "Portal access"],
    },
    {
      id: "2",
      name: locale === "ar" ? "تدريب مميز" : "Premium Coaching",
      description:
        locale === "ar"
          ? "كل مميزات الباقة الشهرية مع جلسات حضورية ودعم أولوية."
          : "Everything in Monthly plus in-person sessions and priority support.",
      price: 4500,
      currency: "EGP",
      duration_weeks: 4,
      features:
        locale === "ar"
          ? ["كل مميزات الباقة الشهرية", "جلسات حضورية", "رسائل أولوية", "متابعة قياسات الجسم"]
          : ["Everything in Monthly", "In-person sessions", "Priority messaging", "Body composition tracking"],
    },
    {
      id: "3",
      name: locale === "ar" ? "برنامج أونلاين" : "Online Program",
      description:
        locale === "ar"
          ? "برنامج مخصص رقمياً مع تحديث شهري."
          : "Custom program delivered digitally with monthly program updates.",
      price: 1200,
      currency: "EGP",
      duration_weeks: 4,
      features:
        locale === "ar"
          ? ["برنامج مخصص", "مكتبة فيديوهات", "تحديث شهري", "دخول البوابة"]
          : ["Custom program", "Exercise video library", "Monthly updates", "Portal access"],
    },
  ];

  const displayServices = services?.length ? services : defaultServices;

  return (
    <div className="mx-auto max-w-6xl px-4 py-16">
      <div className="text-center">
        <h1 className="text-4xl font-bold">{t.services.title}</h1>
        <p className="mt-4 text-muted">{t.services.subtitle}</p>
      </div>

      <div className="mt-12 grid gap-8 md:grid-cols-3">
        {displayServices.map((service, i) => (
          <Card
            key={service.id}
            className={i === 1 ? "border-primary ring-2 ring-primary/20" : ""}
          >
            {i === 1 && (
              <span className="mb-4 inline-block rounded-full bg-primary px-3 py-1 text-xs font-medium text-white">
                {t.services.mostPopular}
              </span>
            )}
            <CardTitle>{service.name}</CardTitle>
            <CardDescription>{service.description}</CardDescription>
            <p className="mt-4 text-3xl font-bold text-primary">
              {service.price
                ? formatPrice(service.price, service.currency)
                : t.services.contact}
              {service.duration_weeks && (
                <span className="text-sm font-normal text-muted">
                  {" "}
                  {t.services.perMonth}
                </span>
              )}
            </p>
            <ul className="mt-6 space-y-2">
              {(service.features as string[]).map((feature) => (
                <li key={feature} className="flex items-center gap-2 text-sm">
                  <Check className="h-4 w-4 text-primary" />
                  {feature}
                </li>
              ))}
            </ul>
            <Link href={localizedPath(locale, "/start")} className="mt-6 block">
              <Button className="w-full" variant={i === 1 ? "primary" : "outline"}>
                {t.services.getStarted}
              </Button>
            </Link>
          </Card>
        ))}
      </div>
    </div>
  );
}
