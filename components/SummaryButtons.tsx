import Link from "next/link";
import { SummaryButton } from "@/lib/courseData";

// Link buttons shown under a week's "What's happening this week" message.
// Site pages ("/study-tips") open in place; other websites open in a new tab.
export default function SummaryButtons({ buttons }: { buttons: SummaryButton[] }) {
  if (buttons.length === 0) return null;

  return (
    <div className="summaryButtons">
      {buttons.map((button) =>
        button.href.startsWith("/") ? (
          <Link key={button.id} href={button.href} className="summaryButton">
            {button.label}
          </Link>
        ) : (
          <a key={button.id} href={button.href} target="_blank" rel="noreferrer" className="summaryButton">
            {button.label} <span aria-hidden="true">↗</span>
          </a>
        )
      )}
    </div>
  );
}
