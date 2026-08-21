import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { EDITOR_COOKIE_NAME, isValidSessionCookie } from "@/lib/auth";
import { loadWeeks, saveWeeks } from "@/lib/blob";
import { Week } from "@/lib/courseData";

const EDITABLE_FIELDS = [
  "summary",
  "summaryImage",
  "books",
  "bookImage",
  "homework",
  "homeworkImage",
  "bonusText",
  "bonusImage",
  "published"
] as const;

async function isEditor() {
  const cookieStore = await cookies();
  return isValidSessionCookie(cookieStore.get(EDITOR_COOKIE_NAME)?.value);
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ number: string }> }
) {
  if (!(await isEditor())) {
    return NextResponse.json({ error: "Not authorized" }, { status: 401 });
  }

  const { number } = await params;
  const weekNumber = Number(number);
  const body = await request.json();

  const updates: Record<string, unknown> = {};
  for (const key of EDITABLE_FIELDS) {
    if (key in body) updates[key] = body[key];
  }

  try {
    const weeks = await loadWeeks();
    const index = weeks.findIndex((week) => week.number === weekNumber);

    if (index === -1) {
      return NextResponse.json({ error: "Week not found" }, { status: 404 });
    }

    const updated: Record<string, unknown> = { ...weeks[index], ...updates };
    for (const key of Object.keys(updates)) {
      if (updates[key] === null) delete updated[key];
    }

    weeks[index] = updated as Week;
    await saveWeeks(weeks);

    return NextResponse.json({ ok: true, week: weeks[index] });
  } catch (error) {
    console.error("Saving week failed:", error);
    const message = error instanceof Error ? error.message : "Could not save changes.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
