import Link from "next/link";
import { cookies } from "next/headers";
import { getAllWeeks } from "@/lib/getWeeks";
import { EDITOR_COOKIE_NAME, isValidSessionCookie } from "@/lib/auth";
import WeekGrid from "@/components/WeekGrid";

export const dynamic = "force-dynamic";

export const metadata = { title: "All Weeks" };

export default async function WeeksPage() {
  const weeks = await getAllWeeks();
  const cookieStore = await cookies();
  const isEditor = isValidSessionCookie(cookieStore.get(EDITOR_COOKIE_NAME)?.value);
  const readyCount = weeks.filter((week) => week.published).length;

  return (
    <main className="shell">
      <Link href="/" className="backLink">← Home</Link>

      <header className="weekHero simpleWeekHero heroYellow">
        <div>
          <p className="eyebrow">GRADE 5 ENGLISH · {weeks.length} WEEKS</p>
          <h1>All Weeks</h1>
          <p className="unitLabel">
            Pick your week to find its topic, books, homework and fun activities · {readyCount} open so far
          </p>
        </div>
      </header>

      <WeekGrid weeks={weeks} isEditor={isEditor} />
    </main>
  );
}
