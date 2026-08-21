import { createHmac, timingSafeEqual } from "crypto";

export const EDITOR_COOKIE_NAME = "editor_session";

const SESSION_VALUE = "editor";

function secret() {
  return process.env.EDIT_PASSWORD ?? "";
}

function sign(value: string) {
  return createHmac("sha256", secret()).update(value).digest("hex");
}

export function createSessionCookie(): string {
  return `${SESSION_VALUE}.${sign(SESSION_VALUE)}`;
}

export function isValidSessionCookie(cookieValue: string | undefined): boolean {
  if (!cookieValue || !secret()) return false;

  const [value, signature] = cookieValue.split(".");
  if (!value || !signature) return false;

  const expected = sign(value);
  const provided = Buffer.from(signature, "hex");
  const expectedBuffer = Buffer.from(expected, "hex");
  if (provided.length !== expectedBuffer.length) return false;

  return timingSafeEqual(provided, expectedBuffer);
}
