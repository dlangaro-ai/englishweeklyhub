import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { EDITOR_COOKIE_NAME, isValidSessionCookie } from "@/lib/auth";
import { loadCompletions } from "@/lib/completions";

function csvCell(value: string): string {
  if (/[",\n]/.test(value)) {
    return `"${value.replace(/"/g, '""')}"`;
  }
  return value;
}

export async function GET() {
  const cookieStore = await cookies();
  const isEditor = isValidSessionCookie(cookieStore.get(EDITOR_COOKIE_NAME)?.value);
  if (!isEditor) {
    return NextResponse.json({ error: "Not authorized" }, { status: 401 });
  }

  const completions = await loadCompletions();

  const header = ["Student name", "Class", "Teacher email", "Week", "Activity", "Completed at"];
  const rows = completions
    .slice()
    .sort(
      (a, b) =>
        (a.studentClass ?? "").localeCompare(b.studentClass ?? "") ||
        a.studentName.localeCompare(b.studentName) ||
        a.weekNumber - b.weekNumber
    )
    .map((entry) => [
      entry.studentName,
      entry.studentClass ?? "",
      entry.teacherEmail ?? "",
      String(entry.weekNumber),
      entry.activityTitle,
      new Date(entry.completedAt).toLocaleString()
    ]);

  const csv = [header, ...rows].map((row) => row.map(csvCell).join(",")).join("\r\n");
  // Byte-order mark so Excel opens UTF-8 correctly (accented names, etc.)
  // instead of guessing the wrong encoding.
  const withBom = "﻿" + csv;

  return new NextResponse(withBom, {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="completions-${new Date().toISOString().slice(0, 10)}.csv"`
    }
  });
}
