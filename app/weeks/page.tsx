import Link from "next/link";
import { cookies } from "next/headers";
import { getAllWeeks } from "@/lib/getWeeks";
import { EDITOR_COOKIE_NAME, isValidSessionCookie } from "@/lib/auth";
import PageIntro from "@/components/PageIntro";
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

      <PageIntro
        title="All Weeks"
        openCount={readyCount}
        totalCount={weeks.length}
        text="Pick your week to find its topic, books, homework and fun activities"
      />

      <WeekGrid weeks={weeks} isEditor={isEditor} />
      <Link href="/" className="homepageButton">
        🏠 Homepage
      </Link>
    </main>
  );
}
