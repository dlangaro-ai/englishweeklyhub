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
// books, homework and extra activities, and one big button underneath.
export default function BreakingNews({ weeks }: { weeks: Week[] }) {
  const currentNumber = getLatestPublishedWeek(weeks);
  const week = weeks.find((candidate) => candidate.number === currentNumber);
  if (!week) return null;

  const summary = shorten(stripHtml(week.summary), 150);
  const weekHref = `/week/${week.number}`;
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
    <section className="bigNews" aria-label={`Week ${week.number}`}>
      <div className="bigNewsMain">
        <div className="bigNewsBody">
          {/* Week number and its dates (the week's unit / date line), which tells
              parents at a glance which week this is. */}
          <p className="bigNewsLabel">
            WEEK {week.number}
            {week.unit.trim() && <> · {week.unit.trim()}</>}
          </p>
          <h2 className="bigNewsTitle">
            {/* This link is stretched over the whole card (see .bigNewsCover), so
                clicking anywhere on the card opens the whole week's page.
                The buttons below sit on top of it and keep their own pages. */}
            <Link href={weekHref} className="bigNewsCover"><span>{week.title}</span></Link>
          </h2>
          {summary && <p className="bigNewsText">{summary}</p>}

          <div className="bigNewsLinks">
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

          <Link href={weekHref} className="bigNewsGo">
            Check it out! →
          </Link>
        </div>
      </div>
    </section>
  );
}
