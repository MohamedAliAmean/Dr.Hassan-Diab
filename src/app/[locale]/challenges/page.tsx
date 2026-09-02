import type { Metadata } from "next";
import { createClient } from "@/lib/supabase/server";
import { Card, CardTitle, CardDescription } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { getDictionary, getLocaleFromParam } from "@/lib/i18n";

export const metadata: Metadata = { title: "Challenges" };

export default async function ChallengesPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale: localeParam } = await params;
  const locale = getLocaleFromParam(localeParam);
  const t = getDictionary(locale);
  const supabase = await createClient();
  const { data: challenges } = await supabase
    .from("challenges")
    .select("*")
    .eq("is_active", true)
    .order("start_date", { ascending: false });

  return (
    <div className="mx-auto max-w-6xl px-4 py-16">
      <div className="text-center">
        <h1 className="text-4xl font-bold">{t.challenges.title}</h1>
        <p className="mt-4 text-muted">{t.challenges.subtitle}</p>
      </div>

      {challenges && challenges.length > 0 ? (
        <div className="mt-12 grid gap-8 md:grid-cols-2">
          {challenges.map((challenge) => (
            <Card key={challenge.id}>
              <Badge variant="success" className="mb-4">
                {t.challenges.active}
              </Badge>
              <CardTitle>{challenge.title}</CardTitle>
              <CardDescription>{challenge.description}</CardDescription>
              {challenge.rules.length > 0 && (
                <ul className="mt-4 list-disc space-y-1 ps-5 text-sm text-muted">
                  {challenge.rules.map((rule: string, i: number) => (
                    <li key={i}>{rule}</li>
                  ))}
                </ul>
              )}
            </Card>
          ))}
        </div>
      ) : (
        <div className="mt-12 text-center text-muted">
          <p>{t.challenges.empty}</p>
        </div>
      )}
    </div>
  );
}
