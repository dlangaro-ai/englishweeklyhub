const NAVY = "#1f2a44";
const GREEN = "#3fa34d";
const PURPLE = "#8a6fd6";
const LAVENDER = "#e4dbfb";
const YELLOW = "#f6c445";
const BLUE = "#5aa9e6";

export default function TedAnk5Logo({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 640 250"
      className={className}
      role="img"
      aria-label="TEDANK5 — My English Hub"
    >
      {/* sparkle accents beside the book */}
      <g stroke={PURPLE} strokeWidth="5" strokeLinecap="round">
        <line x1="248" y1="18" x2="242" y2="4" />
        <line x1="236" y1="30" x2="220" y2="26" />
      </g>
      <g stroke={GREEN} strokeWidth="5" strokeLinecap="round">
        <line x1="392" y1="18" x2="398" y2="4" />
        <line x1="404" y1="30" x2="420" y2="26" />
      </g>

      {/* open book */}
      <g transform="translate(266,4) scale(1.9)">
        <path
          d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"
          fill={LAVENDER}
          stroke={NAVY}
          strokeWidth="1.3"
          strokeLinejoin="round"
        />
        <path
          d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"
          fill="#ffffff"
          stroke={NAVY}
          strokeWidth="1.3"
          strokeLinejoin="round"
        />
      </g>

      {/* lightbulb */}
      <g transform="translate(560,34)">
        <g stroke={NAVY} strokeWidth="2.5" strokeLinecap="round">
          <line x1="0" y1="-26" x2="0" y2="-34" />
          <line x1="18" y1="-14" x2="25" y2="-19" />
          <line x1="-18" y1="-14" x2="-25" y2="-19" />
        </g>
        <circle cx="0" cy="0" r="17" fill={YELLOW} stroke={NAVY} strokeWidth="2.2" />
        <path
          d="M-6,-4 L0,3 L6,-4"
          fill="none"
          stroke={NAVY}
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <rect x="-5" y="16" width="10" height="6" rx="2" fill={NAVY} />
        <path
          d="M-4,25 Q0,30 4,25"
          fill="none"
          stroke={NAVY}
          strokeWidth="2"
          strokeLinecap="round"
        />
      </g>

      {/* wordmark */}
      <text
        x="320"
        y="128"
        textAnchor="middle"
        fontFamily="var(--font-heading)"
        fontWeight={800}
        fontSize="66"
      >
        <tspan fill={NAVY}>TEDANK</tspan>
        <tspan fill={GREEN}>5</tspan>
      </text>

      {/* books stack */}
      <g transform="translate(30,148)">
        <rect x="0" y="30" width="82" height="24" rx="5" fill="#ffffff" stroke={NAVY} strokeWidth="1.6" transform="rotate(-2 41 42)" />
        <rect x="4" y="14" width="78" height="22" rx="5" fill={GREEN} stroke={NAVY} strokeWidth="1.6" transform="rotate(1.5 43 25)" />
        <rect x="2" y="-2" width="76" height="20" rx="5" fill={PURPLE} stroke={NAVY} strokeWidth="1.6" transform="rotate(-1.5 40 8)" />
      </g>

      {/* my english hub pill */}
      <rect x="118" y="150" width="404" height="50" rx="25" fill={LAVENDER} />
      <text
        x="320"
        y="184"
        textAnchor="middle"
        fontFamily="var(--font-heading)"
        fontWeight={700}
        fontSize="27"
        fill={NAVY}
      >
        My English Hub
      </text>

      {/* globe */}
      <g transform="translate(578,175)">
        <circle cx="0" cy="0" r="24" fill="none" stroke={NAVY} strokeWidth="1.4" strokeDasharray="3 4" />
        <circle cx="0" cy="0" r="17" fill={BLUE} stroke={NAVY} strokeWidth="1.8" />
        <path
          d="M-10,-6 Q-4,-10 2,-6 Q7,-3 5,3 Q0,8 -6,4 Q-12,0 -10,-6 Z"
          fill={GREEN}
        />
        <path d="M6,-10 Q10,-8 9,-3 Q7,-2 5,-5 Z" fill={GREEN} />
      </g>

      {/* tagline */}
      <text
        x="320"
        y="230"
        textAnchor="middle"
        fontFamily="var(--font-heading)"
        fontWeight={600}
        fontSize="15"
        letterSpacing="2.5"
        fill={NAVY}
      >
        LEARN &#8226; PRACTICE &#8226; GROW
      </text>
    </svg>
  );
}
