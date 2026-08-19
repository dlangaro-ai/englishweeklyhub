import { notFound } from "next/navigation";
import WeekView from "@/components/WeekView";
import { getWeek } from "@/lib/courseData";

export default async function WeekPage({
  params
}: {
  params: Promise<{ week: string }>
}) {
  const { week: weekParam } = await params;
  const weekNumber = Number(weekParam);
  const week = getWeek(weekNumber);

  if (!week || !week.published) notFound();

  return <WeekView week={week} />;
}
