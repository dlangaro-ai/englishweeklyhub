import Link from "next/link";
import { getAllWeeks } from "@/lib/getWeeks";

export const dynamic = "force-dynamic";

export default async function CompletedWeeksPage() {
  const weeks = await getAllWeeks();
  const completedWeeks = weeks.filter((week) => week.published);

  return (
    <main className="shell narrow">
      <Link href="/" className="backLink">← All weeks</Link>

      <header className="weekHero simpleWeekHero">
        <div>
          <p className="eyebrow">COMPLETED WEEKS</p>
          <h1>Ready to Open</h1>
          <p className="unitLabel">Every week that&apos;s published so far, in one place</p>
        </div>
      </header>

      {completedWeeks.length === 0 ? (
        <div className="emptyState compact">
          <div className="emptyIcon">✅</div>
          <h2>No weeks published yet</h2>
          <p>Weeks you publish will show up here.</p>
        </div>
      ) : (
        <div className="weekGrid">
          {completedWeeks.map((week) => (
            <Link className="weekCard tintBlue" href={`/week/${week.number}`} key={week.number}>
              <div className="weekTop">
                <span className="weekNumber">WEEK {week.number}</span>
                <span className="weekStatus weekStatusReady">Open ✓</span>
              </div>
              <h3>{week.title}</h3>
              <p>{week.unit}</p>
            </Link>
          ))}
        </div>
      )}
    </main>
  );
}
