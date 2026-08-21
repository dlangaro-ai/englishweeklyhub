import { notFound } from "next/navigation";
import ExtraActivitiesView from "@/components/ExtraActivitiesView";
import { getWeekByNumber } from "@/lib/getWeeks";

export const dynamic = "force-dynamic";

export default async function SkillsPage({
  params
}: {
  params: Promise<{ week: string; skill: string }>
}) {
  const { week: weekParam, skill } = await params;
  const week = await getWeekByNumber(Number(weekParam));

  if (!week || !week.published || skill !== "skills") notFound();

  return <ExtraActivitiesView week={week} />;
}
