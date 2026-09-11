const NAVY = "#1f2a44";
const GREEN = "#3fa34d";
const LAVENDER = "#e4dbfb";

export default function TedAnk5Logo({ className }: { className?: string }) {
  return (
    <svg
      viewBox="130 0 380 180"
      className={className}
      role="img"
      aria-label="TEDANK5 — My English Hub"
    >
      {/* wordmark */}
      <text
        x="320"
        y="70"
        textAnchor="middle"
        fontFamily="var(--font-heading)"
        fontWeight={800}
        fontSize="66"
      >
        <tspan fill={NAVY}>TEDANK</tspan>
        <tspan fill={GREEN}>5</tspan>
      </text>

      {/* my english hub pill */}
      <rect x="170" y="90" width="300" height="50" rx="25" fill={LAVENDER} />
      <text
        x="320"
        y="124"
        textAnchor="middle"
        fontFamily="var(--font-heading)"
        fontWeight={700}
        fontSize="27"
        fill={NAVY}
      >
        My English Hub
      </text>

      {/* tagline */}
      <text
        x="320"
        y="168"
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
