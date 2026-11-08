import Link from "next/link";
import { cookies } from "next/headers";
import { getAllWeeks } from "@/lib/getWeeks";
import { getLatestPublishedWeek } from "@/lib/courseData";
import { EDITOR_COOKIE_NAME, isValidSessionCookie } from "@/lib/auth";
import Icon from "@/components/Icon";
import TeacherEmails from "@/components/TeacherEmails";
import WeekCard from "@/components/WeekCard";

export const dynamic = "force-dynamic";

export default async function ExtraActivitiesPage() {
  const weeks = await getAllWeeks();
  const cookieStore = await cookies();
  const isEditor = isValidSessionCookie(cookieStore.get(EDITOR_COOKIE_NAME)?.value);
  const latestPublishedWeek = getLatestPublishedWeek(weeks);

  // Newest week at the top, then each older week below it.
  const weeksWithActivities = weeks
    .filter((week) => week.extraActivities.length > 0 && (week.published || isEditor))
    .sort((a, b) => b.number - a.number);

  return (
    <main className="shell">
      <Link href="/" className="backLink">← Home</Link>

      <header className="weekHero simpleWeekHero heroOrange">
        <div>
          <p className="eyebrow">FOR EAGER LEARNERS</p>
          <h1>Extra Credit Activities</h1>
          <p className="unitLabel">
            Pick a week to see its Extra Credit activities. When you finish, <a href="#teachers">email your work to your English 2 teachers</a>.
          </p>
        </div>
      </header>

      {weeksWithActivities.length === 0 ? (
        <div className="emptyState compact">
          <div className="emptyIcon"><Icon name="gift" size={64} /></div>
          <h2>No Extra Credit activities yet</h2>
          <p>Extra Credit activities for each week will show up here.</p>
        </div>
      ) : (
        <div className="weekTileGrid weekTileList">
          {weeksWithActivities.map((week) => (
            <WeekCard
              key={week.number}
              week={week}
              isNow={week.number === latestPublishedWeek}
              clickable
              as="h3"
              href={`/week/${week.number}/skills`}
              footer={
                <>
                  {week.extraActivities.length} {week.extraActivities.length === 1 ? "activity" : "activities"}{" "}
                  <span aria-hidden="true">→</span>
                </>
              }
            />
          ))}
        </div>
      )}
      <TeacherEmails id="teachers" />

      <Link href="/" className="homepageButton">
        🏠 Homepage
      </Link>
    </main>
  );
}
