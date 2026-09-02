"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";
import { Select } from "@/components/ui/Select";
import { Card, CardTitle } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { MediaUpload } from "@/components/admin/MediaUpload";
import { PageEditorHeader } from "@/components/admin/PageEditorHeader";
import { MUSCLE_GROUPS, STORAGE_BUCKETS } from "@/lib/constants";
import { slugify } from "@/lib/utils";
import type { Exercise } from "@/types/database";
import { Plus, Pencil } from "lucide-react";

export default function AdminExercisesPage() {
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [editing, setEditing] = useState<Partial<Exercise> | null>(null);
  const [saving, setSaving] = useState(false);

  async function loadExercises() {
    const supabase = createClient();
    const { data } = await supabase.from("exercises").select("*").order("name");
    setExercises(data || []);
  }

  useEffect(() => {
    loadExercises();
  }, []);

  function startNew() {
    setEditing({
      name: "",
      slug: "",
      description: "",
      muscle_group: "chest",
      difficulty: "beginner",
      equipment: [],
      instructions: [],
      common_mistakes: [],
      tips: "",
      is_published: false,
    });
  }

  async function handleSave() {
    if (!editing?.name) return;
    setSaving(true);
    const supabase = createClient();

    const payload = {
      ...editing,
      slug: editing.slug || slugify(editing.name),
      instructions: typeof editing.instructions === "string"
        ? (editing.instructions as string).split("\n").filter(Boolean)
        : editing.instructions,
      common_mistakes: typeof editing.common_mistakes === "string"
        ? (editing.common_mistakes as string).split("\n").filter(Boolean)
        : editing.common_mistakes,
    };

    if (editing.id) {
      await supabase.from("exercises").update(payload).eq("id", editing.id);
    } else {
      await supabase.from("exercises").insert(payload);
    }

    setEditing(null);
    setSaving(false);
    loadExercises();
  }

  return (
    <div>
      <PageEditorHeader
        title="Exercises Page"
        publicPath="/exercises"
        description="Manage exercises for /exercises. Upload a demo video and thumbnail for each exercise."
      />

      <div className="mb-4 flex justify-end">
        <Button onClick={startNew}>
          <Plus className="mr-1 h-4 w-4" /> Add Exercise
        </Button>
      </div>

      {editing && (
        <Card className="mt-6">
          <CardTitle>{editing.id ? "Edit Exercise" : "New Exercise"}</CardTitle>
          <div className="mt-4 grid gap-4 md:grid-cols-2">
            <Input
              placeholder="Exercise name"
              value={editing.name || ""}
              onChange={(e) => setEditing({ ...editing, name: e.target.value })}
            />
            <Select
              value={editing.muscle_group || "chest"}
              onChange={(e) => setEditing({ ...editing, muscle_group: e.target.value as Exercise["muscle_group"] })}
            >
              {MUSCLE_GROUPS.map((g) => (
                <option key={g.value} value={g.value}>{g.label}</option>
              ))}
            </Select>
            <Select
              value={editing.difficulty || "beginner"}
              onChange={(e) => setEditing({ ...editing, difficulty: e.target.value as Exercise["difficulty"] })}
            >
              <option value="beginner">Beginner</option>
              <option value="intermediate">Intermediate</option>
              <option value="advanced">Advanced</option>
            </Select>
            <label className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={editing.is_published || false}
                onChange={(e) => setEditing({ ...editing, is_published: e.target.checked })}
              />
              Published
            </label>
            <div className="md:col-span-2">
              <Textarea
                placeholder="Description"
                value={editing.description || ""}
                onChange={(e) => setEditing({ ...editing, description: e.target.value })}
              />
            </div>
            <div className="md:col-span-2">
              <Textarea
                placeholder="Instructions (one per line)"
                value={Array.isArray(editing.instructions) ? editing.instructions.join("\n") : ""}
                onChange={(e) => setEditing({ ...editing, instructions: e.target.value.split("\n") })}
              />
            </div>
            <div className="md:col-span-2">
              <Textarea
                placeholder="Common mistakes (one per line)"
                value={Array.isArray(editing.common_mistakes) ? editing.common_mistakes.join("\n") : ""}
                onChange={(e) => setEditing({ ...editing, common_mistakes: e.target.value.split("\n") })}
              />
            </div>
            <MediaUpload
              bucket={STORAGE_BUCKETS.exercises}
              label="Exercise Video"
              currentUrl={editing.video_url}
              onUpload={(url) => setEditing({ ...editing, video_url: url })}
              onRemove={() => setEditing({ ...editing, video_url: null })}
            />
            <MediaUpload
              bucket={STORAGE_BUCKETS.exercises}
              label="Thumbnail"
              accept="image/*"
              currentUrl={editing.thumbnail_url}
              onUpload={(url) => setEditing({ ...editing, thumbnail_url: url })}
              onRemove={() => setEditing({ ...editing, thumbnail_url: null })}
            />
          </div>
          <div className="mt-4 flex gap-2">
            <Button onClick={handleSave} disabled={saving}>
              {saving ? "Saving..." : "Save"}
            </Button>
            <Button variant="ghost" onClick={() => setEditing(null)}>Cancel</Button>
          </div>
        </Card>
      )}

      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {exercises.map((exercise) => (
          <Card key={exercise.id}>
            <div className="flex items-start justify-between">
              <div>
                <CardTitle>{exercise.name}</CardTitle>
                <div className="mt-2 flex gap-2">
                  <Badge>{exercise.muscle_group}</Badge>
                  {exercise.is_published ? (
                    <Badge variant="success">Published</Badge>
                  ) : (
                    <Badge variant="warning">Draft</Badge>
                  )}
                </div>
              </div>
              <button onClick={() => setEditing(exercise)}>
                <Pencil className="h-4 w-4 text-muted" />
              </button>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
