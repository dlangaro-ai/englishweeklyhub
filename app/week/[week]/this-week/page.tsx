import { notFound } from "next/navigation";
import SummaryView from "@/components/SummaryView";
import { getWeekByNumber } from "@/lib/getWeeks";

export const dynamic = "force-dynamic";

export default async function ThisWeekPage({
  params
}: {
  params: Promise<{ week: string }>
}) {
  const { week: weekParam } = await params;
  const week = await getWeekByNumber(Number(weekParam));

  if (!week) notFound();

  return <SummaryView week={week} />;
}
