import { del, list, put } from "@vercel/blob";
import { unstable_cache, revalidateTag } from "next/cache";
import { LibraryLink, Week } from "./courseData";
import { loadWeeks } from "./blob";
import { normalizeUrl } from "./normalizeUrl";

// The resource library is independent of the weeks: one shared list that any
// week can pull from (week.resourceIds). Stored the same way as the weeks —
// a fresh timestamped blob per save to dodge the CDN cache.
const LIBRARY_PREFIX = "library-data";
const LIBRARY_TAG = "library-data";

function blobConfigured() {
  return Boolean(process.env.BLOB_READ_WRITE_TOKEN || process.env.BLOB_STORE_ID);
}

// Until the library has been saved for the first time, build it from the
// resources that used to live inside each week, keeping their IDs so every
// week keeps showing the same things. A week's main picture becomes the
// thumbnail of its first website, as it was on the old All Resources page.
function seedFromWeeks(weeks: Week[]): LibraryLink[] {
  const seen = new Set<string>();
  const items: LibraryLink[] = [];

  for (const week of weeks) {
    (week.libraryLinks ?? []).forEach((link, index) => {
      if (seen.has(link.id)) return;
      seen.add(link.id);

      const type = link.resourceType ?? "link";
      const image = link.image ?? (index === 0 && type !== "pdf" ? week.libraryImage : undefined);
      const item: LibraryLink = {
        ...link,
        href: type === "link" ? normalizeUrl(link.href) : link.href
      };
      if (image) item.image = image;
      items.push(item);
    });
  }

  return items;
}

async function fetchLibrary(): Promise<LibraryLink[]> {
  const weeks = await loadWeeks();
  if (!blobConfigured()) return seedFromWeeks(weeks);

  try {
    const { blobs } = await list({ prefix: LIBRARY_PREFIX, limit: 1000 });
    const latest = blobs.slice().sort((a, b) => b.pathname.localeCompare(a.pathname))[0];
    if (!latest) return seedFromWeeks(weeks);

    const response = await fetch(latest.url, { cache: "no-store" });
    if (!response.ok) return seedFromWeeks(weeks);
    return (await response.json()) as LibraryLink[];
  } catch {
    return seedFromWeeks(weeks);
  }
}

export const loadLibrary = unstable_cache(fetchLibrary, ["library-data"], { tags: [LIBRARY_TAG] });

export async function saveLibrary(items: LibraryLink[]): Promise<void> {
  if (!blobConfigured()) {
    throw new Error("Blob storage is not connected to this project yet.");
  }

  const { blobs: previous } = await list({ prefix: LIBRARY_PREFIX, limit: 1000 }).catch(() => ({
    blobs: [] as { url: string }[]
  }));

  await put(`${LIBRARY_PREFIX}-${Date.now()}.json`, JSON.stringify(items), {
    access: "public",
    addRandomSuffix: false,
    contentType: "application/json"
  });

  revalidateTag(LIBRARY_TAG, { expire: 0 });

  if (previous.length > 0) {
    await del(previous.map((blob) => blob.url)).catch(() => {
      // Best-effort cleanup; reads always pick the most recent pathname.
    });
  }
}

// The IDs a week shows: its own list once it has one, otherwise the IDs of
// the resources it had before the library existed.
export function weekResourceIds(week: Week): string[] {
  return week.resourceIds ?? (week.libraryLinks ?? []).map((link) => link.id);
}
