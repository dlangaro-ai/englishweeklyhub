"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import type { SearchHit } from "@/lib/search";

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

// The search panel that drops down from the top bar (opened with the
// magnifying-glass icon). Searches every week via /api/search as you type.
export default function SiteSearch({ onClose }: { onClose: () => void }) {
  const [query, setQuery] = useState("");
  const [hits, setHits] = useState<SearchHit[]>([]);
  const [searched, setSearched] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const trimmed = query.trim().toLowerCase();

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  useEffect(() => {
    if (trimmed.length < 2) {
      setSearched(false);
      return;
    }

    const controller = new AbortController();
    const timer = setTimeout(async () => {
      try {
        const response = await fetch(`/api/search?q=${encodeURIComponent(trimmed)}`, {
          signal: controller.signal
        });
        if (!response.ok) throw new Error("search failed");
        const result = (await response.json()) as { hits: SearchHit[] };
        setHits(result.hits);
        setSearched(true);
      } catch (error) {
        if ((error as Error).name !== "AbortError") {
          setHits([]);
          setSearched(true);
        }
      }
    }, 220);

    return () => {
      clearTimeout(timer);
      controller.abort();
    };
  }, [trimmed]);

  const tooShort = trimmed.length < 2;

  return (
    <div id="site-search" className="siteSearchPanel" role="search">
      <div className="siteSearchInner">
        <div className="siteSearchField">
          <svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round">
            <circle cx="10.5" cy="10.5" r="6.5" />
            <path d="M15.5 15.5L21 21" />
          </svg>
          <input
            ref={inputRef}
            type="search"
            placeholder="Search all weeks — topic, book, homework, activity…"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            aria-label="Search all weeks"
          />
          {query && (
            <button type="button" className="siteSearchClear" onClick={() => setQuery("")} aria-label="Clear search">
              ✕
            </button>
          )}
        </div>

        {tooShort ? (
          <p className="siteSearchHint">Type at least two letters to search every week.</p>
        ) : !searched ? (
          <p className="siteSearchHint">Searching…</p>
        ) : hits.length === 0 ? (
          <p className="siteSearchHint">No weeks match your search.</p>
        ) : (
          <>
            <p className="dashboardSearchCount">
              {hits.length}
              {hits.length === 40 ? "+" : ""} {hits.length === 1 ? "result" : "results"} — tap to jump to it
            </p>
            <ul className="searchResultsList">
              {hits.map((hit) => (
                <li key={`${hit.week}-${hit.where}`}>
                  <Link href={hit.href} className="searchResultLink" onClick={onClose}>
                    <span className="searchResultWhere">Week {hit.week} · {hit.where}</span>
                    <span className="searchResultSnippet">{highlight(hit.snippet, trimmed)}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </>
        )}
      </div>
    </div>
  );
}
