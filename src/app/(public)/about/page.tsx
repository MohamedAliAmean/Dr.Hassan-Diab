import type { Metadata } from "next";
import { Card, CardTitle, CardDescription } from "@/components/ui/Card";
import { getSiteSettings, setting } from "@/lib/site-settings";

export const metadata: Metadata = {
  title: "About Hassan Diab",
};

export default async function AboutPage() {
  const settings = await getSiteSettings();
  const name = setting(settings, "trainer_name", "Hassan");
  const tagline = setting(settings, "tagline", "Sustainable Strength. Real Results.");
  const title = setting(settings, "about_title", `About ${name}`);
  const body = setting(
    settings,
    "about_body",
    "I believe training should fit your life — not the other way around. With over 5 years of experience coaching clients from beginners to competitive athletes, I focus on building sustainable habits that last.\n\nMy approach combines evidence-based programming with personalized attention. Every client gets a custom plan based on their body, goals, schedule, and limitations.\n\nNo cookie-cutter programs. No extreme diets. Just smart training that delivers measurable results."
  );
  const photo = setting(settings, "trainer_photo") || setting(settings, "hero_image");

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

        <div className="aspect-square overflow-hidden rounded-2xl bg-primary/10">
          {photo ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={photo}
              alt={name}
              className="h-full w-full object-cover"
            />
          ) : (
            <div className="flex h-full items-center justify-center p-6 text-center text-sm text-muted">
              Upload trainer photo from Admin → Settings → About
            </div>
          )}
        </div>
      </div>

      <div className="mt-20">
        <h2 className="text-center text-2xl font-bold">My Philosophy</h2>
        <div className="mt-8 grid gap-6 md:grid-cols-3">
          <Card>
            <CardTitle>Consistency Over Intensity</CardTitle>
            <CardDescription>
              Showing up regularly beats going hard once. We build habits that stick.
            </CardDescription>
          </Card>
          <Card>
            <CardTitle>Form First</CardTitle>
            <CardDescription>
              Perfect technique prevents injury and maximizes results. Quality over quantity.
            </CardDescription>
          </Card>
          <Card>
            <CardTitle>Data-Driven</CardTitle>
            <CardDescription>
              Track progress with real metrics — not just the mirror. What gets measured gets improved.
            </CardDescription>
          </Card>
        </div>
      </div>
    </div>
  );
}
