/** Client-side media optimization before Supabase upload. */

const IMAGE_MAX_EDGE = 1920;
const IMAGE_QUALITY = 0.82;
const VIDEO_MAX_WIDTH = 1280;
const VIDEO_BITRATE = 1_500_000; // ~1.5 Mbps

export type OptimizeProgress = {
  stage: "image" | "video" | "done";
  percent: number;
  message: string;
};

function loadImage(file: File): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const url = URL.createObjectURL(file);
    const img = new Image();
    img.onload = () => {
      URL.revokeObjectURL(url);
      resolve(img);
    };
    img.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error("Failed to load image"));
    };
    img.src = url;
  });
}

export async function convertImageToWebP(
  file: File,
  onProgress?: (p: OptimizeProgress) => void
): Promise<File> {
  if (file.type === "image/webp" && file.size < 400_000) {
    return file;
  }

  onProgress?.({ stage: "image", percent: 10, message: "Optimizing image…" });

  const img = await loadImage(file);
  const scale = Math.min(1, IMAGE_MAX_EDGE / Math.max(img.width, img.height));
  const width = Math.max(1, Math.round(img.width * scale));
  const height = Math.max(1, Math.round(img.height * scale));

  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext("2d");
  if (!ctx) return file;

  ctx.drawImage(img, 0, 0, width, height);
  onProgress?.({ stage: "image", percent: 70, message: "Encoding WebP…" });

  const blob = await new Promise<Blob | null>((resolve) =>
    canvas.toBlob(resolve, "image/webp", IMAGE_QUALITY)
  );

  if (!blob || blob.size === 0) return file;

  // Keep original if WebP somehow larger (rare for photos)
  if (blob.size >= file.size * 0.95 && file.type === "image/webp") {
    return file;
  }

  onProgress?.({ stage: "done", percent: 100, message: "Image ready" });
  const base = file.name.replace(/\.[^.]+$/, "") || "image";
  return new File([blob], `${base}.webp`, { type: "image/webp" });
}

function canRecordWebM() {
  if (typeof MediaRecorder === "undefined") return false;
  return (
    MediaRecorder.isTypeSupported("video/webm;codecs=vp9") ||
    MediaRecorder.isTypeSupported("video/webm;codecs=vp8") ||
    MediaRecorder.isTypeSupported("video/webm")
  );
}

function pickWebMMime() {
  if (MediaRecorder.isTypeSupported("video/webm;codecs=vp9")) {
    return "video/webm;codecs=vp9";
  }
  if (MediaRecorder.isTypeSupported("video/webm;codecs=vp8")) {
    return "video/webm;codecs=vp8";
  }
  return "video/webm";
}

export async function convertVideoToWebM(
  file: File,
  onProgress?: (p: OptimizeProgress) => void
): Promise<File> {
  // Already efficient enough
  if (file.type === "video/webm" && file.size < 8_000_000) {
    return file;
  }

  if (!canRecordWebM()) {
    onProgress?.({
      stage: "video",
      percent: 100,
      message: "Browser cannot convert video — uploading original",
    });
    return file;
  }

  onProgress?.({ stage: "video", percent: 5, message: "Preparing video…" });

  const objectUrl = URL.createObjectURL(file);
  const video = document.createElement("video");
  video.muted = true;
  video.playsInline = true;
  video.preload = "auto";
  video.src = objectUrl;

  try {
    await new Promise<void>((resolve, reject) => {
      video.onloadedmetadata = () => resolve();
      video.onerror = () => reject(new Error("Failed to load video"));
    });

    const scale = Math.min(1, VIDEO_MAX_WIDTH / (video.videoWidth || VIDEO_MAX_WIDTH));
    const width = Math.max(2, Math.round((video.videoWidth || 640) * scale) & ~1);
    const height = Math.max(2, Math.round((video.videoHeight || 360) * scale) & ~1);

    const canvas = document.createElement("canvas");
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext("2d");
    if (!ctx) return file;

    const canvasStream = canvas.captureStream(30);
    const mimeType = pickWebMMime();
    const recorder = new MediaRecorder(canvasStream, {
      mimeType,
      videoBitsPerSecond: VIDEO_BITRATE,
    });

    const chunks: Blob[] = [];
    recorder.ondataavailable = (e) => {
      if (e.data.size > 0) chunks.push(e.data);
    };

    const done = new Promise<File>((resolve, reject) => {
      recorder.onstop = () => {
        const blob = new Blob(chunks, { type: "video/webm" });
        if (!blob.size) {
          reject(new Error("Empty converted video"));
          return;
        }
        // Prefer original if conversion did not shrink meaningfully
        if (blob.size >= file.size * 0.98) {
          resolve(file);
          return;
        }
        const base = file.name.replace(/\.[^.]+$/, "") || "video";
        resolve(new File([blob], `${base}.webm`, { type: "video/webm" }));
      };
      recorder.onerror = () => reject(new Error("Video conversion failed"));
    });

    recorder.start(250);
    await video.play();

    const duration = video.duration || 1;
    let raf = 0;

    await new Promise<void>((resolve) => {
      const draw = () => {
        if (video.ended || video.paused) {
          resolve();
          return;
        }
        ctx.drawImage(video, 0, 0, width, height);
        const percent = Math.min(95, Math.round((video.currentTime / duration) * 90) + 5);
        onProgress?.({
          stage: "video",
          percent,
          message: `Converting to WebM… ${percent}%`,
        });
        raf = requestAnimationFrame(draw);
      };
      video.onended = () => resolve();
      raf = requestAnimationFrame(draw);
    });

    cancelAnimationFrame(raf);
    if (recorder.state !== "inactive") recorder.stop();
    canvasStream.getTracks().forEach((t) => t.stop());

    const result = await done;
    onProgress?.({ stage: "done", percent: 100, message: "Video ready" });
    return result;
  } catch {
    onProgress?.({
      stage: "video",
      percent: 100,
      message: "Conversion skipped — uploading original",
    });
    return file;
  } finally {
    URL.revokeObjectURL(objectUrl);
    video.removeAttribute("src");
    video.load();
  }
}

export async function optimizeUploadFile(
  file: File,
  onProgress?: (p: OptimizeProgress) => void
): Promise<File> {
  if (file.type.startsWith("image/")) {
    return convertImageToWebP(file, onProgress);
  }
  if (file.type.startsWith("video/")) {
    return convertVideoToWebM(file, onProgress);
  }
  return file;
}
