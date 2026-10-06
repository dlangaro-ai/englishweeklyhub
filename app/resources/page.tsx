import Link from "next/link";
import { cookies } from "next/headers";
import { getAllWeeks } from "@/lib/getWeeks";
import { loadLibrary } from "@/lib/library";
import { EDITOR_COOKIE_NAME, isValidSessionCookie } from "@/lib/auth";
import { LibraryAddBar, ResourceAdmin } from "@/components/ResourceAdmin";
import { LibraryLink } from "@/lib/courseData";
import { normalizeUrl } from "@/lib/normalizeUrl";

export const dynamic = "force-dynamic";

// Pull the timestamp out of a "library-<timestamp>" id so newest additions
// can be shown first, without needing a separate createdAt field.
function idTimestamp(id: string): number {
  const match = /library-(\d+)/.exec(id);
  return match ? Number(match[1]) : 0;
}

const TYPE_LABELS = {
  link: { icon: "🌐", label: "Website", cta: "Visit" },
  image: { icon: "🖼️", label: "Image", cta: "View" },
  pdf: { icon: "📄", label: "PDF", cta: "Open" }
} as const;

const TINTS = ["resBlue", "resSun", "resPink", "resPurple"];

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
      <Link href="/" className="backLink">← All weeks</Link>

      <header className="weekHero simpleWeekHero">
        <div>
          <p className="eyebrow">RESOURCES</p>
          <h1>All Resources</h1>
          <p className="unitLabel">Our library of websites, pictures and PDFs, ready to use any week</p>
        </div>
      </header>

      {isEditor && <LibraryAddBar />}

      {items.length === 0 ? (
        <div className="emptyState compact">
          <div className="emptyIcon">📖</div>
          <h2>No resources added yet</h2>
          <p>{isEditor ? "Add your first resource above." : "Resources will show up here."}</p>
        </div>
      ) : (
        <ul className="resourcesPageGrid">
          {items.map((link, index) => {
            const type = TYPE_LABELS[link.resourceType ?? "link"];
            const title = link.title.replace(/^📄\s*/, "");
            const weekNumbers = (usedIn.get(link.id) ?? []).sort((a, b) => a - b);

            return (
              <li key={link.id}>
                <div className={`resourceCard ${TINTS[index % TINTS.length]}`}>
                  <a
                    href={normalizeUrl(link.href)}
                    target="_blank"
                    rel="noreferrer"
                    className="resourceCardLink"
                  >
                    <div className="resourceCardTop">
                      <span className="resourceBadge">
                        <span aria-hidden="true">{type.icon}</span> {type.label}
                      </span>
                      <span className="resourceWeek">
                        {weekNumbers.length > 0 ? `WEEK ${weekNumbers.join(", ")}` : "LIBRARY"}
                      </span>
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
                  {isEditor && <ResourceAdmin id={link.id} weeks={weekOptions} />}
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </main>
  );
}
