import { ArrowRight, Target, Users, Award } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { LocaleLink } from "@/components/i18n/LocaleLink";
import { OptimizedImage } from "@/components/ui/OptimizedImage";
import type { Dictionary } from "@/lib/i18n";

interface HeroProps {
  title?: string;
  subtitle?: string;
  imageUrl?: string | null;
  t: Dictionary;
}

export function Hero({ title, subtitle, imageUrl, t }: HeroProps) {
  const resolvedTitle = title || t.home.defaultTitle;
  const resolvedSubtitle = subtitle || t.home.defaultSubtitle;
  const [line1, line2] = resolvedTitle.split("\n");

  return (
    <section className="relative overflow-hidden bg-primary text-white">
      {imageUrl && (
        <>
          <OptimizedImage
            src={imageUrl}
            alt=""
            fill
            priority
            sizes="100vw"
            className="object-cover"
          />
          <div className="absolute inset-0 bg-primary/75" />
        </>
      )}
      <div className="relative mx-auto max-w-6xl px-4 py-24 md:py-32">
        <div className="max-w-2xl">
          <p className="mb-4 text-sm font-medium uppercase tracking-wider text-secondary">
            {t.home.eyebrow}
          </p>
          <h1 className="text-4xl font-bold leading-tight md:text-5xl lg:text-6xl">
            {line1}
            {line2 && (
              <>
                <br />
                {line2}
              </>
            )}
          </h1>
          <p className="mt-6 text-lg text-white/80">{resolvedSubtitle}</p>
          <div className="mt-8 flex flex-wrap gap-4">
            <LocaleLink href="/start">
              <Button variant="secondary" size="lg">
                {t.nav.findPath} <ArrowRight className="ms-2 h-4 w-4" />
              </Button>
            </LocaleLink>
            <LocaleLink href="/book">
              <Button
                variant="outline"
                size="lg"
                className="border-white/30 text-white hover:bg-white/10"
              >
                {t.nav.bookAssessment}
              </Button>
            </LocaleLink>
          </div>
        </div>

        <div className="mt-16 grid grid-cols-3 gap-6 border-t border-white/20 pt-8">
          <div className="flex items-center gap-3">
            <Target className="h-8 w-8 text-secondary" />
            <div>
              <p className="text-2xl font-bold">100+</p>
              <p className="text-sm text-white/70">{t.home.statClients}</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Users className="h-8 w-8 text-secondary" />
            <div>
              <p className="text-2xl font-bold">5+</p>
              <p className="text-sm text-white/70">{t.home.statYears}</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Award className="h-8 w-8 text-secondary" />
            <div>
              <p className="text-2xl font-bold">{t.home.certified}</p>
              <p className="text-sm text-white/70">{t.home.statCertified}</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
