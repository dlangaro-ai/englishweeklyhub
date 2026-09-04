"use client";

import { useState } from "react";
import Link from "next/link";
import { Week } from "@/lib/courseData";
import EditModeToggle from "./EditModeToggle";

const terms = [
  { start: 0, count: 19, name: "Semester 1", emoji: "📘" },
  { start: 19, count: 2, name: "Winter Break", emoji: "❄️" },
  { start: 21, count: 20, name: "Semester 2", emoji: "📗" }
];

const stripHtml = (value: string) => value.replace(/<[^>]+>/g, " ");

// Text a search query is matched against. Hidden content (summary, homework,
// books, bonus, activities) is only searchable once a week is published — or
// for the teacher — so students can't surface content that isn't live yet.
function searchableText(week: Week, deep: boolean): string {
  const parts = [`week ${week.number}`, week.title, week.unit];

  if (deep) {
    parts.push(
      stripHtml(week.summary),
      week.books.join(" "),
      week.homework.join(" "),
      week.bonusText,
      week.extraActivities
        .flatMap((activity) => [activity.title, stripHtml(activity.description ?? "")])
        .join(" ")
    );
  }

  return parts.join(" ").toLowerCase();
}

export default function CourseDashboard({ weeks, isEditor }: { weeks: Week[]; isEditor: boolean }) {
  const [query, setQuery] = useState("");
  const readyCount = weeks.filter((week) => week.published).length;

  const trimmed = query.trim().toLowerCase();
  const results = trimmed
    ? weeks
        .filter((week) => searchableText(week, week.published || isEditor).includes(trimmed))
        .sort((a, b) => a.number - b.number)
    : [];

  function renderWeekCard(week: Week) {
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
  }

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

      <div className="dashboardSearch">
        <span className="dashboardSearchIcon" aria-hidden="true">🔍</span>
        <input
          type="text"
          className="dashboardSearchInput"
          placeholder="Search all weeks — topic, book, homework, activity…"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          aria-label="Search all weeks"
        />
        {query && (
          <button
            type="button"
            className="dashboardSearchClear"
            onClick={() => setQuery("")}
            aria-label="Clear search"
          >
            ✕
          </button>
        )}
      </div>

      {trimmed ? (
        <section className="termSection">
          <div className="sectionHeading">
            <h2>🔍 Search results</h2>
            <span>{results.length} {results.length === 1 ? "week" : "weeks"}</span>
          </div>

          {results.length ? (
            <div className="weekGrid">{results.map(renderWeekCard)}</div>
          ) : (
            <p className="heroText">No weeks match your search. Try another word.</p>
          )}
        </section>
      ) : (
        terms.map(({ start, count, name, emoji }) => (
          <section className="termSection" key={start}>
            <div className="sectionHeading">
              <h2>{emoji} {name}</h2>
              <span>Weeks {start + 1}–{start + count}</span>
            </div>

            <div className="weekGrid">
              {weeks.slice(start, start + count).map(renderWeekCard)}
            </div>
          </section>
        ))
      )}
    </main>
  );
}
