"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import { TERMS, Week, getLatestPublishedWeek } from "@/lib/courseData";

// The whole school year as one row of numbered dots: finished weeks are soft,
// this week is the one solid dot, weeks still to come are empty. The row
// scrolls sideways and opens already centred on this week.
export default function WeekTimeline({ weeks, isEditor }: { weeks: Week[]; isEditor: boolean }) {
  const currentNumber = getLatestPublishedWeek(weeks);
  const scrollerRef = useRef<HTMLDivElement>(null);
  const currentRef = useRef<HTMLLIElement>(null);

  useEffect(() => {
    const scroller = scrollerRef.current;
    const current = currentRef.current;
    if (!scroller || !current) return;
    const scrollerBox = scroller.getBoundingClientRect();
    const currentBox = current.getBoundingClientRect();
    scroller.scrollLeft += currentBox.left - scrollerBox.left - (scrollerBox.width - currentBox.width) / 2;
  }, []);

  return (
    <section className="timeline" aria-labelledby="timeline-title">
      <div className="timelineHead">
        <h2 id="timeline-title" className="homeSectionTitle">Our school year</h2>
      </div>

      <div className="timelineScroller" ref={scrollerRef} tabIndex={0} role="region" aria-label="Timeline of all the weeks">
        <div className="timelineTrack">
          {TERMS.map((term) => (
            <div className="timelineGroup" key={term.start}>
              <p className="timelineGroupName">{term.name}</p>
              <ol className="timelineWeeks">
                {weeks.slice(term.start, term.start + term.count).map((week) => {
                  const isCurrent = week.number === currentNumber;
                  const state = isCurrent ? "isCurrent" : week.published ? "isPast" : "isSoon";
                  const clickable = week.published || isEditor;
                  const label = `Week ${week.number}: ${week.title}${week.published ? "" : " (coming soon)"}`;

                  return (
                    <li key={week.number} ref={isCurrent ? currentRef : undefined}>
                      {clickable ? (
                        <Link
                          href={`/week/${week.number}`}
                          className={`timelineNode ${state}`}
                          aria-label={label}
                          aria-current={isCurrent ? "step" : undefined}
                          title={week.title}
                        >
                          {week.number}
                        </Link>
                      ) : (
                        <span className={`timelineNode ${state}`} role="img" aria-label={label}>
                          {week.number}
                        </span>
                      )}
                    </li>
                  );
                })}
              </ol>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
