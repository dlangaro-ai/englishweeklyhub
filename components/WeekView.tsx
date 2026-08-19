"use client";

import Link from "next/link";
import { skillMeta, Week, SkillKey } from "@/lib/courseData";
import { useProgress } from "./ProgressProvider";

function skillPercent(week: Week, skill: SkillKey, isComplete: (id: string) => boolean) {
  const activities = week.skills[skill] ?? [];
  if (!activities.length) return 0;
  return Math.round((activities.filter((a) => isComplete(a.id)).length / activities.length) * 100);
}

export default function WeekView({ week }: { week: Week }) {
  const { isComplete } = useProgress();
  const activeSkills = (Object.keys(skillMeta) as SkillKey[]).filter(
    (skill) => (week.skills[skill]?.length ?? 0) > 0
  );

  const allActivities = activeSkills.flatMap((skill) => week.skills[skill] ?? []);
  const completed = allActivities.filter((activity) => isComplete(activity.id)).length;
  const overall = allActivities.length ? Math.round((completed / allActivities.length) * 100) : 0;

  return (
    <main className="shell">
      <Link href="/" className="backLink">← All weeks</Link>

      <header className="weekHero">
        <div>
          <p className="eyebrow">WEEK {week.number}</p>
          <h1>{week.title}</h1>
          <p className="heroText">{week.theme}</p>
        </div>
        <div className="progressCircle">
          <strong>{overall}%</strong>
          <span>complete</span>
        </div>
      </header>

      <div className="skillGrid">
        {(Object.keys(skillMeta) as SkillKey[]).map((skill) => {
          const meta = skillMeta[skill];
          const activities = week.skills[skill] ?? [];
          const available = activities.length > 0;
          const percent = skillPercent(week, skill, isComplete);

          if (!available) {
            return (
              <div className="skillCard skillCardMuted" key={skill}>
                <div className="skillIcon">{meta.icon}</div>
                <h2>{meta.label}</h2>
                <p>No activity this week</p>
              </div>
            );
          }

          return (
            <Link href={`/week/${week.number}/${skill}`} className="skillCard" key={skill}>
              <div className="skillIcon">{meta.icon}</div>
              <div className="skillTitleRow">
                <h2>{meta.label}</h2>
                <span>{percent}%</span>
              </div>
              <p>{meta.description}</p>
              <div className="progressTrack">
                <div className="progressFill" style={{ width: `${percent}%` }} />
              </div>
              <span className="openLabel">Open skill →</span>
            </Link>
          );
        })}
      </div>
    </main>
  );
}
