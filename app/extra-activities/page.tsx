import Link from "next/link";
import { cookies } from "next/headers";
import { getAllWeeks } from "@/lib/getWeeks";
import { getLatestPublishedWeek } from "@/lib/courseData";
import { EDITOR_COOKIE_NAME, isValidSessionCookie } from "@/lib/auth";
import Icon from "@/components/Icon";
import TeacherEmails from "@/components/TeacherEmails";
import WeekActivitiesFold from "@/components/WeekActivitiesFold";

export const dynamic = "force-dynamic";

export default async function ExtraActivitiesPage() {
  const weeks = await getAllWeeks();
  const cookieStore = await cookies();
  const isEditor = isValidSessionCookie(cookieStore.get(EDITOR_COOKIE_NAME)?.value);
  const latestPublishedWeek = getLatestPublishedWeek(weeks);

  // The current week comes first; the rest keep their usual order.
  const weeksWithActivities = weeks
    .filter((week) => week.extraActivities.length > 0 && (week.published || isEditor))
    .sort((a, b) => Number(b.number === latestPublishedWeek) - Number(a.number === latestPublishedWeek));

  return (
    <main className="shell narrow">
      <Link href="/" className="backLink">← Home</Link>

      <header className="weekHero simpleWeekHero heroOrange">
        <div>
          <p className="eyebrow">FOR EAGER LEARNERS</p>
          <h1>Extra Activities</h1>
          <p className="unitLabel">
            Click a week to open its extra activities. When you finish, <a href="#teachers">email your work to your English 2 teachers</a>.
          </p>
        </div>
      </header>

      {weeksWithActivities.length === 0 ? (
        <div className="emptyState compact">
          <div className="emptyIcon"><Icon name="gift" size={64} /></div>
          <h2>No extra activities yet</h2>
          <p>Extra activities for each week will show up here.</p>
        </div>
      ) : (
        <div className="weekFolds">
          {weeksWithActivities.map((week) => (
            <WeekActivitiesFold key={week.number} week={week} current={week.number === latestPublishedWeek} />
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
