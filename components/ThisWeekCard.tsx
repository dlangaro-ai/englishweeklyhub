import Link from "next/link";
import { Week, getLatestPublishedWeek } from "@/lib/courseData";

const stripHtml = (value: string) => value.replace(/<[^>]+>/g, " ").replace(/&nbsp;/g, " ").replace(/\s+/g, " ").trim();

function shorten(text: string, max: number) {
  if (text.length <= max) return text;
  return `${text.slice(0, max).replace(/\s+\S*$/, "")}…`;
}

// "Big news" card on the homepage, built from the newest published week: its
// title, one short line about it and ONE big button. Everything else on the
// card (books, homework, activities, the teacher's own buttons) is a quiet
// link, so the eye lands on "Let's go!" first.
export default function ThisWeekCard({ weeks }: { weeks: Week[] }) {
  const currentNumber = getLatestPublishedWeek(weeks);
  const week = weeks.find((candidate) => candidate.number === currentNumber);
  if (!week) return null;

  const summary = shorten(stripHtml(week.summary), 150);
  const thisWeekHref = `/week/${week.number}/this-week`;

  const shortcuts: { label: string; href: string }[] = [
    stripHtml(week.books) && { label: "Books", href: `/week/${week.number}#books` },
    stripHtml(week.homework) && { label: "Homework", href: `/week/${week.number}#homework` },
    week.extraActivities.length > 0 && {
      label: `${week.extraActivities.length} fun ${week.extraActivities.length === 1 ? "activity" : "activities"}`,
      href: `/week/${week.number}/skills`
    }
  ].filter(Boolean) as { label: string; href: string }[];

  // Buttons added to this week's "What's happening this week" message show
  // here too; ones that lead to another website open in a new tab.
  const buttons = (week.summaryButtons ?? []).map((button) => ({
    key: button.id,
    label: button.label,
    href: button.href,
    external: !button.href.startsWith("/")
  }));

  const links = [...buttons, ...shortcuts.map((shortcut) => ({ key: shortcut.label, external: false, ...shortcut }))];

  return (
    <section className="thisWeek" aria-label="Big news this week">
      <p className="thisWeekLabel">Big news · Week {week.number}</p>
      <h2 className="thisWeekTitle">
        {/* This link is stretched over the whole card (see .thisWeekCover), so
            clicking anywhere on the card opens "What's happening this week".
            The links below sit on top of it and keep their own pages. */}
        <Link href={thisWeekHref} className="thisWeekCover"><span>{week.title}</span></Link>
      </h2>
      {summary && <p className="thisWeekText">{summary}</p>}

      <div className="thisWeekActions">
        <Link href={thisWeekHref} className="thisWeekGo">
          Let&apos;s go! →
        </Link>
        {links.length > 0 && (
          <ul className="thisWeekLinks">
            {links.map((link) => (
              <li key={link.key}>
                {link.external ? (
                  <a href={link.href} target="_blank" rel="noreferrer">
                    {link.label} <span aria-hidden="true">↗</span>
                  </a>
                ) : (
                  <Link href={link.href}>{link.label}</Link>
                )}
              </li>
            ))}
          </ul>
        )}
      </div>
    </section>
  );
}
