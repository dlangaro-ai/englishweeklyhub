import Link from "next/link";
import { getAllWeeks } from "@/lib/getWeeks";
import { ExtraActivity } from "@/lib/courseData";
import { listActivityToHtml, sanitizeRichText } from "@/lib/sanitizeHtml";
import { imageWidthStyle } from "@/lib/imageSize";

export const dynamic = "force-dynamic";

const iconFor = (type?: string) => {
  if (type === "video") return "▶️";
  if (type === "pdf") return "📄";
  if (type === "link") return "🔗";
  if (type === "image") return "🖼️";
  if (type === "list") return "📋";
  return "⭐";
};

type ActivityWithWeek = ExtraActivity & { weekNumber: number };

export default async function ExtraActivitiesPage() {
  const weeks = await getAllWeeks();

  const allActivities: ActivityWithWeek[] = weeks.flatMap((week) =>
    week.extraActivities.map((activity) => ({ ...activity, weekNumber: week.number }))
  );

  return (
    <main className="shell narrow">
      <Link href="/" className="backLink">← All weeks</Link>

      <header className="weekHero simpleWeekHero">
        <div>
          <p className="eyebrow">EAGER LEARNERS</p>
          <h1>All Extra Activities</h1>
          <p className="unitLabel">Every bonus activity added across the whole hub, in one place</p>
        </div>
      </header>

      {allActivities.length === 0 ? (
        <div className="emptyState compact">
          <div className="emptyIcon">🎁</div>
          <h2>No extra activities yet</h2>
          <p>Activities added to any week&apos;s Eager Learners page will show up here.</p>
        </div>
      ) : (
        <section className="activityList">
          {allActivities.map((activity) => (
            <article className="activityCard" key={`${activity.weekNumber}-${activity.id}`}>
              <div className="activityIndex">{iconFor(activity.resourceType)}</div>
              <div className="activityBody">
                <span className="activityType">WEEK {activity.weekNumber}</span>
                <h2>{activity.title}</h2>
                {activity.description && (
                  <div
                    className="richTextDisplay"
                    dangerouslySetInnerHTML={{
                      __html: sanitizeRichText(
                        activity.resourceType === "list" ? listActivityToHtml(activity.description) : activity.description
                      )
                    }}
                  />
                )}
                {activity.resourceType === "image" && activity.href && (
                  <a href={activity.href} target="_blank" rel="noreferrer">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={activity.href}
                      alt={activity.title}
                      className="activityThumbnail"
                      style={imageWidthStyle(activity.imageWidth)}
                    />
                  </a>
                )}
                {activity.resourceType !== "image" && activity.href && (
                  <a href={activity.href} target="_blank" rel="noreferrer" className="textLink">
                    Open resource ↗
                  </a>
                )}
                <Link href={`/week/${activity.weekNumber}/skills`} className="textLink">
                  Open in Week {activity.weekNumber} →
                </Link>
              </div>
            </article>
          ))}
        </section>
      )}
    </main>
  );
}
