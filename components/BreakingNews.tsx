import Link from "next/link";
import { Week, getLatestPublishedWeek } from "@/lib/courseData";
import Icon, { IconName } from "./Icon";
import { SITE_PAGES } from "@/lib/sitePages";

const stripHtml = (value: string) => value.replace(/<[^>]+>/g, " ").replace(/&nbsp;/g, " ").replace(/\s+/g, " ").trim();

function shorten(text: string, max: number) {
  if (text.length <= max) return text;
  return `${text.slice(0, max).replace(/\s+\S*$/, "")}…`;
}

// "Big news" card on the homepage, built from the newest published week:
// the week's title, one short line about it, colourful shortcuts to its
// books, homework and extra activities.
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

  // Buttons added to this week's "What's happening this week" message show here
  // too: coloured like the page they lead to, or navy for another website.
  const buttons = (week.summaryButtons ?? []).map((button) => {
    const page = SITE_PAGES.find((item) => item.href === button.href);
    return {
      ...button,
      icon: (page?.icon ?? "link") as IconName,
      tint: page?.tint ?? "navExternal",
      external: !button.href.startsWith("/")
    };
  });

  return (
    <section className="bigNews" aria-label="Big news this week">
      <span className="bigNewsSticker" aria-hidden="true">NEW!</span>
      <div className="bigNewsMain">
        <div className="bigNewsIcon">
          <Icon name="megaphone" size={46} />
        </div>

        <div className="bigNewsBody">
          <p className="bigNewsLabel">BIG NEWS · WEEK {week.number}</p>
          <h2 className="bigNewsTitle"><span>{week.title}</span></h2>
          {summary && <p className="bigNewsText">{summary}</p>}

          <div className="bigNewsLinks">
            <Link href={`/week/${week.number}`} className="bigNewsGo">
              Let&apos;s go! →
            </Link>
            {buttons.map((button) =>
              button.external ? (
                <a
                  key={button.id}
                  href={button.href}
                  target="_blank"
                  rel="noreferrer"
                  className={`bigNewsChip ${button.tint}`}
                >
                  <Icon name={button.icon} size={22} /> {button.label} <span aria-hidden="true">↗</span>
                </a>
              ) : (
                <Link key={button.id} href={button.href} className={`bigNewsChip ${button.tint}`}>
                  <Icon name={button.icon} size={22} /> {button.label}
                </Link>
              )
            )}
            {shortcuts.map((shortcut) => (
              <Link key={shortcut.label} href={shortcut.href} className={`bigNewsChip ${shortcut.tint}`}>
                <Icon name={shortcut.icon} size={22} /> {shortcut.label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
