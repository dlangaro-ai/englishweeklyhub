"use client";

import Link from "next/link";
import { Week } from "@/lib/courseData";

const terms = [
  { start: 0, name: "Term 1", emoji: "🌱" },
  { start: 10, name: "Term 2", emoji: "☀️" },
  { start: 20, name: "Term 3", emoji: "🍁" },
  { start: 30, name: "Term 4", emoji: "❄️" }
];

export default function CourseDashboard({ weeks }: { weeks: Week[] }) {
  const readyCount = weeks.filter((week) => week.published).length;

  return (
    <main className="shell">
      <header className="hero">
        <div>
          <p className="eyebrow">GRADE 5 ENGLISH · 40 WEEKS</p>
          <h1>My English Hub</h1>
          <p className="heroText">
            Pick your week below to find this week&apos;s topic, books, homework and fun extra activities.
          </p>
        </div>
        <div className="heroBadge">🚀 {readyCount} of {weeks.length} weeks ready</div>
      </header>

      {terms.map(({ start, name, emoji }) => (
        <section className="termSection" key={start}>
          <div className="sectionHeading">
            <h2>{emoji} {name}</h2>
            <span>Weeks {start + 1}–{start + 10}</span>
          </div>

          <div className="weekGrid">
            {weeks.slice(start, start + 10).map((week) =>
              week.published ? (
                <Link className="weekCard" href={`/week/${week.number}`} key={week.number}>
                  <div className="weekTop">
                    <span className="weekNumber">WEEK {week.number}</span>
                    <span className="weekStatus weekStatusReady">Open ✓</span>
                  </div>
                  <h3>{week.title}</h3>
                  <p>{week.unit}</p>
                </Link>
              ) : (
                <div className="weekCard weekCardMuted" key={week.number}>
                  <div className="weekTop">
                    <span className="weekNumber">WEEK {week.number}</span>
                    <span className="weekStatus">Soon 🔒</span>
                  </div>
                  <h3>{week.title}</h3>
                  <p>{week.unit}</p>
                </div>
              )
            )}
          </div>
        </section>
      ))}
    </main>
  );
}
