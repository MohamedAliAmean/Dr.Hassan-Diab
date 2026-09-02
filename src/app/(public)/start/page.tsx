import type { Metadata } from "next";
import { PathFinderQuiz } from "@/components/path-finder/PathFinderQuiz";

export const metadata: Metadata = {
  title: "Find Your Training Path",
  description: "Take our 2-minute quiz to discover your personalized training program.",
};

export default function StartPage() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-16">
      <div className="mb-12 text-center">
        <h1 className="text-3xl font-bold md:text-4xl">Find Your Training Path</h1>
        <p className="mt-4 text-muted">
          Answer a few questions and get a personalized recommendation in under 2 minutes.
        </p>
      </div>
      <PathFinderQuiz />
    </div>
  );
}
