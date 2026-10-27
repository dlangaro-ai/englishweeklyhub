"use client";

import { useState } from "react";
import Link from "next/link";
import { Week } from "@/lib/courseData";
import EditModeToggle from "./EditModeToggle";
import TedAnk5Logo from "./TedAnk5Logo";
import Icon, { IconName } from "./Icon";
import BreakingNews from "./BreakingNews";

const HOME_TABS: { href: string; label: string; icon: IconName; tint: string }[] = [
  { href: "/weeks", label: "All Weeks", icon: "calendar", tint: "navYellow" },
  { href: "/completed", label: "Completed Weeks", icon: "check", tint: "navGreen" },
  { href: "/vocabulary", label: "Vocabulary", icon: "abc", tint: "navPink" },
  { href: "/extra-activities", label: "Extra Activities", icon: "gift", tint: "navOrange" },
  { href: "/resources", label: "Resources & Library", icon: "book", tint: "navBlue" },
  { href: "/about", label: "About Us", icon: "chat", tint: "navPurple" }
];

const stripHtml = (value: string) => value.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();

type SearchHit = {
  week: number;
  where: string;
  snippet: string;
  href: string;
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
// section, a snippet of the text, and a link that lands on that spot. Callers
// decide which weeks to search (students only get published ones).
function weekHits(week: Week, query: string): SearchHit[] {
  const hits: SearchHit[] = [];
  const weekHref = `/week/${week.number}`;

  const add = (where: string, raw: string, href: string) => {
    const text = raw.trim();
    if (!text) return;
    const at = text.toLowerCase().indexOf(query);
    if (at === -1) return;
    hits.push({ week: week.number, where, snippet: snippetAround(text, at, query.length), href });
  };

  add("Title", `Week ${week.number} — ${week.title}`, weekHref);
  add("Topic", week.unit, weekHref);
  add("This week", stripHtml(week.summary), `${weekHref}/this-week`);
  add("Books", stripHtml(week.books), `${weekHref}#books`);
  add("Homework", stripHtml(week.homework), `${weekHref}#homework`);
  add("Extra Activities", week.bonusText, `${weekHref}#bonus`);
  add("Resources & Library", stripHtml(week.libraryText), `${weekHref}#library`);
  (week.libraryLinks ?? []).forEach((link) => add("Resources & Library", link.title, `${weekHref}#library`));
  week.extraActivities.forEach((activity) => {
    add("Extra Activities", activity.title, `${weekHref}/skills`);
    add("Extra Activities", stripHtml(activity.description ?? ""), `${weekHref}/skills`);
  });

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
        .filter((week) => week.published || isEditor)
        .flatMap((week) => weekHits(week, trimmed))
        .filter((hit) => {
          const key = `${hit.week}|${hit.where}`;
          if (seen.has(key)) return false;
          seen.add(key);
          return true;
        })
        .slice(0, 40)
    : [];
  return (
    <main className="shell">
      <header className="hero">
        <div className="heroTitleBlock">
          <h1 className="srOnly">TEDANK5 — My English Hub</h1>
          <p className="eyebrow">GRADE 5 ENGLISH · {weeks.length} WEEKS</p>
          <a
            href="#explore"
            className="heroLogoLink"
            title="Show this week's news and the menu"
            onClick={(event) => {
              event.preventDefault();
              const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
              document.getElementById("explore")?.scrollIntoView({ behavior: reduceMotion ? "auto" : "smooth" });
            }}
          >
            <TedAnk5Logo className="heroLogo" />
          </a>
          <div className="heroProgress">
            <div className="heroProgressTrack">
              <div
                className="heroProgressFill"
                style={{ width: `${weeks.length ? (readyCount / weeks.length) * 100 : 0}%` }}
              />
            </div>
            <span className="heroProgressLabel"><span aria-hidden="true">🚀 </span>{readyCount} of {weeks.length} weeks open</span>
          </div>
          <p className="heroText">
            Choose a tab below to find your week, vocabulary, fun activities and more!
          </p>
        </div>
        <div className="heroRight">
          <div className="dashboardSearch homeSearch">
            <span className="dashboardSearchIcon" aria-hidden="true">🔍</span>
            <input
              type="text"
              className="dashboardSearchInput"
              placeholder="Search all weeks…"
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
          <EditModeToggle isEditor={isEditor} />
        </div>
      </header>

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
                {hits.map((hit) => (
                  <li key={`${hit.week}-${hit.where}`}>
                    <Link href={hit.href} className="searchResultLink">
                      <span className="searchResultWhere">Week {hit.week} · {hit.where}</span>
                      <span className="searchResultSnippet">{highlight(hit.snippet, trimmed)}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            </>
          )}
        </div>
      )}

      <div id="explore" className="homeExplore">
        <BreakingNews weeks={weeks} />

        <nav className="homeTabs" aria-label="Main menu">
          {HOME_TABS.map((tab) => (
            <Link key={tab.href} href={tab.href} className={`homeTab ${tab.tint}`}>
              <span className="homeTabIcon"><Icon name={tab.icon} size={44} /></span>
              <span className="homeTabLabel">{tab.label}</span>
            </Link>
          ))}
        </nav>
      </div>

    </main>
  );
}
