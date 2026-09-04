import Link from "next/link";
import { Week } from "@/lib/courseData";
import { sanitizeRichText } from "@/lib/sanitizeHtml";
import { imageWidthStyle } from "@/lib/imageSize";

// The "This Week" folder page: the full weekly message, with a way back.
export default function SummaryView({ week }: { week: Week }) {
  return (
    <main className="shell narrow">
      <Link href={`/week/${week.number}`} className="backLink">
        ← Return to Week {week.number}
      </Link>

      <header className="skillHero">
        <div className="skillIcon large">✨</div>
        <div>
          <p className="eyebrow">WEEK {week.number} · THIS WEEK</p>
          <h1>What&apos;s Happening this week</h1>
        </div>
      </header>

      <section className="activityList">
        {week.summary ? (
          <article className="infoCard">
            <div className="infoCardBody">
              <div
                className="infoText richTextDisplay"
                dangerouslySetInnerHTML={{ __html: sanitizeRichText(week.summary) }}
              />
              {week.summaryImage && (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  className="bookImage"
                  src={week.summaryImage}
                  alt=""
                  style={imageWidthStyle(week.summaryImageWidth)}
                />
              )}
            </div>
          </article>
        ) : (
          <div className="emptyState compact">
            <div className="emptyIcon">✨</div>
            <h2>Nothing added yet</h2>
            <p>Check back soon for this week&apos;s update.</p>
          </div>
        )}
      </section>

      <Link href={`/week/${week.number}`} className="primaryButton returnButton">
        ← Return to Week {week.number}
      </Link>
    </main>
  );
}
