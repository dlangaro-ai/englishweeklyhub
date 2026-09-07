import Link from "next/link";
import { getAllWeeks } from "@/lib/getWeeks";
import { LibraryLink } from "@/lib/courseData";
import { imageWidthStyle } from "@/lib/imageSize";

export const dynamic = "force-dynamic";

// Pull the timestamp out of a "library-<timestamp>" id so newest additions
// can be shown first, without needing a separate createdAt field.
function idTimestamp(id: string): number {
  const match = /library-(\d+)/.exec(id);
  return match ? Number(match[1]) : 0;
}

export default async function ResourcesPage() {
  const weeks = await getAllWeeks();

  const allLinks: LibraryLink[] = weeks
    .flatMap((week) => week.libraryLinks ?? [])
    .sort((a, b) => idTimestamp(b.id) - idTimestamp(a.id));

  return (
    <main className="shell narrow">
      <Link href="/" className="backLink">← All weeks</Link>

      <header className="weekHero simpleWeekHero">
        <div>
          <p className="eyebrow">RESOURCES</p>
          <h1>All Resources</h1>
          <p className="unitLabel">Every website added across the whole hub, in one place</p>
        </div>
      </header>

      {allLinks.length === 0 ? (
        <div className="emptyState compact">
          <div className="emptyIcon">📖</div>
          <h2>No resources added yet</h2>
          <p>Websites added to any week&apos;s Resources card will show up here.</p>
        </div>
      ) : (
        <ul className="resourcesPageGrid">
          {allLinks.map((link) => (
            <li key={link.id} className="resourcesPageItem">
              {link.image ? (
                <a href={link.href} target="_blank" rel="noreferrer" className="libraryLinkImageWrap">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={link.image}
                    alt={link.title}
                    className="bookImage"
                    style={imageWidthStyle(link.imageWidth)}
                  />
                  <span className="libraryLinkCaption">{link.title}</span>
                </a>
              ) : (
                <a href={link.href} target="_blank" rel="noreferrer" className="textLink">
                  {link.title} ↗
                </a>
              )}
            </li>
          ))}
        </ul>
      )}
    </main>
  );
}
