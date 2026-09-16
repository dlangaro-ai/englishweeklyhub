import { notFound } from "next/navigation";
import { cookies } from "next/headers";
import ExtraActivitiesView from "@/components/ExtraActivitiesView";
import { getWeekByNumber } from "@/lib/getWeeks";
import { EDITOR_COOKIE_NAME, isValidSessionCookie } from "@/lib/auth";

export const dynamic = "force-dynamic";

export default async function SkillsPage({
  params
}: {
  params: Promise<{ week: string; skill: string }>
}) {
  const { week: weekParam, skill } = await params;
  const week = await getWeekByNumber(Number(weekParam));

  const cookieStore = await cookies();
  const isEditor = isValidSessionCookie(cookieStore.get(EDITOR_COOKIE_NAME)?.value);

  if (!week || skill !== "skills") notFound();

  return <ExtraActivitiesView week={week} isEditor={isEditor} />;
}
