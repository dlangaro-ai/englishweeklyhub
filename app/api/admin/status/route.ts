import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { EDITOR_COOKIE_NAME, isValidSessionCookie } from "@/lib/auth";

// Used by the client-side student-identity gate to skip itself for the
// teacher, who has no business filling in a fake name/class/email just to
// browse their own site in edit mode.
export async function GET() {
  const cookieStore = await cookies();
  const isEditor = isValidSessionCookie(cookieStore.get(EDITOR_COOKIE_NAME)?.value);
  return NextResponse.json({ isEditor });
}
