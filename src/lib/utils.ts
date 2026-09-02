import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function slugify(text: string): string {
  const normalized = text.normalize("NFKC").trim().toLowerCase();

  // Prefer ASCII-only slugs — Unicode paths (Arabic) break in some Next.js route matches
  const ascii = normalized
    .replace(/[^\x00-\x7F]/g, " ")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

  if (ascii) return ascii;

  // Arabic / non-Latin titles: stable short hash (URL-safe)
  let hash = 0;
  for (let i = 0; i < normalized.length; i++) {
    hash = (Math.imul(31, hash) + normalized.charCodeAt(i)) >>> 0;
  }
  return `post-${hash.toString(36)}`;
}

/** Safely decode a dynamic route param (handles Arabic / percent-encoding). */
export function decodeParam(value: string): string {
  try {
    return decodeURIComponent(value);
  } catch {
    return value;
  }
}

export function formatPrice(price: number, currency = "EGP"): string {
  return new Intl.NumberFormat("en-EG", {
    style: "currency",
    currency,
    maximumFractionDigits: 0,
  }).format(price);
}
