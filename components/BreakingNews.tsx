import Link from "next/link";
import { Week, getLatestPublishedWeek } from "@/lib/courseData";
import Icon from "./Icon";

const stripHtml = (value: string) => value.replace(/<[^>]+>/g, " ").replace(/&nbsp;/g, " ").replace(/\s+/g, " ").trim();

function shorten(text: string, max: number) {
  if (text.length <= max) return text;
  return `${text.slice(0, max).replace(/\s+\S*$/, "")}…`;
}

// "Breaking news" strip on the homepage, built from the newest published week:
// a headline that links to the week, plus a scrolling ticker of its key bits.
export default function BreakingNews({ weeks }: { weeks: Week[] }) {
  const currentNumber = getLatestPublishedWeek(weeks);
  const week = weeks.find((candidate) => candidate.number === currentNumber);
  if (!week) return null;

  const summary = stripHtml(week.summary);
  const items = [
    summary && { icon: "sparkle" as const, label: "This week", text: shorten(summary, 140), href: `/week/${week.number}/this-week` },
    stripHtml(week.books) && { icon: "books" as const, label: "Books", text: shorten(stripHtml(week.books), 90), href: `/week/${week.number}#books` },
    stripHtml(week.homework) && { icon: "house" as const, label: "Homework", text: shorten(stripHtml(week.homework), 90), href: `/week/${week.number}#homework` },
    week.extraActivities.length > 0 && {
      icon: "gift" as const,
      label: "Eager Learners",
      text: `${week.extraActivities.length} fun ${week.extraActivities.length === 1 ? "activity" : "activities"} to try!`,
      href: `/week/${week.number}/skills`
    }
  ].filter(Boolean) as { icon: "sparkle" | "books" | "house" | "gift"; label: string; text: string; href: string }[];

  const ticker = (copy: boolean) =>
    items.map((item) => (
      <Link className="newsTickerItem" href={item.href} key={item.label} tabIndex={copy ? -1 : undefined}>
        <Icon name={item.icon} size={22} />
        <strong>{item.label}:</strong> {item.text}
      </Link>
    ));

  return (
    <section className="breakingNews" aria-label="Breaking news">
      <div className="breakingNewsHead">
        <span className="breakingNewsBadge">
          <span className="breakingNewsDot" aria-hidden="true" /> BREAKING NEWS
        </span>
        <Link href={`/week/${week.number}`} className="breakingNewsHeadline">
          <span className="breakingNewsWeek">WEEK {week.number}</span>
          <span className="breakingNewsTitle">{week.title}</span>
          {week.unit && <span className="breakingNewsUnit">{week.unit}</span>}
          <span className="breakingNewsMore">Read more →</span>
        </Link>
      </div>

      {items.length > 0 && (
        <div className="newsTicker">
          {/* Two copies side by side so the scroll loops without a gap. */}
          <div className="newsTickerTrack">
            <div className="newsTickerGroup">{ticker(false)}</div>
            <div className="newsTickerGroup" aria-hidden="true">{ticker(true)}</div>
          </div>
        </div>
      )}
    </section>
  );
}
