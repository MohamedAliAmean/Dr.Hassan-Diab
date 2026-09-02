"use client";

import { useRef } from "react";
import { cn } from "@/lib/utils";

export type ImageFocus = { x: number; y: number };

type ImageFocusPickerProps = {
  src: string;
  focusX?: number | null;
  focusY?: number | null;
  onChange: (focus: ImageFocus) => void;
  className?: string;
  label?: string;
};

function clamp(value: number) {
  return Math.min(100, Math.max(0, Math.round(value)));
}

export function ImageFocusPicker({
  src,
  focusX = 50,
  focusY = 50,
  onChange,
  className,
  label = "Image framing (click the important part)",
}: ImageFocusPickerProps) {
  const x = focusX ?? 50;
  const y = focusY ?? 50;
  const frameRef = useRef<HTMLDivElement>(null);

  function setFromPointer(clientX: number, clientY: number) {
    const el = frameRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const nextX = clamp(((clientX - rect.left) / rect.width) * 100);
    const nextY = clamp(((clientY - rect.top) / rect.height) * 100);
    onChange({ x: nextX, y: nextY });
  }

  return (
    <div className={cn("space-y-2", className)}>
      <div className="flex items-center justify-between gap-2">
        <label className="text-sm font-medium">{label}</label>
        <span className="font-mono text-xs text-muted">
          {x}% / {y}%
        </span>
      </div>
      <p className="text-xs text-muted">
        Click the part that should stay visible (face, product, logo). Preview below
        matches the website crop.
      </p>

      <div
        ref={frameRef}
        role="button"
        tabIndex={0}
        aria-label="Set image focal point"
        className="relative aspect-video cursor-crosshair overflow-hidden rounded-lg border border-border bg-black/5"
        onClick={(e) => setFromPointer(e.clientX, e.clientY)}
        onKeyDown={(e) => {
          const step = e.shiftKey ? 5 : 2;
          if (e.key === "ArrowLeft") {
            e.preventDefault();
            onChange({ x: clamp(x - step), y });
          }
          if (e.key === "ArrowRight") {
            e.preventDefault();
            onChange({ x: clamp(x + step), y });
          }
          if (e.key === "ArrowUp") {
            e.preventDefault();
            onChange({ x, y: clamp(y - step) });
          }
          if (e.key === "ArrowDown") {
            e.preventDefault();
            onChange({ x, y: clamp(y + step) });
          }
        }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={src}
          alt=""
          draggable={false}
          className="pointer-events-none h-full w-full select-none object-cover"
          style={{ objectPosition: `${x}% ${y}%` }}
        />
        <span
          className="pointer-events-none absolute h-5 w-5 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-white shadow-[0_0_0_2px_rgba(0,0,0,0.45)]"
          style={{ left: `${x}%`, top: `${y}%` }}
        />
        <span
          className="pointer-events-none absolute h-px w-full bg-white/50"
          style={{ top: `${y}%` }}
        />
        <span
          className="pointer-events-none absolute h-full w-px bg-white/50"
          style={{ left: `${x}%` }}
        />
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        <label className="text-xs text-muted">
          Horizontal
          <input
            type="range"
            min={0}
            max={100}
            value={x}
            onChange={(e) => onChange({ x: Number(e.target.value), y })}
            className="mt-1 w-full"
          />
        </label>
        <label className="text-xs text-muted">
          Vertical
          <input
            type="range"
            min={0}
            max={100}
            value={y}
            onChange={(e) => onChange({ x, y: Number(e.target.value) })}
            className="mt-1 w-full"
          />
        </label>
      </div>
    </div>
  );
}
