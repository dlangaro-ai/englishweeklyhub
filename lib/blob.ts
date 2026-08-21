import { list, put } from "@vercel/blob";
import { weeks as defaultWeeks, Week } from "./courseData";

const DATA_PATH = "course-data.json";

function blobConfigured() {
  return Boolean(process.env.BLOB_READ_WRITE_TOKEN);
}

export async function loadWeeks(): Promise<Week[]> {
  if (!blobConfigured()) return defaultWeeks;

  try {
    const { blobs } = await list({ prefix: DATA_PATH, limit: 1 });
    const match = blobs.find((blob) => blob.pathname === DATA_PATH);
    if (!match) return defaultWeeks;

    const response = await fetch(match.url, { cache: "no-store" });
    if (!response.ok) return defaultWeeks;

    return (await response.json()) as Week[];
  } catch {
    return defaultWeeks;
  }
}

export async function saveWeeks(weeks: Week[]): Promise<void> {
  if (!blobConfigured()) {
    throw new Error("Blob storage is not configured (missing BLOB_READ_WRITE_TOKEN).");
  }

  await put(DATA_PATH, JSON.stringify(weeks), {
    access: "public",
    addRandomSuffix: false,
    allowOverwrite: true,
    contentType: "application/json"
  });
}

export async function uploadImage(file: File): Promise<string> {
  if (!blobConfigured()) {
    throw new Error("Blob storage is not configured (missing BLOB_READ_WRITE_TOKEN).");
  }

  const safeName = file.name.replace(/[^a-zA-Z0-9.\-_]/g, "-");
  const pathname = `images/${Date.now()}-${safeName}`;
  const result = await put(pathname, file, { access: "public" });
  return result.url;
}
