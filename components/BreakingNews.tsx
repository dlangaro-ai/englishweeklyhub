import Link from "next/link";
import { Week, getLatestPublishedWeek } from "@/lib/courseData";
import Icon, { IconName } from "./Icon";

const stripHtml = (value: string) => value.replace(/<[^>]+>/g, " ").replace(/&nbsp;/g, " ").replace(/\s+/g, " ").trim();

function shorten(text: string, max: number) {
  if (text.length <= max) return text;
  return `${text.slice(0, max).replace(/\s+\S*$/, "")}…`;
}

// "Big news" card on the homepage, built from the newest published week:
// the week's title, one short line about it, colourful shortcuts to its
// books, homework and Eager Learners activities, and a gently scrolling
// strip of headlines along the bottom.
export default function BreakingNews({ weeks }: { weeks: Week[] }) {
  const currentNumber = getLatestPublishedWeek(weeks);
  const week = weeks.find((candidate) => candidate.number === currentNumber);
  if (!week) return null;

  const summary = shorten(stripHtml(week.summary), 150);
  const shortcuts: { icon: IconName; label: string; href: string; tint: string }[] = [
    stripHtml(week.books) && { icon: "books" as const, label: "Books", href: `/week/${week.number}#books`, tint: "navBlue" },
    stripHtml(week.homework) && { icon: "house" as const, label: "Homework", href: `/week/${week.number}#homework`, tint: "navOrange" },
    week.extraActivities.length > 0 && {
      icon: "gift" as const,
      label: `${week.extraActivities.length} fun ${week.extraActivities.length === 1 ? "activity" : "activities"}`,
      href: `/week/${week.number}/skills`,
      tint: "navPink"
    }
  ].filter(Boolean) as { icon: IconName; label: string; href: string; tint: string }[];

  // Little headlines that slide across the bottom of the card.
  const headlines: { icon: IconName; label: string; text: string; href: string }[] = [
    summary && { icon: "sparkle" as const, label: "This week", text: summary, href: `/week/${week.number}/this-week` },
    stripHtml(week.books) && { icon: "books" as const, label: "Books", text: shorten(stripHtml(week.books), 90), href: `/week/${week.number}#books` },
    stripHtml(week.homework) && { icon: "house" as const, label: "Homework", text: shorten(stripHtml(week.homework), 90), href: `/week/${week.number}#homework` },
    week.extraActivities.length > 0 && {
      icon: "gift" as const,
      label: "Eager Learners",
      text: `${week.extraActivities.length} fun ${week.extraActivities.length === 1 ? "activity" : "activities"} waiting for you!`,
      href: `/week/${week.number}/skills`
    }
  ].filter(Boolean) as { icon: IconName; label: string; text: string; href: string }[];

  const ticker = (copy: boolean) =>
    headlines.map((item) => (
      <Link className="newsTickerItem" href={item.href} key={item.label} tabIndex={copy ? -1 : undefined}>
        <Icon name={item.icon} size={22} />
        <strong>{item.label}:</strong> {item.text}
        <span className="newsTickerStar" aria-hidden="true">★</span>
      </Link>
    ));

  return (
    <section className="bigNews" aria-label="Big news this week">
      <div className="bigNewsMain">
        <div className="bigNewsIcon">
          <Icon name="megaphone" size={58} />
        </div>

        <div className="bigNewsBody">
          <p className="bigNewsLabel">BIG NEWS · WEEK {week.number}</p>
          <h2 className="bigNewsTitle">{week.title}</h2>
          {summary && <p className="bigNewsText">{summary}</p>}

          <div className="bigNewsLinks">
            <Link href={`/week/${week.number}`} className="bigNewsGo">
              Let&apos;s go! →
            </Link>
            {shortcuts.map((shortcut) => (
              <Link key={shortcut.label} href={shortcut.href} className={`bigNewsChip ${shortcut.tint}`}>
                <Icon name={shortcut.icon} size={22} /> {shortcut.label}
              </Link>
            ))}
          </div>
        </div>
      </div>

      {headlines.length > 0 && (
        <div className="newsTicker">
          {/* Two copies side by side so the headlines loop without a gap. */}
          <div className="newsTickerTrack">
            <div className="newsTickerGroup">{ticker(false)}</div>
            <div className="newsTickerGroup" aria-hidden="true">{ticker(true)}</div>
          </div>
        </div>
      )}
    </section>
  );
}
