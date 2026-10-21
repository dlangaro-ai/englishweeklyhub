import type { ReactNode } from "react";

// The site's own sticker-style icon set: bright flat colours, a chunky navy
// outline and a little white shine, so every icon feels like part of one
// friendly family (and looks the same on every phone, unlike emoji).

const NAVY = "#25304d";
const YELLOW = "#ffc93c";
const ORANGE = "#ff8a3d";
const PINK = "#ff6b9d";
const PINK_LIGHT = "#ff9dbd";
const BLUE = "#4da3ff";
const GREEN = "#2bc48a";
const PURPLE = "#7c6cff";
const RED = "#ff5a5f";
const WHITE = "#ffffff";
const CREAM = "#fff6e0";

function starPath(cx: number, cy: number, outer: number, inner = outer * 0.48) {
  const points: string[] = [];
  for (let i = 0; i < 10; i++) {
    const r = i % 2 === 0 ? outer : inner;
    const angle = (Math.PI / 5) * i - Math.PI / 2;
    points.push(`${(cx + r * Math.cos(angle)).toFixed(2)},${(cy + r * Math.sin(angle)).toFixed(2)}`);
  }
  return `M${points.join("L")}Z`;
}

const ICONS = {
  check: (
    <>
      <circle cx="24" cy="24" r="17" fill={GREEN} />
      <path d="M15.5 24.5l6 6L33 18.5" fill="none" stroke={WHITE} strokeWidth="4.5" />
      <path d="M13 17a13 13 0 0 1 7-6" fill="none" stroke={WHITE} strokeWidth="2.5" opacity="0.6" />
    </>
  ),
  abc: (
    <>
      <g transform="rotate(-8 15 29)">
        <rect x="5" y="19" width="19" height="19" rx="4" fill={YELLOW} />
        <text x="14.5" y="34" textAnchor="middle" fontSize="15" fontWeight="800" fill={NAVY} stroke="none" fontFamily="Arial, sans-serif">A</text>
      </g>
      <g transform="rotate(8 33 21)">
        <rect x="23.5" y="10" width="19" height="19" rx="4" fill={PINK} />
        <text x="33" y="25" textAnchor="middle" fontSize="15" fontWeight="800" fill={WHITE} stroke="none" fontFamily="Arial, sans-serif">b</text>
      </g>
      <path d="M8.5 22.5h4" stroke={WHITE} strokeWidth="2" opacity="0.7" />
    </>
  ),
  gift: (
    <>
      <path d="M24 16c-3-8-12-9-12-3 0 3 5 3 12 3zM24 16c3-8 12-9 12-3 0 3-5 3-12 3z" fill={YELLOW} />
      <rect x="10" y="23" width="28" height="17" rx="3" fill={PINK} />
      <rect x="7.5" y="16" width="33" height="8" rx="3" fill={PINK_LIGHT} />
      <path d="M24 16v24" stroke={NAVY} strokeWidth="7.5" />
      <path d="M24 16.5v23" stroke={YELLOW} strokeWidth="4" />
      <path d="M12.5 27v8" stroke={WHITE} strokeWidth="2.5" opacity="0.7" />
    </>
  ),
  book: (
    <>
      <path d="M5 14v24c7-2 13-1.5 19 2 6-3.5 12-4 19-2V14" fill={BLUE} />
      <path d="M24 15c-5-4-11-4.5-16-3v23c5-1.5 11-1 16 3zM24 15c5-4 11-4.5 16-3v23c-5-1.5-11-1-16 3z" fill={WHITE} />
      <path d="M12 18c3-.7 6-.5 8 .6M12 23c3-.7 6-.5 8 .6M28 18.6c2-1.1 5-1.3 8-.6M28 23.6c2-1.1 5-1.3 8-.6" stroke={BLUE} strokeWidth="2" />
    </>
  ),
  chat: (
    <>
      <path d="M22 20h14a7 7 0 0 1 7 7v4a7 7 0 0 1-7 7h-1l1 5-6-5h-1a7 7 0 0 1-7-7z" fill={YELLOW} />
      <path d="M12 7h16a8 8 0 0 1 8 8v4a8 8 0 0 1-8 8h-8l-8 6v-6a8 8 0 0 1-8-8v-4a8 8 0 0 1 8-8z" fill={PURPLE} />
      <circle cx="13.5" cy="17" r="2.2" fill={WHITE} stroke="none" />
      <circle cx="20" cy="17" r="2.2" fill={WHITE} stroke="none" />
      <circle cx="26.5" cy="17" r="2.2" fill={WHITE} stroke="none" />
    </>
  ),
  sparkle: (
    <>
      <path d="M21 5c1.6 10 4.4 12.8 14 14.5-9.6 1.7-12.4 4.5-14 14.5-1.6-10-4.4-12.8-14-14.5C16.6 17.8 19.4 15 21 5z" fill={YELLOW} />
      <path d="M36 27c.7 4.4 2 5.6 6 6.3-4 .7-5.3 2-6 6.3-.7-4.3-2-5.6-6-6.3 4-.7 5.3-1.9 6-6.3z" fill={PINK} />
      <circle cx="10" cy="38" r="3" fill={BLUE} />
      <path d="M17.5 15.5l2-4" stroke={WHITE} strokeWidth="2" opacity="0.8" />
    </>
  ),
  books: (
    <>
      <rect x="7" y="32" width="34" height="8" rx="2.5" fill={BLUE} />
      <rect x="10" y="23" width="30" height="9" rx="2.5" fill={ORANGE} />
      <rect x="8" y="15" width="28" height="8" rx="2.5" fill={GREEN} />
      <path d="M34 34.5v3M36.5 25.5v4M31 17.5v3" stroke={WHITE} strokeWidth="2" />
    </>
  ),
  house: (
    <>
      <path d="M31 9h5v9l-5-4z" fill={RED} />
      <rect x="11" y="22" width="26" height="18" rx="2" fill={YELLOW} />
      <path d="M5 24.5L24 8l19 16.5" fill={RED} />
      <path d="M20 40v-8a4 4 0 0 1 8 0v8" fill={BLUE} />
      <rect x="29.5" y="25.5" width="5" height="5" rx="1" fill={WHITE} />
    </>
  ),
  backpack: (
    <>
      <path d="M19 13c0-7 10-7 10 0" fill="none" />
      <rect x="11" y="12" width="26" height="29" rx="9" fill={ORANGE} />
      <path d="M11 25h26" stroke={NAVY} strokeWidth="2.5" />
      <rect x="16" y="27" width="16" height="11" rx="4" fill={YELLOW} />
      <path d="M21 31.5h6" stroke={NAVY} strokeWidth="2.5" />
      <path d="M15.5 17v4" stroke={WHITE} strokeWidth="2.5" opacity="0.7" />
    </>
  ),
  notebook: (
    <>
      <rect x="12" y="6" width="27" height="36" rx="3.5" fill={GREEN} />
      <rect x="18" y="12" width="15" height="8" rx="2" fill={WHITE} />
      <path d="M21 15h9M21 17.5h6" stroke={GREEN} strokeWidth="1.6" />
      {[12, 19, 26, 33].map((y) => (
        <path key={y} d={`M9 ${y}h6`} stroke={NAVY} strokeWidth="2.5" />
      ))}
      <path d="M35 26v11" stroke={WHITE} strokeWidth="2.5" opacity="0.6" />
    </>
  ),
  libraryBook: (
    <>
      <path d="M28 38v7l3-2.5 3 2.5v-7" fill={PINK} />
      <rect x="12" y="6" width="25" height="33" rx="3.5" fill={PURPLE} />
      <path d="M17.5 6v33" stroke={NAVY} strokeWidth="2.5" />
      <path d={starPath(27.5, 21, 6.5)} fill={YELLOW} />
      <path d="M33 10v8" stroke={WHITE} strokeWidth="2.5" opacity="0.6" />
    </>
  ),
  review: (
    <>
      <rect x="8" y="6" width="27" height="35" rx="3.5" fill={WHITE} />
      <path d={starPath(14.5, 14, 4)} fill={YELLOW} strokeWidth="1.6" />
      <path d={starPath(21.5, 14, 4)} fill={YELLOW} strokeWidth="1.6" />
      <path d={starPath(28.5, 14, 4)} fill={YELLOW} strokeWidth="1.6" />
      <path d="M13 24h17M13 30h11" stroke={PURPLE} strokeWidth="2.5" />
      <g transform="rotate(40 34 33)">
        <rect x="30.5" y="18" width="7" height="22" rx="1.5" fill={ORANGE} />
        <path d="M30.5 40l3.5 6 3.5-6z" fill={CREAM} />
        <rect x="30.5" y="15" width="7" height="4" rx="1.5" fill={PINK} />
      </g>
    </>
  ),
  pdf: (
    <>
      <path d="M11 5h17l10 10v26a3 3 0 0 1-3 3H11a3 3 0 0 1-3-3V8a3 3 0 0 1 3-3z" fill={WHITE} />
      <path d="M28 5v10h10" fill={CREAM} />
      <rect x="4" y="22" width="30" height="13" rx="3" fill={RED} />
      <text x="19" y="32.5" textAnchor="middle" fontSize="10" fontWeight="900" fill={WHITE} stroke="none" fontFamily="Arial, sans-serif">PDF</text>
    </>
  ),
  play: (
    <>
      <rect x="5" y="10" width="38" height="28" rx="9" fill={RED} />
      <path d="M20 17.5v13l11-6.5z" fill={WHITE} />
      <path d="M10 16v6" stroke={WHITE} strokeWidth="2.5" opacity="0.6" />
    </>
  ),
  link: (
    <>
      <rect x="4.5" y="17" width="22" height="14" rx="7" fill="none" stroke={NAVY} strokeWidth="7" transform="rotate(-35 15.5 24)" />
      <rect x="4.5" y="17" width="22" height="14" rx="7" fill="none" stroke={BLUE} strokeWidth="3" transform="rotate(-35 15.5 24)" />
      <rect x="21.5" y="17" width="22" height="14" rx="7" fill="none" stroke={NAVY} strokeWidth="7" transform="rotate(-35 32.5 24)" />
      <rect x="21.5" y="17" width="22" height="14" rx="7" fill="none" stroke={GREEN} strokeWidth="3" transform="rotate(-35 32.5 24)" />
    </>
  ),
  picture: (
    <>
      <rect x="5" y="9" width="38" height="30" rx="5" fill={BLUE} />
      <path d="M5 33l11-12 9 9 6-6 12 11v1a3 3 0 0 1-3 3H8a3 3 0 0 1-3-3z" fill={GREEN} />
      <circle cx="33" cy="17" r="4" fill={YELLOW} />
    </>
  ),
  list: (
    <>
      <rect x="9" y="8" width="30" height="34" rx="4" fill={YELLOW} />
      <rect x="17" y="4.5" width="14" height="7" rx="2.5" fill={PURPLE} />
      <path d="M15 20l2 2 3.5-3.5M15 30l2 2 3.5-3.5" stroke={GREEN} strokeWidth="2.8" />
      <path d="M24 21h9M24 31h9" stroke={NAVY} strokeWidth="2.5" />
    </>
  ),
  star: <path d={starPath(24, 25, 18)} fill={YELLOW} />,
  calendar: (
    <>
      <rect x="6" y="10" width="36" height="32" rx="5" fill={WHITE} />
      <path d="M6 15a5 5 0 0 1 5-5h26a5 5 0 0 1 5 5v5H6z" fill={RED} />
      <path d="M15 6v8M33 6v8" strokeWidth="3.5" />
      {[14, 24, 34].map((x) => [27, 35].map((y) => (
        <circle key={`${x}-${y}`} cx={x} cy={y} r="2.2" fill={BLUE} stroke="none" />
      )))}
      <path d={starPath(34, 35, 5.5)} fill={YELLOW} strokeWidth="2" />
    </>
  ),
  lock: (
    <>
      <path d="M16 22v-6a8 8 0 0 1 16 0v6" fill="none" strokeWidth="4" />
      <rect x="10" y="21" width="28" height="21" rx="5" fill={PURPLE} />
      <circle cx="24" cy="30" r="3" fill={WHITE} />
      <path d="M24 32v4" stroke={WHITE} strokeWidth="3" />
    </>
  )
} satisfies Record<string, ReactNode>;

export type IconName = keyof typeof ICONS;

export default function Icon({
  name,
  size = 28,
  className
}: {
  name: IconName;
  size?: number;
  className?: string;
}) {
  return (
    <svg
      viewBox="0 0 48 48"
      width={size}
      height={size}
      className={className}
      aria-hidden="true"
      focusable="false"
      stroke={NAVY}
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      {ICONS[name]}
    </svg>
  );
}
