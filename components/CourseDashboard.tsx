"use client";

import Link from "next/link";
import { Week } from "@/lib/courseData";

export default function CourseDashboard({ weeks }: { weeks: Week[] }) {
  return (
    <main className="shell">
      <header className="hero">
        <div>
          <p className="eyebrow">40-WEEK GRADE 5 COURSE</p>
          <h1>My English Hub</h1>
          <p className="heroText">
            Open each week to find the unit, weekly summary, books, homework and extra activities.
          </p>
        </div>
        <div className="heroBadge">✨ Week by week</div>
      </header>

      {[0, 10, 20, 30].map((start) => (
        <section className="termSection" key={start}>
          <div className="sectionHeading">
            <h2>Weeks {start + 1}–{start + 10}</h2>
            <span>{start / 10 + 1} / 4</span>
          </div>

          <div className="weekGrid">
            {weeks.slice(start, start + 10).map((week) => (
              <Link
                className={`weekCard ${!week.published ? "weekCardMuted" : ""}`}
                href={week.published ? `/week/${week.number}` : "#"}
                aria-disabled={!week.published}
                key={week.number}
              >
                <div className="weekTop">
                  <span className="weekNumber">WEEK {week.number}</span>
                  <span>{week.published ? "Open" : "Soon"}</span>
                </div>
                <h3>{week.title}</h3>
                <p>{week.unit}</p>
              </Link>
            ))}
          </div>
        </section>
      ))}
    </main>
  );
}
