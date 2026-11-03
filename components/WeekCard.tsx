import Link from "next/link";
import { Week } from "@/lib/courseData";

// One week as a plain card, shared by the Completed Weeks and All Weeks pages.
// Done weeks are all the same soft card, this week (isNow) is the only purple
// one, and weeks not published yet are greyed out with a lock. A week that
// can't be opened (clickable = false) is a plain box instead of a link.
export default function WeekCard({
  week,
  isNow,
  clickable,
  as: Heading = "h2"
}: {
  week: Week;
  isNow: boolean;
  clickable: boolean;
  as?: "h2" | "h3";
}) {
  const soon = !week.published;
  const className = `weekTile${isNow ? " isNow" : ""}${soon ? " isSoon" : ""}`;

  const content = (
    <>
      <div className="weekTileTop">
        <span className="weekTileChip">WEEK {week.number}</span>
        {isNow && <span className="weekTileNow"><span aria-hidden="true">★ </span>Now</span>}
        {soon && <span className="weekTileSoon"><span aria-hidden="true">🔒 </span>Soon</span>}
      </div>
      <Heading className="weekTileTitle">{week.title}</Heading>
      <p className="weekTileUnit">{week.unit}</p>
    </>
  );

  return clickable ? (
    <Link className={className} href={`/week/${week.number}`} aria-current={isNow ? "true" : undefined}>
      {content}
    </Link>
  ) : (
    <div className={className}>{content}</div>
  );
}
