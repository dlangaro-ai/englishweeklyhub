import { NextResponse } from "next/server";
import { EDITOR_COOKIE_NAME } from "@/lib/auth";

export async function POST() {
  const response = NextResponse.json({ ok: true });
  response.cookies.set(EDITOR_COOKIE_NAME, "", { maxAge: 0, path: "/" });
  return response;
}
