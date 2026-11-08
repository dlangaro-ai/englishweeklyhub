"use client";

import Link from "next/link";
import { Week } from "@/lib/courseData";
import EditModeToggle from "./EditModeToggle";
import LineIcon, { LineIconName } from "./LineIcon";
import BreakingNews from "./BreakingNews";
import WeekTimeline from "./WeekTimeline";

// Each tile keeps the colour of the page it opens (same as the nav and the
// "Big news" buttons), just soft and flat.
const HOME_TABS: { href: string; label: string; icon: LineIconName; tint: string }[] = [
  { href: "/weeks", label: "All Weeks", icon: "calendar", tint: "navYellow" },
  { href: "/completed", label: "Completed", icon: "check", tint: "navGreen" },
  { href: "/vocabulary", label: "Vocabulary", icon: "abc", tint: "navPink" },
  { href: "/extra-activities", label: "Extra Credit", icon: "gift", tint: "navOrange" },
  { href: "/resources", label: "Resources", icon: "book", tint: "navBlue" },
  { href: "/study-tips", label: "Study Tips", icon: "bulb", tint: "navTeal" }
];

export default function CourseDashboard({ weeks, isEditor }: { weeks: Week[]; isEditor: boolean }) {
  const readyCount = weeks.filter((week) => week.published).length;

  return (
    <main className="shell">
      <div className="homeStatus">
        <div className="homeStatusMain">
          <h1 className="homeTitle">TEDANK<span>5</span> - My English Hub</h1>
          <span className="weeksOpenPill">{readyCount} of {weeks.length} weeks open</span>
        </div>
        <div className="homeStatusToggle">
          <EditModeToggle isEditor={isEditor} />
        </div>
      </div>

      <div className="homeExplore">
        <BreakingNews weeks={weeks} />

        <WeekTimeline weeks={weeks} isEditor={isEditor} />

        <h2 className="homeSectionTitle homeExploreTitle">Explore TEDANK5</h2>
        <nav className="homeMenu" aria-label="Main menu">
          {HOME_TABS.map((tab) => (
            <Link key={tab.href} href={tab.href} className={`homeMenuItem ${tab.tint}`}>
              <LineIcon name={tab.icon} size={38} />
              <span>{tab.label}</span>
            </Link>
          ))}
        </nav>
      </div>
    </main>
  );
}
