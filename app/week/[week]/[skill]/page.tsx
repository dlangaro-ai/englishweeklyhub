import { notFound } from "next/navigation";
import SkillView from "@/components/SkillView";
import { getWeek, skillMeta, SkillKey } from "@/lib/courseData";

export default async function SkillPage({
  params
}: {
  params: Promise<{ week: string; skill: string }>
}) {
  const { week: weekParam, skill: skillParam } = await params;
  const week = getWeek(Number(weekParam));

  if (!week || !week.published || !(skillParam in skillMeta)) notFound();

  const skill = skillParam as SkillKey;
  if (!(week.skills[skill]?.length)) notFound();

  return <SkillView week={week} skill={skill} />;
}
