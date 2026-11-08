import Link from "next/link";
import { getAllWeeks } from "@/lib/getWeeks";
import { getLatestPublishedWeek } from "@/lib/courseData";
import Icon from "@/components/Icon";
import PageIntro from "@/components/PageIntro";
import WeekCard from "@/components/WeekCard";

export const dynamic = "force-dynamic";

export const metadata = { title: "Completed Weeks" };

export default async function CompletedWeeksPage() {
  const weeks = await getAllWeeks();
  const completedWeeks = weeks.filter((week) => week.published).sort((a, b) => b.number - a.number);
  const latestPublishedWeek = getLatestPublishedWeek(weeks);

  return (
    <main className="shell">
      <Link href="/" className="backLink">← Home</Link>

      <PageIntro
        title="Completed Weeks"
        openCount={completedWeeks.length}
        totalCount={weeks.length}
        text="Every week that's published so far, in one place"
      />

      {completedWeeks.length === 0 ? (
        <div className="emptyState compact">
          <div className="emptyIcon"><Icon name="check" size={64} /></div>
          <h2>No weeks published yet</h2>
          <p>Weeks you publish will show up here.</p>
        </div>
      ) : (
        <div className="weekTileGrid weekTileList">
          {completedWeeks.map((week) => (
            <WeekCard key={week.number} week={week} isNow={week.number === latestPublishedWeek} clickable />
          ))}
        </div>
      )}
      <Link href="/" className="homepageButton">
        🏠 Homepage
      </Link>
    </main>
  );
}
