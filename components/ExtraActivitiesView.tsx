"use client";

import Link from "next/link";
import { Week } from "@/lib/courseData";
import { useProgress } from "./ProgressProvider";

const iconFor = (type?: string) => {
  if (type === "video") return "▶️";
  if (type === "pdf") return "📄";
  if (type === "link") return "🔗";
  return "⭐";
};

export default function ExtraActivitiesView({ week }: { week: Week }) {
  const { isComplete, toggleActivity } = useProgress();

  return (
    <main className="shell narrow">
      <Link href={`/week/${week.number}`} className="backLink">← Week {week.number}</Link>

      <header className="skillHero">
        <div className="skillIcon large">🎁</div>
        <div>
          <p className="eyebrow">WEEK {week.number} · BONUS</p>
          <h1>Extra Activities</h1>
          <p className="heroText">
            Optional fun practice for this week — try one whenever you like!
          </p>
        </div>
      </header>

      <section className="activityList">
        {week.extraActivities.length === 0 ? (
          <div className="emptyState compact">
            <div className="emptyIcon">✨</div>
            <h2>Nothing here yet</h2>
            <p>Check back soon — extra activities will appear here.</p>
          </div>
        ) : (
          week.extraActivities.map((activity, index) => {
            const done = isComplete(activity.id);
            return (
              <article className={`activityCard ${done ? "activityDone" : ""}`} key={activity.id}>
                <div className="activityIndex">{done ? "✓" : iconFor(activity.resourceType)}</div>
                <div className="activityBody">
                  <span className="activityType">EXTRA ACTIVITY {index + 1}</span>
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
          })
        )}
      </section>
    </main>
  );
}
