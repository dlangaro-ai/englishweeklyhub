"use client";

import Link from "next/link";
import { Week } from "@/lib/courseData";
import EditModeToggle from "./EditModeToggle";
import TedAnk5Logo from "./TedAnk5Logo";
import Icon, { IconName } from "./Icon";
import BreakingNews from "./BreakingNews";

const HOME_TABS: { href: string; label: string; icon: IconName; tint: string }[] = [
  { href: "/weeks", label: "All Weeks", icon: "calendar", tint: "navYellow" },
  { href: "/completed", label: "Completed Weeks", icon: "check", tint: "navGreen" },
  { href: "/vocabulary", label: "Vocabulary", icon: "abc", tint: "navPink" },
  { href: "/extra-activities", label: "Extra Activities", icon: "gift", tint: "navOrange" },
  { href: "/resources", label: "Resources & Library", icon: "book", tint: "navBlue" },
  { href: "/study-tips", label: "Study Tips", icon: "bulb", tint: "navTeal" },
  { href: "/about", label: "About Us", icon: "chat", tint: "navPurple" }
];

export default function CourseDashboard({ weeks, isEditor }: { weeks: Week[]; isEditor: boolean }) {
  const readyCount = weeks.filter((week) => week.published).length;

  return (
    <main className="shell homeShell">
      <header className="hero">
        <div className="heroTitleBlock">
          <h1 className="srOnly">TEDANK5 — My English Hub</h1>
          <p className="eyebrow">GRADE 5 ENGLISH · {weeks.length} WEEKS</p>
          <a
            href="#explore"
            className="heroLogoLink"
            title="Show this week's news and the menu"
            onClick={(event) => {
              event.preventDefault();
              const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
              document.getElementById("explore")?.scrollIntoView({ behavior: reduceMotion ? "auto" : "smooth" });
            }}
          >
            <TedAnk5Logo className="heroLogo" />
          </a>
          <div className="heroProgress">
            <div className="heroProgressTrack">
              <div
                className="heroProgressFill"
                style={{ width: `${weeks.length ? (readyCount / weeks.length) * 100 : 0}%` }}
              />
            </div>
            <span className="heroProgressLabel"><span aria-hidden="true">🚀 </span>{readyCount} of {weeks.length} weeks open</span>
          </div>
        </div>
        <div className="heroRight">
          <EditModeToggle isEditor={isEditor} />
        </div>
      </header>

      <div id="explore" className="homeExplore">
        <BreakingNews weeks={weeks} />

        <nav className="homeTabs" aria-label="Main menu">
          {HOME_TABS.map((tab) => (
            <Link key={tab.href} href={tab.href} className={`homeTab ${tab.tint}`}>
              <span className="homeTabIcon"><Icon name={tab.icon} size={44} /></span>
              <span className="homeTabLabel">{tab.label}</span>
            </Link>
          ))}
        </nav>
      </div>

    </main>
  );
}
