"use client";

import { useState, useRef } from "react";
import { Upload, X, Loader2 } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils";

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
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  async function handleUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    setError(null);

    try {
      const supabase = createClient();
      const ext = file.name.split(".").pop();
      const fileName = `${folder ? folder + "/" : ""}${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;

      const { error: uploadError } = await supabase.storage
        .from(bucket)
        .upload(fileName, file, { upsert: true });

      if (uploadError) throw uploadError;

      const {
        data: { publicUrl },
      } = supabase.storage.from(bucket).getPublicUrl(fileName);

      await supabase.from("media").insert({
        file_name: file.name,
        file_url: publicUrl,
        file_type: file.type.startsWith("video") ? "video" : "image",
        file_size: file.size,
        folder: folder || bucket,
      });

      onUpload(publicUrl);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Upload failed");
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
        <div className="relative rounded-lg border border-border overflow-hidden">
          {isVideo ? (
            <video src={currentUrl} controls className="w-full max-h-48 object-cover" />
          ) : (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={currentUrl} alt="Upload preview" className="w-full max-h-48 object-cover" />
          )}
          {onRemove && (
            <button
              type="button"
              onClick={onRemove}
              className="absolute right-2 top-2 rounded-full bg-red-600 p-1 text-white"
            >
              <X size={14} />
            </button>
          )}
        </div>
      ) : (
        <div
          onClick={() => inputRef.current?.click()}
          className="flex cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed border-border p-8 transition-colors hover:border-primary"
        >
          {uploading ? (
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          ) : (
            <>
              <Upload className="h-8 w-8 text-muted" />
              <p className="mt-2 text-sm text-muted">Click to upload image or video</p>
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
      />

      {currentUrl && (
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => inputRef.current?.click()}
          disabled={uploading}
        >
          {uploading ? "Uploading..." : "Replace file"}
        </Button>
      )}

      {error && <p className="text-sm text-red-600">{error}</p>}
    </div>
  );
}
