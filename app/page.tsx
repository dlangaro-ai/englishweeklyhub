import { cookies } from "next/headers";
import CourseDashboard from "@/components/CourseDashboard";
import { getAllWeeks } from "@/lib/getWeeks";
import { EDITOR_COOKIE_NAME, isValidSessionCookie } from "@/lib/auth";

export const dynamic = "force-dynamic";

export default async function Home() {
  const weeks = await getAllWeeks();
  const cookieStore = await cookies();
  const isEditor = isValidSessionCookie(cookieStore.get(EDITOR_COOKIE_NAME)?.value);

  return <CourseDashboard weeks={weeks} isEditor={isEditor} />;
}
