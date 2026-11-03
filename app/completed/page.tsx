import Link from "next/link";
import { getAllWeeks } from "@/lib/getWeeks";
import { getLatestPublishedWeek } from "@/lib/courseData";
import Icon from "@/components/Icon";

export const dynamic = "force-dynamic";

export const metadata = { title: "Completed Weeks" };

export default async function CompletedWeeksPage() {
  const weeks = await getAllWeeks();
  const completedWeeks = weeks.filter((week) => week.published).sort((a, b) => b.number - a.number);
  const latestPublishedWeek = getLatestPublishedWeek(weeks);

  return (
    <main className="shell">
      <Link href="/" className="backLink">← Home</Link>

      <header className="pageIntro">
        <h1 className="pageTitle">Completed Weeks</h1>
        <span className="weeksOpenPill">{completedWeeks.length} of {weeks.length} weeks open</span>
        <p className="pageIntroText">Every week that&apos;s published so far, in one place</p>
      </header>

      {completedWeeks.length === 0 ? (
        <div className="emptyState compact">
          <div className="emptyIcon"><Icon name="check" size={64} /></div>
          <h2>No weeks published yet</h2>
          <p>Weeks you publish will show up here.</p>
        </div>
      ) : (
        <div className="completedGrid">
          {completedWeeks.map((week) => {
            const isNow = week.number === latestPublishedWeek;

            return (
              <Link
                className={`completedCard${isNow ? " isNow" : ""}`}
                href={`/week/${week.number}`}
                key={week.number}
                aria-current={isNow ? "true" : undefined}
              >
                <div className="completedCardTop">
                  <span className="completedChip">WEEK {week.number}</span>
                  {isNow && <span className="completedNow"><span aria-hidden="true">★ </span>Now</span>}
                </div>
                <h2 className="completedTitle">{week.title}</h2>
                <p className="completedUnit">{week.unit}</p>
              </Link>
            );
          })}
        </div>
      )}
      <Link href="/" className="homepageButton">
        🏠 Homepage
      </Link>
    </main>
  );
}
