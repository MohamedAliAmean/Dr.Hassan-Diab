"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";
import { Card } from "@/components/ui/Card";
import { CheckCircle } from "lucide-react";

export default function PortalLogPage() {
  const [saved, setSaved] = useState(false);
  const [saving, setSaving] = useState(false);
  const [duration, setDuration] = useState("");
  const [notes, setNotes] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);

    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (user) {
      await supabase.from("workout_logs").insert({
        client_id: user.id,
        duration_min: duration ? Number(duration) : null,
        notes: notes || null,
      });
      setSaved(true);
    }
    setSaving(false);
  }

  if (saved) {
    return (
      <Card className="mx-auto max-w-md text-center">
        <CheckCircle className="mx-auto h-12 w-12 text-primary" />
        <h2 className="mt-4 text-xl font-bold">Workout Logged!</h2>
        <p className="text-muted">Great job showing up today.</p>
        <Button className="mt-4" onClick={() => { setSaved(false); setDuration(""); setNotes(""); }}>
          Log Another
        </Button>
      </Card>
    );
  }

  return (
    <div className="mx-auto max-w-md">
      <h1 className="text-2xl font-bold">Log Workout</h1>
      <p className="text-muted">Record today&apos;s training session.</p>

      <Card className="mt-6">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-sm font-medium">Duration (minutes)</label>
            <Input type="number" value={duration} onChange={(e) => setDuration(e.target.value)} className="mt-1" />
          </div>
          <div>
            <label className="text-sm font-medium">Notes</label>
            <Textarea value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="How did it go?" className="mt-1" />
          </div>
          <Button type="submit" className="w-full" disabled={saving}>
            {saving ? "Saving..." : "Log Workout"}
          </Button>
        </form>
      </Card>
    </div>
  );
}
