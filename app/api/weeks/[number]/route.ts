import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { EDITOR_COOKIE_NAME, isValidSessionCookie } from "@/lib/auth";
import { loadWeeks, saveWeeks } from "@/lib/blob";
import { ExtraActivity, Week } from "@/lib/courseData";
import { sanitizeRichText } from "@/lib/sanitizeHtml";

const EDITABLE_FIELDS = [
  "title",
  "unit",
  "summary",
  "summaryImage",
  "books",
  "bookImage",
  "homework",
  "homeworkImage",
  "bonusText",
  "bonusImage",
  "published",
  "extraActivities"
] as const;

const MAX_BY_TYPE: Partial<Record<NonNullable<ExtraActivity["resourceType"]>, number>> = {
  image: 3,
  link: 3,
  pdf: 2
};

function validateExtraActivities(activities: unknown): string | null {
  if (!Array.isArray(activities)) return "extraActivities must be a list.";

  const counts: Record<string, number> = {};
  for (const activity of activities) {
    const type = (activity as ExtraActivity)?.resourceType;
    if (!type) continue;
    counts[type] = (counts[type] ?? 0) + 1;
  }

  for (const [type, max] of Object.entries(MAX_BY_TYPE)) {
    if ((counts[type] ?? 0) > max) {
      return `You can only have up to ${max} ${type} activities per week.`;
    }
  }

  return null;
}

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

  if ("extraActivities" in updates) {
    const validationError = validateExtraActivities(updates.extraActivities);
    if (validationError) {
      return NextResponse.json({ error: validationError }, { status: 400 });
    }
  }

  if (typeof updates.summary === "string") {
    updates.summary = sanitizeRichText(updates.summary);
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
