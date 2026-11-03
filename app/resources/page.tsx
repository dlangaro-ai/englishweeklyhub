import Link from "next/link";
import { cookies } from "next/headers";
import { getAllWeeks } from "@/lib/getWeeks";
import { loadLibrary } from "@/lib/library";
import { EDITOR_COOKIE_NAME, isValidSessionCookie } from "@/lib/auth";
import { LibraryAddBar } from "@/components/ResourceAdmin";
import ResourceCard from "@/components/ResourceCard";
import { LibraryLink } from "@/lib/courseData";
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

  const items: LibraryLink[] = library.slice().sort((a, b) => idTimestamp(b.id) - idTimestamp(a.id));

  // Which weeks each item is used in (students only see published weeks).
  const usedIn = new Map<string, number[]>();
  for (const week of weeks) {
    if (!week.published && !isEditor) continue;
    for (const id of week.resourceIds ?? []) {
      usedIn.set(id, [...(usedIn.get(id) ?? []), week.number]);
    }
  }

  const weekOptions = weeks.map((week) => ({
    number: week.number,
    title: week.title,
    ids: week.resourceIds ?? []
  }));

  return (
    <main className="shell narrow">
      <Link href="/" className="backLink">← Home</Link>

      <header className="weekHero simpleWeekHero heroBlue">
        <div>
          <p className="eyebrow">RESOURCES & LIBRARY</p>
          <h1>Resources & Library</h1>
          <p className="unitLabel">Our library of websites, pictures and PDFs, ready to use any week</p>
        </div>
      </header>

      {isEditor && <LibraryAddBar />}

      {items.length === 0 ? (
        <div className="emptyState compact">
          <div className="emptyIcon"><Icon name="book" size={64} /></div>
          <h2>No resources added yet</h2>
          <p>{isEditor ? "Add your first resource above." : "Resources will show up here."}</p>
        </div>
      ) : (
        <ul className="resourcesPageGrid">
          {items.map((link, index) => (
            <ResourceCard
              key={link.id}
              link={link}
              index={index}
              weekNumbers={(usedIn.get(link.id) ?? []).sort((a, b) => a - b)}
              isEditor={isEditor}
              weekOptions={weekOptions}
            />
          ))}
        </ul>
      )}
      <Link href="/" className="homepageButton">
        🏠 Homepage
      </Link>
    </main>
  );
}
