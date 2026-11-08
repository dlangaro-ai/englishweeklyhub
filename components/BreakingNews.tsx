import Link from "next/link";
import { Week, getLatestPublishedWeek } from "@/lib/courseData";

const stripHtml = (value: string) => value.replace(/<[^>]+>/g, " ").replace(/&nbsp;/g, " ").replace(/\s+/g, " ").trim();

function shorten(text: string, max: number) {
  if (text.length <= max) return text;
  return `${text.slice(0, max).replace(/\s+\S*$/, "")}…`;
}

// "Big news" card on the homepage, built from the newest published week:
// the week number and dates, the week's title and one short line about it.
// Clicking anywhere on the card opens that week's page.
export default function BreakingNews({ weeks }: { weeks: Week[] }) {
  const currentNumber = getLatestPublishedWeek(weeks);
  const week = weeks.find((candidate) => candidate.number === currentNumber);
  if (!week) return null;

  const summary = shorten(stripHtml(week.summary), 150);
  const weekHref = `/week/${week.number}`;

  return (
    <section className="bigNews" aria-label={`Week ${week.number}`}>
      <div className="bigNewsMain">
        <div className="bigNewsBody">
          {/* Week number and its dates (the week's unit / date line), which tells
              parents at a glance which week this is. */}
          <p className="bigNewsLabel">
            WEEK {week.number}
            {week.unit.trim() && <> · {week.unit.trim()}</>}
          </p>
          {/* Says plainly that the title is the week's topic, so students don't
              read a title written as a question as something to answer. */}
          <p className="bigNewsKicker">📖 This week&apos;s topic:</p>
          <h2 className="bigNewsTitle">
            {/* This link is stretched over the whole card (see .bigNewsCover), so
                clicking anywhere on the card opens the whole week's page. */}
            <Link href={weekHref} className="bigNewsCover"><span>{week.title}</span></Link>
          </h2>
          {summary && <p className="bigNewsText">{summary}</p>}

          <Link href={weekHref} className="bigNewsGo">
            Check it out! →
          </Link>
        </div>
      </div>
    </section>
  );
}
