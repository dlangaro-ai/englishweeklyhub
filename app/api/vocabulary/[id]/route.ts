import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { EDITOR_COOKIE_NAME, isValidSessionCookie } from "@/lib/auth";
import { loadVocabulary, saveVocabulary } from "@/lib/vocabulary";

// Deletes a PDF from the Vocabulary page.
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
    const items = await loadVocabulary();
    await saveVocabulary(items.filter((item) => item.id !== id));
    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("Deleting vocabulary item failed:", error);
    const message = error instanceof Error ? error.message : "Could not delete.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

// Renames a vocabulary PDF, or swaps in a new file.
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
    const items = await loadVocabulary();
    const index = items.findIndex((item) => item.id === id);
    if (index === -1) return NextResponse.json({ error: "PDF not found." }, { status: 404 });

    const item = { ...items[index] };

    if (typeof body.title === "string") {
      const title = body.title.trim().slice(0, 120);
      if (!title) return NextResponse.json({ error: "Please add a title." }, { status: 400 });
      item.title = title;
    }

    if (typeof body.href === "string") {
      if (!/^https:\/\//i.test(body.href)) {
        return NextResponse.json({ error: "That file link doesn't look right." }, { status: 400 });
      }
      item.href = body.href;
    }

    items[index] = item;
    await saveVocabulary(items);
    return NextResponse.json({ ok: true, item });
  } catch (error) {
    console.error("Editing vocabulary item failed:", error);
    const message = error instanceof Error ? error.message : "Could not save.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
