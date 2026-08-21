import { NextRequest, NextResponse } from "next/server";
import { loadCompletions, saveCompletions } from "@/lib/completions";

export async function POST(request: NextRequest) {
  const body = await request.json().catch(() => ({}));

  const weekNumber = Number(body.weekNumber);
  const activityId = typeof body.activityId === "string" ? body.activityId.slice(0, 200) : "";
  const activityTitle = typeof body.activityTitle === "string" ? body.activityTitle.slice(0, 200) : "";
  const studentName = typeof body.studentName === "string" ? body.studentName.trim().slice(0, 60) : "";
  const completed = Boolean(body.completed);

  if (!Number.isFinite(weekNumber) || !activityId || !studentName) {
    return NextResponse.json({ error: "Missing data" }, { status: 400 });
  }

  try {
    const completions = await loadCompletions();
    const remaining = completions.filter(
      (entry) =>
        !(
          entry.weekNumber === weekNumber &&
          entry.activityId === activityId &&
          entry.studentName === studentName
        )
    );

    if (completed) {
      remaining.push({
        weekNumber,
        activityId,
        activityTitle,
        studentName,
        completedAt: new Date().toISOString()
      });
    }

    await saveCompletions(remaining);
    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("Saving completion failed:", error);
    return NextResponse.json({ error: "Could not save." }, { status: 500 });
  }
}
