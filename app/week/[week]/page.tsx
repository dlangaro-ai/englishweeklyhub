import { notFound } from "next/navigation";
import { cookies } from "next/headers";
import WeekView from "@/components/WeekView";
import { getWeekByNumber } from "@/lib/getWeeks";
import { EDITOR_COOKIE_NAME, isValidSessionCookie } from "@/lib/auth";

export const dynamic = "force-dynamic";

export default async function WeekPage({
  params
}: {
  params: Promise<{ week: string }>
}) {
  const { week: weekParam } = await params;
  const weekNumber = Number(weekParam);
  const week = await getWeekByNumber(weekNumber);

  const cookieStore = await cookies();
  const isEditor = isValidSessionCookie(cookieStore.get(EDITOR_COOKIE_NAME)?.value);

  if (!week || (!week.published && !isEditor)) notFound();

  return <WeekView week={week} isEditor={isEditor} />;
}
