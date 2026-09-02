"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Card, CardTitle } from "@/components/ui/Card";
import type { ProgressEntry } from "@/types/database";
import { format } from "date-fns";

export default function PortalProgressPage() {
  const [entries, setEntries] = useState<ProgressEntry[]>([]);
  const [weight, setWeight] = useState("");
  const [saving, setSaving] = useState(false);
  async function load() {
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;
    const { data } = await supabase
      .from("progress_entries")
      .select("*")
      .eq("client_id", user.id)
      .order("recorded_at", { ascending: false });
    setEntries(data || []);
  }

  useEffect(() => { load(); }, []);

  async function handleAdd(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (user && weight) {
      await supabase.from("progress_entries").insert({
        client_id: user.id,
        weight_kg: Number(weight),
        recorded_at: new Date().toISOString().split("T")[0],
      });
      setWeight("");
      load();
    }
    setSaving(false);
  }

  return (
    <div>
      <h1 className="text-2xl font-bold">My Progress</h1>
      <p className="text-muted">Track your weight and measurements over time.</p>

      <Card className="mt-6 max-w-md">
        <CardTitle>Log Weight</CardTitle>
        <form onSubmit={handleAdd} className="mt-4 flex gap-2">
          <Input type="number" step="0.1" placeholder="Weight (kg)" value={weight} onChange={(e) => setWeight(e.target.value)} required />
          <Button type="submit" disabled={saving}>{saving ? "..." : "Add"}</Button>
        </form>
      </Card>

      <div className="mt-8">
        <h2 className="font-semibold">History</h2>
        <div className="mt-4 space-y-2">
          {entries.map((entry) => (
            <div key={entry.id} className="flex items-center justify-between rounded-lg border border-border p-4">
              <span className="text-muted">{format(new Date(entry.recorded_at), "MMM d, yyyy")}</span>
              <span className="font-bold">{entry.weight_kg} kg</span>
            </div>
          ))}
          {entries.length === 0 && (
            <p className="py-8 text-center text-muted">No progress logged yet. Add your first entry above.</p>
          )}
        </div>
      </div>
    </div>
  );
}
