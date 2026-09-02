"use client";

import { useState, useRef } from "react";
import { Upload, X, Loader2 } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils";
import { optimizeUploadFile } from "@/lib/media/optimize-upload";

interface MediaUploadProps {
  bucket: string;
  folder?: string;
  accept?: string;
  currentUrl?: string | null;
  onUpload: (url: string) => void;
  onRemove?: () => void;
  label?: string;
  className?: string;
}

export function MediaUpload({
  bucket,
  folder = "",
  accept = "image/*,video/*",
  currentUrl,
  onUpload,
  onRemove,
  label = "Upload file",
  className,
}: MediaUploadProps) {
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  async function handleUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    setError(null);
    setProgress("Optimizing for web…");

    try {
      const optimized = await optimizeUploadFile(file, (p) => {
        setProgress(p.message);
      });

      setProgress("Uploading…");
      const supabase = createClient();
      const ext = optimized.name.split(".").pop() || "bin";
      const fileName = `${folder ? folder + "/" : ""}${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;

      const { error: uploadError } = await supabase.storage
        .from(bucket)
        .upload(fileName, optimized, {
          upsert: true,
          contentType: optimized.type || file.type,
          cacheControl: "31536000",
        });

      if (uploadError) throw uploadError;

      const {
        data: { publicUrl },
      } = supabase.storage.from(bucket).getPublicUrl(fileName);

      await supabase.from("media").insert({
        file_name: optimized.name,
        file_url: publicUrl,
        file_type: optimized.type.startsWith("video") ? "video" : "image",
        file_size: optimized.size,
        folder: folder || bucket,
      });

      onUpload(publicUrl);
      setProgress(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Upload failed");
      setProgress(null);
    } finally {
      setUploading(false);
      if (inputRef.current) inputRef.current.value = "";
    }
  }

  const isVideo = currentUrl?.match(/\.(mp4|webm|mov)$/i);

  return (
    <div className={cn("space-y-2", className)}>
      {label && <label className="text-sm font-medium">{label}</label>}

      {currentUrl ? (
        <div className="relative overflow-hidden rounded-lg border border-border">
          {isVideo ? (
            <video
              src={currentUrl}
              controls
              preload="metadata"
              className="max-h-48 w-full object-cover"
            />
          ) : (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={currentUrl}
              alt="Upload preview"
              className="max-h-48 w-full object-cover"
            />
          )}
          {onRemove && (
            <button
              type="button"
              onClick={onRemove}
              className="absolute end-2 top-2 rounded-full bg-red-600 p-1 text-white"
            >
              <X size={14} />
            </button>
          )}
        </div>
      ) : (
        <div
          onClick={() => !uploading && inputRef.current?.click()}
          className="flex cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed border-border p-8 transition-colors hover:border-primary"
        >
          {uploading ? (
            <>
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
              {progress && <p className="mt-2 text-sm text-muted">{progress}</p>}
            </>
          ) : (
            <>
              <Upload className="h-8 w-8 text-muted" />
              <p className="mt-2 text-sm text-muted">
                Click to upload (images → WebP, videos → WebM)
              </p>
            </>
          )}
        </div>
      )}

      <input
        ref={inputRef}
        type="file"
        accept={accept}
        onChange={handleUpload}
        className="hidden"
        disabled={uploading}
      />

      {currentUrl && (
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => inputRef.current?.click()}
          disabled={uploading}
        >
          {uploading ? progress || "Uploading..." : "Replace file"}
        </Button>
      )}

      {error && <p className="text-sm text-red-600">{error}</p>}
    </div>
  );
}
