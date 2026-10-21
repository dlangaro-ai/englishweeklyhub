import Link from "next/link";
import { Week, getLatestPublishedWeek } from "@/lib/courseData";

const terms = [
  { start: 0, count: 19, name: "Semester 1", emoji: "📘", tint: "tintBlue" },
  { start: 19, count: 2, name: "Winter Break", emoji: "❄️", tint: "tintIce" },
  { start: 21, count: 20, name: "Semester 2", emoji: "📗", tint: "tintSun" }
];

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
