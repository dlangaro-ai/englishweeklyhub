import { list, put } from "@vercel/blob";
import { unstable_cache, revalidateTag } from "next/cache";

const DATA_PATH = "completions.json";
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

async function fetchCompletions(): Promise<Completion[]> {
  if (!blobConfigured()) return [];

  try {
    const { blobs } = await list({ prefix: DATA_PATH, limit: 1 });
    const match = blobs.find((blob) => blob.pathname === DATA_PATH);
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

  await put(DATA_PATH, JSON.stringify(completions), {
    access: "public",
    addRandomSuffix: false,
    allowOverwrite: true,
    contentType: "application/json"
  });

  revalidateTag(CACHE_TAG, { expire: 0 });
}
