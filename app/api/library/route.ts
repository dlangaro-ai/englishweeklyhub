import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { EDITOR_COOKIE_NAME, isValidSessionCookie } from "@/lib/auth";
import { LibraryLink } from "@/lib/courseData";
import { loadLibrary, saveLibrary } from "@/lib/library";
import { clampImageWidth } from "@/lib/imageSize";
import { normalizeUrl } from "@/lib/normalizeUrl";

const TYPES = ["link", "image", "pdf"] as const;

// Adds one item to the shared resource library.
export async function POST(request: NextRequest) {
  const cookieStore = await cookies();
  if (!isValidSessionCookie(cookieStore.get(EDITOR_COOKIE_NAME)?.value)) {
    return NextResponse.json({ error: "Not authorized" }, { status: 401 });
  }

  const body = await request.json().catch(() => ({}));
  const title = typeof body.title === "string" ? body.title.trim().slice(0, 120) : "";
  const resourceType = TYPES.includes(body.resourceType) ? (body.resourceType as (typeof TYPES)[number]) : "link";
  const rawHref = typeof body.href === "string" ? body.href.trim() : "";

  if (!title) return NextResponse.json({ error: "Please add a title." }, { status: 400 });
  if (!rawHref) return NextResponse.json({ error: "Please add a link or file." }, { status: 400 });

  const href = normalizeUrl(rawHref);
  if (!/^https?:\/\//i.test(href)) {
    return NextResponse.json({ error: "That link doesn't look right." }, { status: 400 });
  }

  const item: LibraryLink = { id: `library-${Date.now()}`, title, href, resourceType };

  if (typeof body.image === "string" && /^https:\/\//i.test(body.image)) {
    item.image = body.image;
    const width = clampImageWidth(body.imageWidth);
    if (width !== undefined) item.imageWidth = width;
  }

  try {
    const items = await loadLibrary();
    await saveLibrary([...items, item]);
    return NextResponse.json({ ok: true, item });
  } catch (error) {
    console.error("Saving library failed:", error);
    const message = error instanceof Error ? error.message : "Could not save.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
