import Link from "next/link";
import { cookies } from "next/headers";
import { getAllWeeks } from "@/lib/getWeeks";
import { EDITOR_COOKIE_NAME, isValidSessionCookie } from "@/lib/auth";

export const dynamic = "force-dynamic";

export default async function ExtraActivitiesPage() {
  const weeks = await getAllWeeks();
  const cookieStore = await cookies();
  const isEditor = isValidSessionCookie(cookieStore.get(EDITOR_COOKIE_NAME)?.value);

  const weeksWithActivities = weeks.filter(
    (week) => week.extraActivities.length > 0 && (week.published || isEditor)
  );

  return (
    <main className="shell narrow">
      <Link href="/" className="backLink">← All weeks</Link>

      <header className="weekHero simpleWeekHero">
        <div>
          <p className="eyebrow">EAGER LEARNERS</p>
          <h1>Extra Activities</h1>
          <p className="unitLabel">
            Pick a week to see its bonus activities. Send them to your English 2 Teachers by email.
          </p>
        </div>
      </header>

      {weeksWithActivities.length === 0 ? (
        <div className="emptyState compact">
          <div className="emptyIcon">🎁</div>
          <h2>No extra activities yet</h2>
          <p>Activities added to any week&apos;s Eager Learners page will show up here.</p>
        </div>
      ) : (
        <div className="weekGrid">
          {weeksWithActivities.map((week) => (
            <Link className="weekCard tintSun" href={`/week/${week.number}/skills`} key={week.number}>
              <div className="weekTop">
                <span className="weekNumber">WEEK {week.number}</span>
                <span className="weekStatus">
                  {week.extraActivities.length} {week.extraActivities.length === 1 ? "activity" : "activities"}
                </span>
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
