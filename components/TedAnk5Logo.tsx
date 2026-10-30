// The TEDANK5 logo, built as plain text so it matches the reference design:
// heavy rounded wordmark with a green 5, a lavender "My English Hub" pill and
// the LEARN · PRACTICE · GROW tagline. Everything is sized in em, so it scales
// with the font-size set on .tedLogo.
export default function TedAnk5Logo({ className }: { className?: string }) {
  return (
    <div className={`tedLogo${className ? ` ${className}` : ""}`} role="img" aria-label="TEDANK5 — My English Hub">
      <div className="tedLogoWord" aria-hidden="true">
        TEDANK<span>5</span>
      </div>
      <div className="tedLogoPill" aria-hidden="true">My English Hub</div>
      <div className="tedLogoTagline" aria-hidden="true">LEARN · PRACTICE · GROW</div>
    </div>
  );
}
