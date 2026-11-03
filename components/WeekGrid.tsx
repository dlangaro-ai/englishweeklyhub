import Link from "next/link";
import { TERMS, Week, getLatestPublishedWeek } from "@/lib/courseData";

const TERM_STYLES = [
  { emoji: "📘", tint: "tintBlue" },
  { emoji: "❄️", tint: "tintIce" },
  { emoji: "📗", tint: "tintSun" }
];

const terms = TERMS.map((term, index) => ({ ...term, ...TERM_STYLES[index] }));

// Every week of the year, grouped by semester. Students can open published
// weeks; the teacher (isEditor) can open all of them.
export default function WeekGrid({ weeks, isEditor }: { weeks: Week[]; isEditor: boolean }) {
  const latestPublishedWeek = getLatestPublishedWeek(weeks);

  function renderWeekCard(week: Week, tint: string) {
    const clickable = week.published || isEditor;
    const publishedState = week.published
      ? week.number === latestPublishedWeek
        ? " weekCardCurrent"
        : " weekCardPast"
      : "";
    const cls = `weekCard ${tint}${publishedState}`;

    return clickable ? (
      <Link className={cls} href={`/week/${week.number}`} key={week.number}>
        <div className="weekTop">
          <span className="weekNumber">WEEK {week.number}</span>
          <span className={`weekStatus ${week.published ? "weekStatusReady" : ""}`}>
            {week.published ? <>Open <span aria-hidden="true">✓</span></> : <>Soon <span aria-hidden="true">🔒</span></>}
          </span>
        </div>
        <h3>{week.title}</h3>
        <p>{week.unit}</p>
      </Link>
    ) : (
      <div className={`${cls} weekCardMuted`} key={week.number}>
        <div className="weekTop">
          <span className="weekNumber">WEEK {week.number}</span>
          <span className="weekStatus">Soon <span aria-hidden="true">🔒</span></span>
        </div>
        <h3>{week.title}</h3>
        <p>{week.unit}</p>
      </div>
    );
  }

  return (
    <>
      {terms.map(({ start, count, name, emoji, tint }) => (
        <section className="termSection" key={start}>
          <div className="sectionHeading">
            <h2><span className="sectionEmoji">{emoji}</span> {name}</h2>
            <span>Weeks {start + 1}–{start + count}</span>
          </div>

          <div className="weekGrid">
            {weeks.slice(start, start + count).map((week) => renderWeekCard(week, tint))}
          </div>
        </section>
      ))}
    </>
  );
}
