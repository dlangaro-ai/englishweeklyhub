"use client";

import Link from "next/link";
import { useProgress } from "./ProgressProvider";
import { Week } from "@/lib/courseData";

function allActivityIds(week: Week) {
  return Object.values(week.skills).flatMap((activities) =>
    (activities ?? []).map((activity) => activity.id)
  );
}

function weekPercent(week: Week, isComplete: (id: string) => boolean) {
  const ids = allActivityIds(week);
  if (!ids.length) return 0;
  const done = ids.filter(isComplete).length;
  return Math.round((done / ids.length) * 100);
}

export default function CourseDashboard({ weeks }: { weeks: Week[] }) {
  const { isComplete } = useProgress();

  return (
    <main className="shell">
      <header className="hero">
        <div>
          <p className="eyebrow">40-WEEK ENGLISH COURSE</p>
          <h1>My English Hub</h1>
          <p className="heroText">
            Open a week, choose a skill, complete the activities and watch your progress grow.
          </p>
        </div>
        <div className="heroBadge">✨ Learn week by week</div>
      </header>

      {[0, 10, 20, 30].map((start) => (
        <section className="termSection" key={start}>
          <div className="sectionHeading">
            <h2>Weeks {start + 1}–{start + 10}</h2>
            <span>{start / 10 + 1} / 4</span>
          </div>

          <div className="weekGrid">
            {weeks.slice(start, start + 10).map((week) => {
              const percent = weekPercent(week, isComplete);
              return (
                <Link
                  className={`weekCard ${!week.published ? "weekCardMuted" : ""}`}
                  href={week.published ? `/week/${week.number}` : "#"}
                  aria-disabled={!week.published}
                  key={week.number}
                >
                  <div className="weekTop">
                    <span className="weekNumber">WEEK {week.number}</span>
                    <span>{week.published ? `${percent}%` : "Soon"}</span>
                  </div>
                  <h3>{week.title}</h3>
                  <p>{week.theme}</p>
                  <div className="progressTrack">
                    <div className="progressFill" style={{ width: `${percent}%` }} />
                  </div>
                </Link>
              );
            })}
          </div>
        </section>
      ))}
    </main>
  );
}
