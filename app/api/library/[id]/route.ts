import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { EDITOR_COOKIE_NAME, isValidSessionCookie } from "@/lib/auth";
import { loadWeeks, saveWeeks } from "@/lib/blob";
import { loadLibrary, saveLibrary, weekResourceIds } from "@/lib/library";
import { clampImageWidth } from "@/lib/imageSize";
import { normalizeUrl } from "@/lib/normalizeUrl";

// Deletes an item from the shared library and takes it off every week.
export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const cookieStore = await cookies();
  if (!isValidSessionCookie(cookieStore.get(EDITOR_COOKIE_NAME)?.value)) {
    return NextResponse.json({ error: "Not authorized" }, { status: 401 });
  }

  const { id } = await params;

  try {
    const items = await loadLibrary();
    await saveLibrary(items.filter((item) => item.id !== id));

    const weeks = await loadWeeks();
    let changed = false;
    const updated = weeks.map((week) => {
      const ids = weekResourceIds(week);
      if (!ids.includes(id)) return week;
      changed = true;
      return { ...week, resourceIds: ids.filter((existing) => existing !== id) };
    });
    if (changed) await saveWeeks(updated);

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("Deleting library item failed:", error);
    const message = error instanceof Error ? error.message : "Could not delete.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

// Edits one library item. Every week showing it picks the change up, since
// weeks only keep the item's ID.
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const cookieStore = await cookies();
  if (!isValidSessionCookie(cookieStore.get(EDITOR_COOKIE_NAME)?.value)) {
    return NextResponse.json({ error: "Not authorized" }, { status: 401 });
  }

  const { id } = await params;
  const body = await request.json().catch(() => ({}));

  try {
    const items = await loadLibrary();
    const index = items.findIndex((item) => item.id === id);
    if (index === -1) return NextResponse.json({ error: "Resource not found." }, { status: 404 });

    const item = { ...items[index] };
    const type = item.resourceType ?? "link";

    if (typeof body.title === "string") {
      const title = body.title.trim().slice(0, 120);
      if (!title) return NextResponse.json({ error: "Please add a title." }, { status: 400 });
      item.title = title;
    }

    if (typeof body.href === "string") {
      const href = normalizeUrl(body.href);
      if (!/^https?:\/\//i.test(href)) {
        return NextResponse.json({ error: "That link doesn't look right." }, { status: 400 });
      }
      item.href = href;
      // An image resource *is* its picture, so the two stay in step.
      if (type === "image") item.image = href;
    }

    if (type !== "image") {
      if (typeof body.image === "string" && /^https:\/\//i.test(body.image)) {
        item.image = body.image;
      } else if (body.image === null) {
        delete item.image;
        delete item.imageWidth;
      }
    }

    if (item.image && "imageWidth" in body) {
      const width = body.imageWidth === null ? undefined : clampImageWidth(body.imageWidth);
      if (width === undefined) delete item.imageWidth;
      else item.imageWidth = width;
    }

    items[index] = item;
    await saveLibrary(items);
    return NextResponse.json({ ok: true, item });
  } catch (error) {
    console.error("Editing library item failed:", error);
    const message = error instanceof Error ? error.message : "Could not save.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
