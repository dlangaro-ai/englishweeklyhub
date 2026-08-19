"use client";

import Link from "next/link";
import { SkillKey, skillMeta, Week } from "@/lib/courseData";
import { useProgress } from "./ProgressProvider";

export default function SkillView({ week, skill }: { week: Week; skill: SkillKey }) {
  const meta = skillMeta[skill];
  const activities = week.skills[skill] ?? [];
  const { isComplete, toggleActivity } = useProgress();

  const completed = activities.filter((activity) => isComplete(activity.id)).length;
  const percent = activities.length ? Math.round((completed / activities.length) * 100) : 0;

  return (
    <main className="shell narrow">
      <Link href={`/week/${week.number}`} className="backLink">← Week {week.number}</Link>

      <header className="skillHero">
        <div className="skillIcon large">{meta.icon}</div>
        <div>
          <p className="eyebrow">WEEK {week.number}</p>
          <h1>{meta.label}</h1>
          <p className="heroText">{week.title} · {week.theme}</p>
        </div>
      </header>

      <div className="skillProgress">
        <span>{completed} of {activities.length} activities complete</span>
        <strong>{percent}%</strong>
        <div className="progressTrack full">
          <div className="progressFill" style={{ width: `${percent}%` }} />
        </div>
      </div>

      <section className="activityList">
        {activities.map((activity, index) => {
          const done = isComplete(activity.id);
          return (
            <article className={`activityCard ${done ? "activityDone" : ""}`} key={activity.id}>
              <div className="activityIndex">{done ? "✓" : index + 1}</div>
              <div className="activityBody">
                <span className="activityType">{activity.type}</span>
                <h2>{activity.title}</h2>
                {activity.description && <p>{activity.description}</p>}
                {activity.href && (
                  <a href={activity.href} target="_blank" rel="noreferrer" className="textLink">
                    Open resource ↗
                  </a>
                )}
              </div>
              <button className="completeButton" onClick={() => toggleActivity(activity.id)}>
                {done ? "Completed" : "Mark complete"}
              </button>
            </article>
          );
        })}
      </section>
    </main>
  );
}
