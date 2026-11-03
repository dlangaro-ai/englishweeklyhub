import type { ReactNode } from "react";

// Plain one-colour outline icons for the home menu. They take their colour
// from the text (currentColor), so the whole menu uses a single accent
// instead of the multi-coloured sticker icons in Icon.tsx.

export type LineIconName = "calendar" | "check" | "abc" | "gift" | "book" | "bulb" | "chat";

const ICONS: Record<LineIconName, ReactNode> = {
  calendar: (
    <>
      <rect x="3" y="5" width="18" height="16" rx="3" />
      <path d="M3 10h18M8 3v4M16 3v4" />
    </>
  ),
  check: (
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="M8 12.5l2.7 2.7L16 9.5" />
    </>
  ),
  abc: (
    <>
      <rect x="3" y="4" width="18" height="16" rx="3" />
      <text x="12" y="16" textAnchor="middle" fontSize="10" fontWeight="800" fill="currentColor" stroke="none" fontFamily="Arial, sans-serif">
        Aa
      </text>
    </>
  ),
  gift: (
    <>
      <rect x="3" y="9" width="18" height="12" rx="2" />
      <path d="M12 9v12M3 14h18" />
      <path d="M12 9C10 4.5 6 5.5 7 7.5 7.5 8.6 9.5 9 12 9zM12 9c2-4.5 6-3.5 5-1.5-.5 1.1-2.5 1.5-5 1.5z" />
    </>
  ),
  book: <path d="M12 6.5C10 5 7 4.5 3.5 5v13c3.5-.5 6.5 0 8.5 1.5 2-1.5 5-2 8.5-1.5V5C17 4.5 14 5 12 6.5zM12 6.5v13" />,
  bulb: (
    <>
      <path d="M9 18h6M10 21h4" />
      <path d="M12 3a6 6 0 0 0-3.5 10.9c.6.5 1 1.2 1 2.1h5c0-.9.4-1.6 1-2.1A6 6 0 0 0 12 3z" />
    </>
  ),
  chat: <path d="M4 5h16a1 1 0 0 1 1 1v10a1 1 0 0 1-1 1h-9l-5 4v-4H4a1 1 0 0 1-1-1V6a1 1 0 0 1 1-1z" />
};

export default function LineIcon({ name, size = 28 }: { name: LineIconName; size?: number }) {
  return (
    <svg
      viewBox="0 0 24 24"
      width={size}
      height={size}
      aria-hidden="true"
      focusable="false"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      {ICONS[name]}
    </svg>
  );
}
