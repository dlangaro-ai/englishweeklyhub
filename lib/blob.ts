import { del, list, put } from "@vercel/blob";
import { unstable_cache, revalidateTag } from "next/cache";
import { weeks as defaultWeeks, Week } from "./courseData";

const DATA_PREFIX = "course-data";
const CACHE_TAG = "course-data";

function blobConfigured() {
  // Either a static read-write token, or a Blob store connected via OIDC
  // (which adds BLOB_STORE_ID; the OIDC token itself is injected by Vercel
  // at runtime and isn't something you set by hand).
  return Boolean(process.env.BLOB_READ_WRITE_TOKEN || process.env.BLOB_STORE_ID);
}

function latestBlob<T extends { pathname: string }>(blobs: T[]): T | undefined {
  return blobs.slice().sort((a, b) => b.pathname.localeCompare(a.pathname))[0];
}

// If courseData.ts's default week count ever grows (e.g. 40 -> 41 weeks),
// this fills in any week numbers missing from what's already saved — without
// touching or overwriting any week that's already been edited and stored.
function mergeWithDefaults(stored: Week[]): Week[] {
  const storedNumbers = new Set(stored.map((week) => week.number));
  const missing = defaultWeeks.filter((week) => !storedNumbers.has(week.number));
  if (missing.length === 0) return stored;
  return [...stored, ...missing].sort((a, b) => a.number - b.number);
}

async function fetchWeeks(): Promise<Week[]> {
  if (!blobConfigured()) return defaultWeeks;

  try {
    const { blobs } = await list({ prefix: DATA_PREFIX, limit: 1000 });
    const match = latestBlob(blobs);
    if (!match) return defaultWeeks;

    const response = await fetch(match.url, { cache: "no-store" });
    if (!response.ok) return defaultWeeks;

    const stored = (await response.json()) as Week[];
    return mergeWithDefaults(stored);
  } catch {
    return defaultWeeks;
  }
}

// Cached between edits so students loading the site don't hit Blob storage
// on every page view — only re-reads after saveWeeks() invalidates it below.
export const loadWeeks = unstable_cache(fetchWeeks, ["course-data"], { tags: [CACHE_TAG] });

export async function saveWeeks(weeks: Week[]): Promise<void> {
  if (!blobConfigured()) {
    throw new Error("Blob storage is not connected to this project yet.");
  }

  // Vercel's public Blob storage caches content at the CDN level, per URL,
  // for up to a month — overwriting the same pathname can keep serving the
  // old version regardless of application-level cache invalidation. Writing
  // to a fresh, never-before-seen pathname every time sidesteps that entirely.
  const { blobs: previous } = await list({ prefix: DATA_PREFIX, limit: 1000 }).catch(() => ({
    blobs: [] as { url: string }[]
  }));

  await put(`${DATA_PREFIX}-${Date.now()}.json`, JSON.stringify(weeks), {
    access: "public",
    addRandomSuffix: false,
    contentType: "application/json"
  });

  revalidateTag(CACHE_TAG, { expire: 0 });

  if (previous.length > 0) {
    await del(previous.map((blob) => blob.url)).catch(() => {
      // Best-effort cleanup — a leftover old copy doesn't hurt correctness
      // since reads always pick the most recent pathname.
    });
  }
}

export async function uploadImage(file: File): Promise<string> {
  if (!blobConfigured()) {
    throw new Error("Blob storage is not connected to this project yet.");
  }

  const safeName = file.name.replace(/[^a-zA-Z0-9.\-_]/g, "-");
  const pathname = `images/${Date.now()}-${safeName}`;
  const result = await put(pathname, file, { access: "public" });
  return result.url;
}
