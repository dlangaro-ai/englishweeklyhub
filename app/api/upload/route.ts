import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { EDITOR_COOKIE_NAME, isValidSessionCookie } from "@/lib/auth";
import { uploadImage } from "@/lib/blob";

export async function POST(request: NextRequest) {
  const cookieStore = await cookies();
  if (!isValidSessionCookie(cookieStore.get(EDITOR_COOKIE_NAME)?.value)) {
    return NextResponse.json({ error: "Not authorized" }, { status: 401 });
  }

  const formData = await request.formData();
  const file = formData.get("file");

  if (!(file instanceof File)) {
    return NextResponse.json({ error: "No file provided" }, { status: 400 });
  }

  const isImage = file.type.startsWith("image/");
  const isPdf = file.type === "application/pdf";

  if (!isImage && !isPdf) {
    return NextResponse.json({ error: "Only image or PDF files are allowed" }, { status: 400 });
  }

  try {
    const url = await uploadImage(file);
    return NextResponse.json({ url });
  } catch (error) {
    console.error("File upload failed:", error);
    const message = error instanceof Error ? error.message : "Could not upload file.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
