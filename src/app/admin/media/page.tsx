"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { Badge } from "@/components/ui/Badge";
import type { Media } from "@/types/database";
import { format } from "date-fns";

export default function AdminMediaPage() {
  const [media, setMedia] = useState<Media[]>([]);
  const supabase = createClient();

  useEffect(() => {
    async function load() {
      const { data } = await supabase
        .from("media")
        .select("*")
        .order("uploaded_at", { ascending: false });
      setMedia(data || []);
    }
    load();
  }, []);

  return (
    <div>
      <h1 className="text-2xl font-bold">Media Library</h1>
      <p className="text-muted">
        All uploaded images and videos. Upload files from Exercises, Transformations, or Settings pages.
      </p>

      <div className="mt-6 grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {media.map((item) => (
          <div key={item.id} className="rounded-xl border border-border overflow-hidden">
            {item.file_type === "video" ? (
              <video src={item.file_url} className="aspect-video w-full object-cover" />
            ) : (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={item.file_url} alt={item.alt_text || item.file_name} className="aspect-square w-full object-cover" />
            )}
            <div className="p-3">
              <p className="truncate text-sm font-medium">{item.file_name}</p>
              <div className="mt-1 flex items-center justify-between">
                <Badge>{item.folder || "general"}</Badge>
                <span className="text-xs text-muted">
                  {format(new Date(item.uploaded_at), "MMM d")}
                </span>
              </div>
            </div>
          </div>
        ))}
        {media.length === 0 && (
          <p className="col-span-full py-12 text-center text-muted">
            No media uploaded yet. Upload from Exercises or Settings.
          </p>
        )}
      </div>
    </div>
  );
}
