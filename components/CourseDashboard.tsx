"use client";

import Link from "next/link";
import { Week } from "@/lib/courseData";
import EditModeToggle from "./EditModeToggle";

const terms = [
  { start: 0, count: 19, name: "Semester 1", emoji: "📘" },
  { start: 19, count: 2, name: "Winter Break", emoji: "❄️" },
  { start: 21, count: 20, name: "Semester 2", emoji: "📗" }
];

const slugify = (name: string) => name.toLowerCase().replace(/\s+/g, "-");

export default function CourseDashboard({ weeks, isEditor }: { weeks: Week[]; isEditor: boolean }) {
  const readyCount = weeks.filter((week) => week.published).length;

  return (
    <main className="shell">
      <header className="hero">
        <div>
          <p className="eyebrow">GRADE 5 ENGLISH · {weeks.length} WEEKS</p>
          <h1>My English Hub</h1>
          <p className="heroText">
            Pick your week below to find this week&apos;s topic, books, homework and fun activities.
          </p>
        </div>
        <div className="heroRight">
          <div className="heroBadge">🚀 {readyCount} of {weeks.length} weeks ready</div>
          <EditModeToggle isEditor={isEditor} />
        </div>
      </header>

      <nav className="semesterTabs" aria-label="Jump to semester">
        {terms
          .filter((term) => term.name.startsWith("Semester"))
          .map((term) => (
            <a key={term.name} href={`#${slugify(term.name)}`} className="semesterTab">
              {term.emoji} {term.name}
            </a>
          ))}
      </nav>

      {terms.map(({ start, count, name, emoji }) => (
        <section className="termSection" id={slugify(name)} key={start}>
          <div className="sectionHeading">
            <h2>{emoji} {name}</h2>
            <span>Weeks {start + 1}–{start + count}</span>
          </div>

          <div className="weekGrid">
            {weeks.slice(start, start + count).map((week) => {
              const clickable = week.published || isEditor;

              return clickable ? (
                <Link className="weekCard" href={`/week/${week.number}`} key={week.number}>
                  <div className="weekTop">
                    <span className="weekNumber">WEEK {week.number}</span>
                    <span className={`weekStatus ${week.published ? "weekStatusReady" : ""}`}>
                      {week.published ? "Open ✓" : "Soon 🔒"}
                    </span>
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
              );
            })}
          </div>
        </section>
      ))}
    </main>
  );
}
