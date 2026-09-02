"use client";

import { useState } from "react";
import { ArrowLeft, ArrowRight, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";
import { Select } from "@/components/ui/Select";
import { Card } from "@/components/ui/Card";
import { FITNESS_GOALS, EXPERIENCE_LEVELS, SCHEDULE_OPTIONS } from "@/lib/constants";
import type { ExperienceLevel, FitnessGoal } from "@/types/database";

const STEPS = ["goal", "experience", "schedule", "health", "contact", "result"] as const;
type Step = (typeof STEPS)[number];

const GOAL_RECOMMENDATIONS: Record<FitnessGoal, string> = {
  weight_loss: "Fat Loss Program",
  muscle_gain: "Hypertrophy Program",
  performance: "Athletic Performance Program",
  rehab: "Rehab & Recovery Program",
};

export function PathFinderQuiz() {
  const [step, setStep] = useState<Step>("goal");
  const [goal, setGoal] = useState<FitnessGoal | "">("");
  const [experience, setExperience] = useState<ExperienceLevel | "">("");
  const [schedule, setSchedule] = useState("");
  const [injuries, setInjuries] = useState("");
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const stepIndex = STEPS.indexOf(step);
  const progress = ((stepIndex + 1) / STEPS.length) * 100;

  async function handleSubmit() {
    setSubmitting(true);
    try {
      const res = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          full_name: fullName,
          email,
          phone,
          goal,
          experience,
          schedule,
          injuries,
          quiz_answers: { goal, experience, schedule, injuries },
        }),
      });
      if (res.ok) setSubmitted(true);
    } finally {
      setSubmitting(false);
    }
  }

  function next() {
    const idx = STEPS.indexOf(step);
    if (idx < STEPS.length - 1) setStep(STEPS[idx + 1]);
  }

  function back() {
    const idx = STEPS.indexOf(step);
    if (idx > 0) setStep(STEPS[idx - 1]);
  }

  if (submitted) {
    return (
      <Card className="mx-auto max-w-lg text-center">
        <CheckCircle className="mx-auto h-16 w-16 text-primary" />
        <h2 className="mt-4 text-2xl font-bold">Your Path is Ready!</h2>
        <p className="mt-2 text-muted">
          Based on your answers, we recommend the{" "}
          <strong>{goal ? GOAL_RECOMMENDATIONS[goal] : "best program for you"}</strong>.
          Hassan will reach out within 24 hours.
        </p>
        <a href="/book" className="mt-6 inline-block">
          <Button>Book Your Free Assessment</Button>
        </a>
      </Card>
    );
  }

  return (
    <div className="mx-auto max-w-lg">
      <div className="mb-6 h-2 rounded-full bg-border">
        <div
          className="h-2 rounded-full bg-primary transition-all"
          style={{ width: `${progress}%` }}
        />
      </div>

      <Card>
        {step === "goal" && (
          <div className="space-y-4">
            <h2 className="text-xl font-bold">What&apos;s your primary goal?</h2>
            <div className="grid gap-3">
              {FITNESS_GOALS.map((g) => (
                <button
                  key={g.value}
                  onClick={() => setGoal(g.value)}
                  className={`rounded-lg border p-4 text-left transition-colors ${
                    goal === g.value
                      ? "border-primary bg-primary/5"
                      : "border-border hover:border-primary/50"
                  }`}
                >
                  <p className="font-medium">{g.label}</p>
                  <p className="text-sm text-muted">{g.description}</p>
                </button>
              ))}
            </div>
          </div>
        )}

        {step === "experience" && (
          <div className="space-y-4">
            <h2 className="text-xl font-bold">What&apos;s your training experience?</h2>
            <div className="space-y-3">
              {EXPERIENCE_LEVELS.map((e) => (
                <button
                  key={e.value}
                  onClick={() => setExperience(e.value)}
                  className={`w-full rounded-lg border p-4 text-left transition-colors ${
                    experience === e.value
                      ? "border-primary bg-primary/5"
                      : "border-border hover:border-primary/50"
                  }`}
                >
                  {e.label}
                </button>
              ))}
            </div>
          </div>
        )}

        {step === "schedule" && (
          <div className="space-y-4">
            <h2 className="text-xl font-bold">How often can you train?</h2>
            <Select value={schedule} onChange={(e) => setSchedule(e.target.value)}>
              <option value="">Select schedule...</option>
              {SCHEDULE_OPTIONS.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </Select>
          </div>
        )}

        {step === "health" && (
          <div className="space-y-4">
            <h2 className="text-xl font-bold">Any injuries or health concerns?</h2>
            <Textarea
              placeholder="Tell us about any injuries, limitations, or health conditions..."
              value={injuries}
              onChange={(e) => setInjuries(e.target.value)}
            />
          </div>
        )}

        {step === "contact" && (
          <div className="space-y-4">
            <h2 className="text-xl font-bold">Almost done! Your details:</h2>
            <Input
              placeholder="Full name"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              required
            />
            <Input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <Input
              type="tel"
              placeholder="Phone (optional)"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
            />
          </div>
        )}

        {step === "result" && (
          <div className="space-y-4 text-center">
            <h2 className="text-xl font-bold">Your Recommended Path</h2>
            <div className="rounded-lg bg-primary/5 p-6">
              <p className="text-2xl font-bold text-primary">
                {goal ? GOAL_RECOMMENDATIONS[goal] : "Custom Program"}
              </p>
              <p className="mt-2 text-sm text-muted">
                Tailored for {experience || "your"} level, {schedule || "your schedule"}
              </p>
            </div>
            <p className="text-sm text-muted">
              Submit to get your personalized plan and hear from Hassan within 24 hours.
            </p>
          </div>
        )}

        <div className="mt-6 flex justify-between">
          {stepIndex > 0 && step !== "result" ? (
            <Button variant="ghost" onClick={back}>
              <ArrowLeft className="mr-1 h-4 w-4" /> Back
            </Button>
          ) : (
            <div />
          )}

          {step === "result" ? (
            <Button onClick={handleSubmit} disabled={submitting}>
              {submitting ? "Submitting..." : "Get My Plan"}
            </Button>
          ) : (
            <Button
              onClick={next}
              disabled={
                (step === "goal" && !goal) ||
                (step === "experience" && !experience) ||
                (step === "schedule" && !schedule) ||
                (step === "contact" && (!fullName || !email))
              }
            >
              Next <ArrowRight className="ml-1 h-4 w-4" />
            </Button>
          )}
        </div>
      </Card>
    </div>
  );
}
