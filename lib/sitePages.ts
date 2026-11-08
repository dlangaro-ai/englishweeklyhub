import type { IconName } from "@/components/Icon";

// Pages of this site a teacher can point a button at (e.g. from a week's
// "What's happening this week" message). The icon and colour match the page's
// tile on the home menu, so a button looks like the page it leads to.
export const SITE_PAGES: { href: string; label: string; icon: IconName; tint: string }[] = [
  { href: "/weeks", label: "All Weeks", icon: "calendar", tint: "navYellow" },
  { href: "/completed", label: "Completed Weeks", icon: "check", tint: "navGreen" },
  { href: "/vocabulary", label: "Vocabulary", icon: "abc", tint: "navPink" },
  { href: "/extra-activities", label: "Extra Credit", icon: "gift", tint: "navOrange" },
  { href: "/resources", label: "Resources & Library", icon: "book", tint: "navBlue" },
  { href: "/study-tips", label: "Study Tips", icon: "bulb", tint: "navTeal" },
  { href: "/about", label: "About Us", icon: "chat", tint: "navPurple" }
];

// Parts of one week a button can jump to (from that week's "What's happening
// this week" message): its Books, Homework and Library boxes, and its Extra
// Credit activities page.
export function weekSectionPages(weekNumber: number): { href: string; label: string; icon: IconName; tint: string }[] {
  const base = `/week/${weekNumber}`;
  return [
    { href: `${base}#books`, label: "Books & Pages", icon: "books", tint: "navBlue" },
    { href: `${base}#homework`, label: "Homework", icon: "house", tint: "navOrange" },
    { href: `${base}/skills`, label: "Extra Credit Activities", icon: "gift", tint: "navPink" },
    { href: `${base}#library`, label: "Library", icon: "book", tint: "navBlue" }
  ];
}
