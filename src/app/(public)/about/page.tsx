import type { Metadata } from "next";
import { Card, CardTitle, CardDescription } from "@/components/ui/Card";

export const metadata: Metadata = {
  title: "About Hassan Diab",
};

export default function AboutPage() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-16">
      <div className="grid gap-12 md:grid-cols-2 md:items-center">
        <div>
          <h1 className="text-4xl font-bold">About Hassan</h1>
          <p className="mt-2 text-lg text-secondary font-medium">
            Sustainable Strength. Real Results.
          </p>
          <div className="mt-6 space-y-4 text-muted">
            <p>
              I believe training should fit your life — not the other way around. With over 5 years
              of experience coaching clients from beginners to competitive athletes, I focus on
              building sustainable habits that last.
            </p>
            <p>
              My approach combines evidence-based programming with personalized attention. Every
              client gets a custom plan based on their body, goals, schedule, and limitations.
            </p>
            <p>
              No cookie-cutter programs. No extreme diets. Just smart training that delivers
              measurable results.
            </p>
          </div>
        </div>

        <div className="aspect-square rounded-2xl bg-primary/10 flex items-center justify-center">
          <p className="text-muted text-sm">Trainer photo — upload from Admin Settings</p>
        </div>
      </div>

      <div className="mt-20">
        <h2 className="text-2xl font-bold text-center">My Philosophy</h2>
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
