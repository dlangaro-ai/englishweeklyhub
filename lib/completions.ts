import { del, list, put } from "@vercel/blob";
import { unstable_cache, revalidateTag } from "next/cache";

const DATA_PREFIX = "completions";
const CACHE_TAG = "completions";

export type Completion = {
  weekNumber: number;
  activityId: string;
  activityTitle: string;
  studentName: string;
  completedAt: string;
};

function blobConfigured() {
  return Boolean(process.env.BLOB_READ_WRITE_TOKEN || process.env.BLOB_STORE_ID);
}

function latestBlob<T extends { pathname: string }>(blobs: T[]): T | undefined {
  return blobs.slice().sort((a, b) => b.pathname.localeCompare(a.pathname))[0];
}

async function fetchCompletions(): Promise<Completion[]> {
  if (!blobConfigured()) return [];

  try {
    const { blobs } = await list({ prefix: DATA_PREFIX, limit: 1000 });
    const match = latestBlob(blobs);
    if (!match) return [];

    const response = await fetch(match.url, { cache: "no-store" });
    if (!response.ok) return [];

    return (await response.json()) as Completion[];
  } catch {
    return [];
  }
}

export const loadCompletions = unstable_cache(fetchCompletions, ["completions"], {
  tags: [CACHE_TAG]
});

export async function saveCompletions(completions: Completion[]): Promise<void> {
  if (!blobConfigured()) {
    throw new Error("Blob storage is not connected to this project yet.");
  }

  // Same CDN-caching pitfall as course data — always write a fresh pathname
  // rather than overwriting the same one, and read the newest.
  const { blobs: previous } = await list({ prefix: DATA_PREFIX, limit: 1000 }).catch(() => ({
    blobs: [] as { url: string }[]
  }));

  await put(`${DATA_PREFIX}-${Date.now()}.json`, JSON.stringify(completions), {
    access: "public",
    addRandomSuffix: false,
    contentType: "application/json"
  });

  revalidateTag(CACHE_TAG, { expire: 0 });

  if (previous.length > 0) {
    await del(previous.map((blob) => blob.url)).catch(() => {
      // Best-effort cleanup only.
    });
  }
}
