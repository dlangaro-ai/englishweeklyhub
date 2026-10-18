import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { EDITOR_COOKIE_NAME, isValidSessionCookie } from "@/lib/auth";
import { loadVocabulary, saveVocabulary, VocabularyItem } from "@/lib/vocabulary";

// Adds one PDF to the Vocabulary page.
export async function POST(request: NextRequest) {
  const cookieStore = await cookies();
  if (!isValidSessionCookie(cookieStore.get(EDITOR_COOKIE_NAME)?.value)) {
    return NextResponse.json({ error: "Not authorized" }, { status: 401 });
  }

  const body = await request.json().catch(() => ({}));
  const title = typeof body.title === "string" ? body.title.trim().slice(0, 120) : "";
  const href = typeof body.href === "string" ? body.href.trim() : "";

  if (!title) return NextResponse.json({ error: "Please add a title." }, { status: 400 });
  if (!/^https:\/\//i.test(href)) {
    return NextResponse.json({ error: "Please choose a PDF." }, { status: 400 });
  }

  const item: VocabularyItem = { id: `vocabulary-${Date.now()}`, title, href };

  try {
    const items = await loadVocabulary();
    await saveVocabulary([...items, item]);
    return NextResponse.json({ ok: true, item });
  } catch (error) {
    console.error("Saving vocabulary failed:", error);
    const message = error instanceof Error ? error.message : "Could not save.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
