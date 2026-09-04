import { notFound } from "next/navigation";
import { cookies } from "next/headers";
import SummaryView from "@/components/SummaryView";
import { getWeekByNumber } from "@/lib/getWeeks";
import { EDITOR_COOKIE_NAME, isValidSessionCookie } from "@/lib/auth";

export const dynamic = "force-dynamic";

export default async function ThisWeekPage({
  params
}: {
  params: Promise<{ week: string }>
}) {
  const { week: weekParam } = await params;
  const week = await getWeekByNumber(Number(weekParam));

  const cookieStore = await cookies();
  const isEditor = isValidSessionCookie(cookieStore.get(EDITOR_COOKIE_NAME)?.value);

  if (!week || (!week.published && !isEditor)) notFound();

  return <SummaryView week={week} />;
}
