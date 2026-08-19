import { notFound } from "next/navigation";
import ExtraActivitiesView from "@/components/ExtraActivitiesView";
import { getWeek } from "@/lib/courseData";

export default async function SkillsPage({
  params
}: {
  params: Promise<{ week: string; skill: string }>
}) {
  const { week: weekParam, skill } = await params;
  const week = getWeek(Number(weekParam));

  if (!week || !week.published || skill !== "skills") notFound();

  return <ExtraActivitiesView week={week} />;
}
