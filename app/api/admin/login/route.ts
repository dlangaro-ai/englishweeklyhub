import { NextRequest, NextResponse } from "next/server";
import { createSessionCookie, EDITOR_COOKIE_NAME } from "@/lib/auth";

export async function POST(request: NextRequest) {
  const correctPassword = process.env.EDIT_PASSWORD;

  if (!correctPassword) {
    return NextResponse.json(
      { error: "Edit mode isn't set up yet (missing EDIT_PASSWORD)." },
      { status: 500 }
    );
  }

  const { password } = await request.json();

  if (password !== correctPassword) {
    return NextResponse.json({ error: "Incorrect password" }, { status: 401 });
  }

  const response = NextResponse.json({ ok: true });
  response.cookies.set(EDITOR_COOKIE_NAME, createSessionCookie(), {
    httpOnly: true,
    secure: true,
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 30
  });
  return response;
}
