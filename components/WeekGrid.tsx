import { TERMS, Week, getLatestPublishedWeek } from "@/lib/courseData";
import WeekCard from "./WeekCard";

// Every week of the year, grouped by semester. Students can open published
// weeks; the teacher (isEditor) can open all of them.
export default function WeekGrid({ weeks, isEditor }: { weeks: Week[]; isEditor: boolean }) {
  const latestPublishedWeek = getLatestPublishedWeek(weeks);

  return (
    <>
      {TERMS.map(({ start, count, name }) => (
        <section className="weekTileSection" key={start}>
          <div className="weekTileSectionHead">
            <h2>{name}</h2>
            <span>Weeks {start + 1}–{start + count}</span>
          </div>

          <div className="weekTileGrid">
            {weeks.slice(start, start + count).map((week) => (
              <WeekCard
                key={week.number}
                week={week}
                as="h3"
                isNow={week.number === latestPublishedWeek}
                clickable={week.published || isEditor}
              />
            ))}
          </div>
        </section>
      ))}
    </>
  );
}
