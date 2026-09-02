"use client";

import { useCallback, useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Card, CardTitle } from "@/components/ui/Card";
import { Select } from "@/components/ui/Select";
import { MediaUpload } from "@/components/admin/MediaUpload";
import { STORAGE_BUCKETS } from "@/lib/constants";
import type { Media } from "@/types/database";
import { format } from "date-fns";
import { Trash2 } from "lucide-react";

const FOLDER_OPTIONS = [
  { value: STORAGE_BUCKETS.general, label: "General" },
  { value: STORAGE_BUCKETS.exercises, label: "Exercises" },
  { value: STORAGE_BUCKETS.transformations, label: "Transformations" },
  { value: STORAGE_BUCKETS.blog, label: "Blog" },
  { value: STORAGE_BUCKETS.challenges, label: "Challenges" },
  { value: STORAGE_BUCKETS.services, label: "Services" },
  { value: STORAGE_BUCKETS.avatars, label: "Avatars" },
];

export default function AdminMediaPage() {
  const [media, setMedia] = useState<Media[]>([]);
  const [folder, setFolder] = useState<string>(STORAGE_BUCKETS.general);
  const [lastUploaded, setLastUploaded] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const load = useCallback(async () => {
    const supabase = createClient();
    const { data } = await supabase
      .from("media")
      .select("*")
      .order("uploaded_at", { ascending: false });
    setMedia(data || []);
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  async function handleDelete(item: Media) {
    if (!confirm(`Delete "${item.file_name}"?`)) return;
    setDeletingId(item.id);

    try {
      const supabase = createClient();
      const bucket = item.folder || STORAGE_BUCKETS.general;

      // Try to remove from storage if path can be inferred from URL
      const marker = `/object/public/${bucket}/`;
      const idx = item.file_url.indexOf(marker);
      if (idx !== -1) {
        const path = decodeURIComponent(item.file_url.slice(idx + marker.length));
        await supabase.storage.from(bucket).remove([path]);
      }

      await supabase.from("media").delete().eq("id", item.id);
      await load();
    } finally {
      setDeletingId(null);
    }
  }

  return (
    <div>
      <h1 className="text-2xl font-bold">Media Library</h1>
      <p className="text-muted">
        Upload images and videos here, or from Exercises / Transformations / Settings.
      </p>

      <Card className="mt-6">
        <CardTitle>Upload Media</CardTitle>
        <div className="mt-4 grid gap-4 md:grid-cols-2">
          <div>
            <label className="text-sm font-medium">Folder / Bucket</label>
            <Select
              className="mt-1"
              value={folder}
              onChange={(e) => {
                setFolder(e.target.value);
                setLastUploaded(null);
              }}
            >
              {FOLDER_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </Select>
          </div>
        </div>

        <div className="mt-4">
          <MediaUpload
            key={folder}
            bucket={folder}
            folder=""
            label="Choose image or video"
            currentUrl={lastUploaded}
            onUpload={async (url) => {
              setLastUploaded(url);
              await load();
            }}
            onRemove={() => setLastUploaded(null)}
          />
        </div>

        {lastUploaded && (
          <div className="mt-4 flex items-center gap-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setLastUploaded(null)}
            >
              Upload another file
            </Button>
            <p className="text-sm text-muted truncate">Uploaded: {lastUploaded}</p>
          </div>
        )}
      </Card>

      <div className="mt-8">
        <h2 className="text-lg font-semibold">All Files ({media.length})</h2>
        <div className="mt-4 grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {media.map((item) => (
            <div key={item.id} className="rounded-xl border border-border overflow-hidden">
              {item.file_type === "video" ? (
                <video src={item.file_url} controls className="aspect-video w-full object-cover" />
              ) : (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={item.file_url}
                  alt={item.alt_text || item.file_name}
                  className="aspect-square w-full object-cover"
                />
              )}
              <div className="p-3">
                <p className="truncate text-sm font-medium">{item.file_name}</p>
                <div className="mt-1 flex items-center justify-between gap-2">
                  <Badge>{item.folder || "general"}</Badge>
                  <span className="text-xs text-muted">
                    {format(new Date(item.uploaded_at), "MMM d")}
                  </span>
                </div>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="mt-2 text-red-600"
                  disabled={deletingId === item.id}
                  onClick={() => handleDelete(item)}
                >
                  <Trash2 className="mr-1 h-3.5 w-3.5" />
                  {deletingId === item.id ? "Deleting..." : "Delete"}
                </Button>
              </div>
            </div>
          ))}
          {media.length === 0 && (
            <p className="col-span-full py-12 text-center text-muted">
              No media yet. Use the upload box above.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
