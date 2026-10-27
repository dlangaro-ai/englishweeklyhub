import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { EDITOR_COOKIE_NAME, isValidSessionCookie } from "@/lib/auth";
import { getAllWeeks } from "@/lib/getWeeks";
import { searchWeeks } from "@/lib/search";

// Powers the search icon in the top bar. Anyone can search the published weeks.
export async function GET(request: NextRequest) {
  const query = (request.nextUrl.searchParams.get("q") ?? "").trim().slice(0, 80);
  if (query.length < 2) return NextResponse.json({ hits: [] });

  const cookieStore = await cookies();
  const isEditor = isValidSessionCookie(cookieStore.get(EDITOR_COOKIE_NAME)?.value);
  const weeks = await getAllWeeks();

  return NextResponse.json({ hits: searchWeeks(weeks, query, isEditor) });
}
