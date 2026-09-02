import Link from "next/link";
import { Hero } from "@/components/home/Hero";
import { Button } from "@/components/ui/Button";
import { Card, CardTitle, CardDescription } from "@/components/ui/Card";
import { ArrowRight, Dumbbell, Heart, Zap } from "lucide-react";

export default function HomePage() {
  return (
    <>
      <Hero />

      <section className="mx-auto max-w-6xl px-4 py-20">
        <div className="text-center">
          <h2 className="text-3xl font-bold">Not Your Average Gym Website</h2>
          <p className="mx-auto mt-4 max-w-2xl text-muted">
            Take our 2-minute quiz to discover your personalized training path.
            No commitment — just clarity on what works for you.
          </p>
          <Link href="/start" className="mt-6 inline-block">
            <Button size="lg">
              Start Path Finder <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
        </div>
      </section>

      <section className="bg-card py-20">
        <div className="mx-auto max-w-6xl px-4">
          <h2 className="text-center text-3xl font-bold">How It Works</h2>
          <div className="mt-12 grid gap-8 md:grid-cols-3">
            <Card className="text-center">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                <Zap className="h-6 w-6 text-primary" />
              </div>
              <CardTitle className="mt-4">1. Find Your Path</CardTitle>
              <CardDescription>
                Take our quiz to get a personalized training recommendation based on your goals.
              </CardDescription>
            </Card>
            <Card className="text-center">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                <Heart className="h-6 w-6 text-primary" />
              </div>
              <CardTitle className="mt-4">2. Free Assessment</CardTitle>
              <CardDescription>
                Book a free movement assessment to understand your body and set real goals.
              </CardDescription>
            </Card>
            <Card className="text-center">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                <Dumbbell className="h-6 w-6 text-primary" />
              </div>
              <CardTitle className="mt-4">3. Train & Track</CardTitle>
              <CardDescription>
                Get your custom program, log workouts, and track progress in your personal portal.
              </CardDescription>
            </Card>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-20">
        <div className="flex flex-col items-center justify-between gap-6 rounded-2xl bg-primary p-12 text-center text-white md:flex-row md:text-left">
          <div>
            <h2 className="text-3xl font-bold">Ready to Start?</h2>
            <p className="mt-2 text-white/80">
              Book your free 15-minute movement assessment today.
            </p>
          </div>
          <Link href="/book">
            <Button variant="secondary" size="lg">
              Book Free Assessment
            </Button>
          </Link>
        </div>
      </section>
    </>
  );
}
