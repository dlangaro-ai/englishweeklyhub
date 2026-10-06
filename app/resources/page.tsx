import Link from "next/link";
import { getAllWeeks } from "@/lib/getWeeks";
import { LibraryLink } from "@/lib/courseData";

export const dynamic = "force-dynamic";

// Pull the timestamp out of a "library-<timestamp>" id so newest additions
// can be shown first, without needing a separate createdAt field.
function idTimestamp(id: string): number {
  const match = /library-(\d+)/.exec(id);
  return match ? Number(match[1]) : 0;
}

type ResourceItem = Omit<LibraryLink, "resourceType"> & {
  resourceType?: LibraryLink["resourceType"] | "week";
  week: number;
};

const TYPE_LABELS = {
  link: { icon: "🌐", label: "Website", cta: "Visit" },
  image: { icon: "🖼️", label: "Image", cta: "View" },
  pdf: { icon: "📄", label: "PDF", cta: "Open" },
  week: { icon: "📖", label: "Week resources", cta: "Open week" }
} as const;

const TINTS = ["resBlue", "resSun", "resPink", "resPurple"];

export default async function ResourcesPage() {
  const weeks = await getAllWeeks();

  // A week's main Resources picture is a resource too — it opens that week's
  // Resources card, so replacing the picture there updates this page as well.
  const weekPictures: ResourceItem[] = weeks
    .filter((week) => week.libraryImage && week.published)
    .sort((a, b) => b.number - a.number)
    .map((week) => ({
      id: `week-picture-${week.number}`,
      title: `Week ${week.number} resources`,
      href: `/week/${week.number}#library`,
      image: week.libraryImage,
      resourceType: "week" as const,
      week: week.number
    }));

  const weekLinks: ResourceItem[] = weeks
    .flatMap((week) => (week.libraryLinks ?? []).map((link) => ({ ...link, week: week.number })))
    .sort((a, b) => idTimestamp(b.id) - idTimestamp(a.id));

  const allLinks = [...weekPictures, ...weekLinks];

  return (
    <main className="shell narrow">
      <Link href="/" className="backLink">← All weeks</Link>

      <header className="weekHero simpleWeekHero">
        <div>
          <p className="eyebrow">RESOURCES</p>
          <h1>All Resources</h1>
          <p className="unitLabel">Every picture, website and PDF added across the whole hub, in one place</p>
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
          {allLinks.map((link, index) => {
            const type = TYPE_LABELS[link.resourceType ?? "link"];
            const title = link.title.replace(/^📄\s*/, "");

            return (
              <li key={link.id}>
                <a
                  href={link.href}
                  target={link.resourceType === "week" ? undefined : "_blank"}
                  rel="noreferrer"
                  className={`resourceCard ${TINTS[index % TINTS.length]}`}
                >
                  <div className="resourceCardTop">
                    <span className="resourceBadge">
                      <span aria-hidden="true">{type.icon}</span> {type.label}
                    </span>
                    <span className="resourceWeek">WEEK {link.week}</span>
                  </div>
                  {link.image ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={link.image} alt="" className="resourceThumb" />
                  ) : (
                    <div className="resourceIcon" aria-hidden="true">{type.icon}</div>
                  )}
                  <h3 className="resourceTitle">{title}</h3>
                  <span className="resourceOpen">{type.cta} ↗</span>
                </a>
              </li>
            );
          })}
        </ul>
      )}
    </main>
  );
}
