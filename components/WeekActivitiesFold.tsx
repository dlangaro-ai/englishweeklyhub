import Link from "next/link";
import { Week } from "@/lib/courseData";
import { listActivityToHtml, sanitizeRichText } from "@/lib/sanitizeHtml";
import { imageWidthStyle } from "@/lib/imageSize";
import Icon, { IconName } from "./Icon";

const iconNameFor = (type?: string): IconName => {
  if (type === "video") return "play";
  if (type === "pdf") return "pdf";
  if (type === "link") return "link";
  if (type === "image") return "picture";
  if (type === "list") return "list";
  return "star";
};

// One week on the Extra Activities page: click the card and its activities
// open right underneath (same fold-out as the About Us cards).
export default function WeekActivitiesFold({ week, current }: { week: Week; current: boolean }) {
  const count = week.extraActivities.length;

  return (
    <details className={`infoCard aboutFold weekFold${current ? " weekFoldCurrent" : ""}`}>
      <summary className="aboutFoldSummary">
        <span className="weekFoldNumber">
          <small>WEEK</small>
          {week.number}
        </span>
        <div className="infoCardBody">
          <p className="infoLabel">{week.unit}</p>
          <h2>{week.title}</h2>
        </div>
        <span className="activityCountButton">
          <span className="activityCountNumber">{count}</span>
          <span>{count === 1 ? "activity" : "activities"}</span>
        </span>
        <span className="aboutFoldChevron" aria-hidden="true">▾</span>
      </summary>

      <div className="aboutFoldBody weekFoldBody">
        {week.extraActivities.map((activity, index) => (
          <article className="weekFoldActivity" key={activity.id}>
            <span className="weekFoldActivityIcon"><Icon name={iconNameFor(activity.resourceType)} size={26} /></span>
            <div>
              <span className="activityType">ACTIVITY {index + 1}</span>
              <h3>{activity.title}</h3>
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
            </div>
          </article>
        ))}
        <Link href={`/week/${week.number}/skills`} className="weekFoldMore">
          Open Week {week.number} activities page →
        </Link>
      </div>
    </details>
  );
}
