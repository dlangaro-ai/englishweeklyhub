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

const stripHtml = (value: string) => value.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();

type SearchHit = {
  week: number;
  where: string;
  snippet: string;
  href: string;
  open: boolean;
};

const SNIPPET_PAD = 44;

function snippetAround(text: string, at: number, length: number): string {
  const start = Math.max(0, at - SNIPPET_PAD);
  const end = Math.min(text.length, at + length + SNIPPET_PAD);
  return (
    (start > 0 ? "… " : "") +
    text.slice(start, end).trim() +
    (end < text.length ? " …" : "")
  );
}

// Walk a week's content for the query and report each place it turns up — the
// section, a snippet of the text, and a link that lands on that spot. Hidden
// content (summary, books, homework, bonus, activities) is only searched once a
// week is published, or for the teacher.
function weekHits(week: Week, deep: boolean, query: string): SearchHit[] {
  const hits: SearchHit[] = [];
  const open = week.published || deep;
  const weekHref = `/week/${week.number}`;

  const add = (where: string, raw: string, href: string) => {
    const text = raw.trim();
    if (!text) return;
    const at = text.toLowerCase().indexOf(query);
    if (at === -1) return;
    hits.push({ week: week.number, where, snippet: snippetAround(text, at, query.length), href, open });
  };

  add("Title", `Week ${week.number} — ${week.title}`, weekHref);
  add("Topic", week.unit, weekHref);

  if (deep) {
    add("This week", stripHtml(week.summary), `${weekHref}/this-week`);
    week.books.forEach((book) => add("Books", book, `${weekHref}#books`));
    week.homework.forEach((item) => add("Homework", item, `${weekHref}#homework`));
    add("Bonus", week.bonusText, `${weekHref}#bonus`);
    week.extraActivities.forEach((activity) => {
      add("Eager Learners", activity.title, `${weekHref}/skills`);
      add("Eager Learners", stripHtml(activity.description ?? ""), `${weekHref}/skills`);
    });
  }

  return hits;
}

function highlight(text: string, query: string) {
  if (!query) return text;
  const lower = text.toLowerCase();
  const nodes: React.ReactNode[] = [];
  let cursor = 0;
  let found = lower.indexOf(query);
  let key = 0;

  while (found !== -1) {
    if (found > cursor) nodes.push(text.slice(cursor, found));
    nodes.push(<mark key={key++}>{text.slice(found, found + query.length)}</mark>);
    cursor = found + query.length;
    found = lower.indexOf(query, cursor);
  }
  nodes.push(text.slice(cursor));
  return nodes;
}

export default function CourseDashboard({ weeks, isEditor }: { weeks: Week[]; isEditor: boolean }) {
  const [query, setQuery] = useState("");
  const readyCount = weeks.filter((week) => week.published).length;

  const trimmed = query.trim().toLowerCase();

  const seen = new Set<string>();
  const hits = trimmed
    ? weeks
        .flatMap((week) => weekHits(week, week.published || isEditor, trimmed))
        .filter((hit) => {
          const key = `${hit.week}|${hit.where}`;
          if (seen.has(key)) return false;
          seen.add(key);
          return true;
        })
        .slice(0, 40)
    : [];
  const hitWeeks = new Set(hits.map((hit) => hit.week));

  function renderWeekCard(week: Week) {
    const clickable = week.published || isEditor;
    const cls = hitWeeks.has(week.number) ? "weekCard weekCardMatch" : "weekCard";

    return clickable ? (
      <Link className={cls} href={`/week/${week.number}`} key={week.number}>
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
      <div className={`${cls} weekCardMuted`} key={week.number}>
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

      {trimmed && (
        <div className="searchResults">
          {hits.length === 0 ? (
            <p className="dashboardSearchCount">No weeks match your search.</p>
          ) : (
            <>
              <p className="dashboardSearchCount">
                {hits.length}
                {hits.length === 40 ? "+" : ""} {hits.length === 1 ? "result" : "results"} — tap to jump to it
              </p>
              <ul className="searchResultsList">
                {hits.map((hit) => {
                  const inside = (
                    <>
                      <span className="searchResultWhere">Week {hit.week} · {hit.where}</span>
                      <span className="searchResultSnippet">{highlight(hit.snippet, trimmed)}</span>
                    </>
                  );

                  return (
                    <li key={`${hit.week}-${hit.where}`}>
                      {hit.open ? (
                        <Link href={hit.href} className="searchResultLink">
                          {inside}
                        </Link>
                      ) : (
                        <span className="searchResultLink searchResultLinkMuted">
                          {inside}
                          <span className="searchResultSoon">Soon 🔒</span>
                        </span>
                      )}
                    </li>
                  );
                })}
              </ul>
            </>
          )}
        </div>
      )}

      {terms.map(({ start, count, name, emoji }) => (
        <section className="termSection" key={start}>
          <div className="sectionHeading">
            <h2>{emoji} {name}</h2>
            <span>Weeks {start + 1}–{start + count}</span>
          </div>

          <div className="weekGrid">
            {weeks.slice(start, start + count).map(renderWeekCard)}
          </div>
        </section>
      ))}
    </main>
  );
}
