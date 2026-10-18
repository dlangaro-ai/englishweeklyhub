import { del, list, put } from "@vercel/blob";
import { unstable_cache, revalidateTag } from "next/cache";

// Vocabulary PDFs live in their own list, separate from the weeks and the
// resource library. Stored the same way: a fresh timestamped blob per save
// to dodge the CDN cache.
export type VocabularyItem = {
  id: string;
  title: string;
  href: string;
};

const VOCABULARY_PREFIX = "vocabulary-data";
const VOCABULARY_TAG = "vocabulary-data";

function blobConfigured() {
  return Boolean(process.env.BLOB_READ_WRITE_TOKEN || process.env.BLOB_STORE_ID);
}

async function fetchVocabulary(): Promise<VocabularyItem[]> {
  if (!blobConfigured()) return [];

  try {
    const { blobs } = await list({ prefix: VOCABULARY_PREFIX, limit: 1000 });
    const latest = blobs.slice().sort((a, b) => b.pathname.localeCompare(a.pathname))[0];
    if (!latest) return [];

    const response = await fetch(latest.url, { cache: "no-store" });
    if (!response.ok) return [];
    return (await response.json()) as VocabularyItem[];
  } catch {
    return [];
  }
}

export const loadVocabulary = unstable_cache(fetchVocabulary, ["vocabulary-data"], {
  tags: [VOCABULARY_TAG]
});

export async function saveVocabulary(items: VocabularyItem[]): Promise<void> {
  if (!blobConfigured()) {
    throw new Error("Blob storage is not connected to this project yet.");
  }

  const { blobs: previous } = await list({ prefix: VOCABULARY_PREFIX, limit: 1000 }).catch(() => ({
    blobs: [] as { url: string }[]
  }));

  await put(`${VOCABULARY_PREFIX}-${Date.now()}.json`, JSON.stringify(items), {
    access: "public",
    addRandomSuffix: false,
    contentType: "application/json"
  });

  revalidateTag(VOCABULARY_TAG, { expire: 0 });

  if (previous.length > 0) {
    await del(previous.map((blob) => blob.url)).catch(() => {
      // Best-effort cleanup; reads always pick the most recent pathname.
    });
  }
}
