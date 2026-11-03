import Link from "next/link";
import { Week } from "@/lib/courseData";
import Icon from "./Icon";
import ResourceCard from "./ResourceCard";
import { WeekOption } from "./ResourceAdmin";

// One week's resources: the websites, pictures and PDFs picked for it, as
// candy-coloured cards (the same look as that week's Extra Activities page).
export default function WeekResourcesView({
  week,
  isEditor,
  weekOptions
}: {
  week: Week;
  isEditor: boolean;
  weekOptions: WeekOption[];
}) {
  const items = week.libraryLinks ?? [];

  return (
    <main className="shell narrow">
      <Link href={`/week/${week.number}`} className="backLink">← Week {week.number}</Link>

      <header className="skillHero">
        <div className="skillIcon large"><Icon name="book" size={72} /></div>
        <div>
          <p className="eyebrow">WEEK {week.number} · RESOURCES &amp; LIBRARY</p>
          <h1>Resources &amp; Library</h1>
          <p className="heroText">Websites, pictures and PDFs picked for this week.</p>
        </div>
      </header>

      {items.length === 0 ? (
        <div className="emptyState compact">
          <div className="emptyIcon"><Icon name="book" size={64} /></div>
          <h2>No resources for this week yet</h2>
          <p>{isEditor ? "Add some from the week page." : "Resources will show up here."}</p>
        </div>
      ) : (
        <ul className="resourcesPageGrid">
          {items.map((link, index) => (
            <ResourceCard
              key={link.id}
              link={link}
              index={index}
              weekNumbers={[week.number]}
              isEditor={isEditor}
              weekOptions={weekOptions}
            />
          ))}
        </ul>
      )}
    </main>
  );
}
