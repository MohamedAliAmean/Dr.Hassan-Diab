"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";
import { Card, CardTitle } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { MediaUpload } from "@/components/admin/MediaUpload";
import { STORAGE_BUCKETS } from "@/lib/constants";
import { slugify } from "@/lib/utils";
import type { Transformation } from "@/types/database";
import { Plus, Pencil } from "lucide-react";

export default function AdminTransformationsPage() {
  const [items, setItems] = useState<Transformation[]>([]);
  const [editing, setEditing] = useState<Partial<Transformation> | null>(null);
  const [saving, setSaving] = useState(false);
  const supabase = createClient();

  async function load() {
    const { data } = await supabase.from("transformations").select("*").order("sort_order");
    setItems(data || []);
  }

  useEffect(() => { load(); }, []);

  async function handleSave() {
    if (!editing?.title || !editing?.client_name) return;
    setSaving(true);
    const payload = {
      ...editing,
      slug: editing.slug || slugify(editing.title),
    };
    if (editing.id) {
      await supabase.from("transformations").update(payload).eq("id", editing.id);
    } else {
      await supabase.from("transformations").insert(payload);
    }
    setEditing(null);
    setSaving(false);
    load();
  }

  return (
    <div>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Transformations</h1>
          <p className="text-muted">Manage client success stories with before/after photos.</p>
        </div>
        <Button onClick={() => setEditing({ client_name: "", title: "", is_published: false, sort_order: items.length })}>
          <Plus className="mr-1 h-4 w-4" /> Add Story
        </Button>
      </div>

      {editing && (
        <Card className="mt-6">
          <CardTitle>{editing.id ? "Edit Story" : "New Story"}</CardTitle>
          <div className="mt-4 grid gap-4 md:grid-cols-2">
            <Input placeholder="Client name (e.g. Ahmed M.)" value={editing.client_name || ""} onChange={(e) => setEditing({ ...editing, client_name: e.target.value })} />
            <Input placeholder="Story title" value={editing.title || ""} onChange={(e) => setEditing({ ...editing, title: e.target.value })} />
            <Input type="number" placeholder="Duration (weeks)" value={editing.duration_weeks || ""} onChange={(e) => setEditing({ ...editing, duration_weeks: Number(e.target.value) })} />
            <Input placeholder="Goal" value={editing.goal || ""} onChange={(e) => setEditing({ ...editing, goal: e.target.value })} />
            <div className="md:col-span-2">
              <Textarea placeholder="Summary" value={editing.summary || ""} onChange={(e) => setEditing({ ...editing, summary: e.target.value })} />
            </div>
            <MediaUpload bucket={STORAGE_BUCKETS.transformations} label="Before Photo" accept="image/*" currentUrl={editing.before_image} onUpload={(url) => setEditing({ ...editing, before_image: url })} onRemove={() => setEditing({ ...editing, before_image: null })} />
            <MediaUpload bucket={STORAGE_BUCKETS.transformations} label="After Photo" accept="image/*" currentUrl={editing.after_image} onUpload={(url) => setEditing({ ...editing, after_image: url })} onRemove={() => setEditing({ ...editing, after_image: null })} />
            <label className="flex items-center gap-2 text-sm">
              <input type="checkbox" checked={editing.is_published || false} onChange={(e) => setEditing({ ...editing, is_published: e.target.checked })} />
              Published
            </label>
          </div>
          <div className="mt-4 flex gap-2">
            <Button onClick={handleSave} disabled={saving}>{saving ? "Saving..." : "Save"}</Button>
            <Button variant="ghost" onClick={() => setEditing(null)}>Cancel</Button>
          </div>
        </Card>
      )}

      <div className="mt-6 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {items.map((item) => (
          <Card key={item.id}>
            <div className="flex items-start justify-between">
              <div>
                <CardTitle>{item.title}</CardTitle>
                <p className="text-sm text-muted">{item.client_name}</p>
                <Badge className="mt-2" variant={item.is_published ? "success" : "warning"}>
                  {item.is_published ? "Published" : "Draft"}
                </Badge>
              </div>
              <button onClick={() => setEditing(item)}><Pencil className="h-4 w-4 text-muted" /></button>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
