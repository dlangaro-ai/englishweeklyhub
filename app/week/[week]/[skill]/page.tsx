import { notFound } from "next/navigation";
import { cookies } from "next/headers";
import ExtraActivitiesView from "@/components/ExtraActivitiesView";
import WeekResourcesView from "@/components/WeekResourcesView";
import { getAllWeeks, getWeekByNumber } from "@/lib/getWeeks";
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

  if (!week || (skill !== "skills" && skill !== "resources")) notFound();

  if (skill === "resources") {
    // The teacher's edit controls need to know every week (to put a resource on one).
    const allWeeks = isEditor ? await getAllWeeks() : [];
    const weekOptions = allWeeks.map((item) => ({
      number: item.number,
      title: item.title,
      ids: item.resourceIds ?? []
    }));

    return <WeekResourcesView week={week} isEditor={isEditor} weekOptions={weekOptions} />;
  }

  return <ExtraActivitiesView week={week} isEditor={isEditor} />;
}
