import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { EDITOR_COOKIE_NAME, isValidSessionCookie } from "@/lib/auth";
import { loadWeeks, saveWeeks } from "@/lib/blob";
import { loadLibrary, saveLibrary, weekResourceIds } from "@/lib/library";

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
