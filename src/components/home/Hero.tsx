import Link from "next/link";
import { ArrowRight, Target, Users, Award } from "lucide-react";
import { Button } from "@/components/ui/Button";

interface HeroProps {
  title?: string;
  subtitle?: string;
  imageUrl?: string | null;
}

export function Hero({
  title = "Train Smarter.\nLive Stronger.",
  subtitle = "Personal coaching built around your body, your schedule, and your goals. No gimmicks — just sustainable strength and real results.",
  imageUrl,
}: HeroProps) {
  const [line1, line2] = title.split("\n");

  return (
    <section className="relative overflow-hidden bg-primary text-white">
      {imageUrl && (
        <>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={imageUrl}
            alt=""
            className="absolute inset-0 h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-primary/75" />
        </>
      )}
      <div className="relative mx-auto max-w-6xl px-4 py-24 md:py-32">
        <div className="max-w-2xl">
          <p className="mb-4 text-sm font-medium uppercase tracking-wider text-secondary">
            Personal Training Coach
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
          <p className="mt-6 text-lg text-white/80">{subtitle}</p>
          <div className="mt-8 flex flex-wrap gap-4">
            <Link href="/start">
              <Button variant="secondary" size="lg">
                Find Your Path <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
            <Link href="/book">
              <Button
                variant="outline"
                size="lg"
                className="border-white/30 text-white hover:bg-white/10"
              >
                Book Free Assessment
              </Button>
            </Link>
          </div>
        </div>

        <div className="mt-16 grid grid-cols-3 gap-6 border-t border-white/20 pt-8">
          <div className="flex items-center gap-3">
            <Target className="h-8 w-8 text-secondary" />
            <div>
              <p className="text-2xl font-bold">100+</p>
              <p className="text-sm text-white/70">Clients Transformed</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Users className="h-8 w-8 text-secondary" />
            <div>
              <p className="text-2xl font-bold">5+</p>
              <p className="text-sm text-white/70">Years Experience</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Award className="h-8 w-8 text-secondary" />
            <div>
              <p className="text-2xl font-bold">Certified</p>
              <p className="text-sm text-white/70">Personal Trainer</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
