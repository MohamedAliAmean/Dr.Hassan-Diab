"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";
import { Card, CardTitle } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { slugify } from "@/lib/utils";
import type { BlogPost } from "@/types/database";
import { Plus, Pencil } from "lucide-react";

export default function AdminBlogPage() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [editing, setEditing] = useState<Partial<BlogPost> | null>(null);
  const [saving, setSaving] = useState(false);
  async function load() {
    const supabase = createClient();
    const { data } = await supabase.from("blog_posts").select("*").order("created_at", { ascending: false });
    setPosts(data || []);
  }

  useEffect(() => { load(); }, []);

  async function handleSave() {
    if (!editing?.title) return;
    setSaving(true);
    const supabase = createClient();
    const payload = {
      ...editing,
      slug: editing.slug || slugify(editing.title),
      published_at: editing.is_published ? (editing.published_at || new Date().toISOString()) : null,
    };
    if (editing.id) {
      await supabase.from("blog_posts").update(payload).eq("id", editing.id);
    } else {
      await supabase.from("blog_posts").insert(payload);
    }
    setEditing(null);
    setSaving(false);
    load();
  }

  return (
    <div>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Blog</h1>
          <p className="text-muted">Write training tips and articles.</p>
        </div>
        <Button onClick={() => setEditing({ title: "", is_published: false, tags: [] })}>
          <Plus className="mr-1 h-4 w-4" /> New Post
        </Button>
      </div>

      {editing && (
        <Card className="mt-6">
          <CardTitle>{editing.id ? "Edit Post" : "New Post"}</CardTitle>
          <div className="mt-4 space-y-4">
            <Input placeholder="Title" value={editing.title || ""} onChange={(e) => setEditing({ ...editing, title: e.target.value })} />
            <Input placeholder="Category" value={editing.category || ""} onChange={(e) => setEditing({ ...editing, category: e.target.value })} />
            <Textarea placeholder="Excerpt" value={editing.excerpt || ""} onChange={(e) => setEditing({ ...editing, excerpt: e.target.value })} />
            <Textarea placeholder="Content" value={editing.content || ""} onChange={(e) => setEditing({ ...editing, content: e.target.value })} className="min-h-[200px]" />
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

      <div className="mt-6 space-y-4">
        {posts.map((post) => (
          <Card key={post.id}>
            <div className="flex items-start justify-between">
              <div>
                <CardTitle>{post.title}</CardTitle>
                <p className="text-sm text-muted">{post.excerpt}</p>
                <Badge className="mt-2" variant={post.is_published ? "success" : "warning"}>
                  {post.is_published ? "Published" : "Draft"}
                </Badge>
              </div>
              <button onClick={() => setEditing(post)}><Pencil className="h-4 w-4 text-muted" /></button>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
