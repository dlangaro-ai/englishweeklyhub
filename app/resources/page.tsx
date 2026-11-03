import Link from "next/link";
import { cookies } from "next/headers";
import { getAllWeeks } from "@/lib/getWeeks";
import { loadLibrary } from "@/lib/library";
import { getLatestPublishedWeek, LibraryLink } from "@/lib/courseData";
import { EDITOR_COOKIE_NAME, isValidSessionCookie } from "@/lib/auth";
import { LibraryAddBar } from "@/components/ResourceAdmin";
import ResourceCard from "@/components/ResourceCard";
import WeekCard from "@/components/WeekCard";
import Icon from "@/components/Icon";

export const dynamic = "force-dynamic";

// Pull the timestamp out of a "library-<timestamp>" id so newest additions
// can be shown first, without needing a separate createdAt field.
function idTimestamp(id: string): number {
  const match = /library-(\d+)/.exec(id);
  return match ? Number(match[1]) : 0;
}

export default async function ResourcesPage() {
  const [weeks, library] = await Promise.all([getAllWeeks(), loadLibrary()]);
  const cookieStore = await cookies();
  const isEditor = isValidSessionCookie(cookieStore.get(EDITOR_COOKIE_NAME)?.value);
  const latestPublishedWeek = getLatestPublishedWeek(weeks);

  const items: LibraryLink[] = library.slice().sort((a, b) => idTimestamp(b.id) - idTimestamp(a.id));

  // Which weeks each item is used in (students only see published weeks).
  const usedIn = new Map<string, number[]>();
  for (const week of weeks) {
    if (!week.published && !isEditor) continue;
    for (const id of week.resourceIds ?? []) {
      usedIn.set(id, [...(usedIn.get(id) ?? []), week.number]);
    }
  }

  // The current week comes first; the rest keep their usual order.
  const weeksWithResources = weeks
    .filter((week) => (week.libraryLinks ?? []).length > 0 && (week.published || isEditor))
    .sort((a, b) => Number(b.number === latestPublishedWeek) - Number(a.number === latestPublishedWeek));

  // Library items that aren't on any week yet.
  const unassigned = items.filter((item) => !usedIn.has(item.id));

  const weekOptions = weeks.map((week) => ({
    number: week.number,
    title: week.title,
    ids: week.resourceIds ?? []
  }));

  return (
    <main className="shell">
      <Link href="/" className="backLink">← Home</Link>

      <header className="weekHero simpleWeekHero heroBlue">
        <div>
          <p className="eyebrow">RESOURCES & LIBRARY</p>
          <h1>Resources & Library</h1>
          <p className="unitLabel">Pick a week to see its websites, pictures and PDFs</p>
        </div>
      </header>

      {isEditor && <LibraryAddBar />}

      {weeksWithResources.length === 0 && unassigned.length === 0 ? (
        <div className="emptyState compact">
          <div className="emptyIcon"><Icon name="book" size={64} /></div>
          <h2>No resources added yet</h2>
          <p>{isEditor ? "Add your first resource above." : "Resources will show up here."}</p>
        </div>
      ) : (
        <>
          {weeksWithResources.length > 0 && (
            <div className="weekTileGrid">
              {weeksWithResources.map((week) => {
                const count = (week.libraryLinks ?? []).length;

                return (
                  <WeekCard
                    key={week.number}
                    week={week}
                    isNow={week.number === latestPublishedWeek}
                    clickable
                    as="h3"
                    href={`/week/${week.number}/resources`}
                    footer={
                      <>
                        {count} {count === 1 ? "resource" : "resources"} <span aria-hidden="true">→</span>
                      </>
                    }
                  />
                );
              })}
            </div>
          )}

          {unassigned.length > 0 && (
            <section className="weekTileSection">
              <div className="weekTileSectionHead">
                <h2>{weeksWithResources.length > 0 ? "More in the library" : "Library"}</h2>
                <span>{unassigned.length} {unassigned.length === 1 ? "resource" : "resources"}</span>
              </div>

              <ul className="resourcesPageGrid">
                {unassigned.map((link, index) => (
                  <ResourceCard
                    key={link.id}
                    link={link}
                    index={index}
                    weekNumbers={[]}
                    isEditor={isEditor}
                    weekOptions={weekOptions}
                  />
                ))}
              </ul>
            </section>
          )}
        </>
      )}
      <Link href="/" className="homepageButton">
        🏠 Homepage
      </Link>
    </main>
  );
}
