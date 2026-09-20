const SCROLL_DURATION_MS = 900;

function easeInOutQuad(t: number): number {
  return t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2;
}

// Native `scroll-behavior: smooth` has no way to slow it down, so this
// animates the scroll by hand at a fixed, gentler pace instead.
function animateScrollTo(targetY: number, duration: number) {
  const startY = window.scrollY;
  const distance = targetY - startY;
  const startTime = performance.now();

  function step(now: number) {
    const progress = Math.min((now - startTime) / duration, 1);
    window.scrollTo(0, startY + distance * easeInOutQuad(progress));
    if (progress < 1) requestAnimationFrame(step);
  }

  requestAnimationFrame(step);
}

// Shared click handler for "click anywhere on this card to jump to the next
// one" — used by the week-page cards. Ignores clicks that land on (or inside)
// a real interactive element, so links, buttons, inputs and the rich-text
// editor keep working normally; only clicks on the card's plain background
// trigger the jump.
export function goToNextCard(event: React.MouseEvent<HTMLElement>, anchor: string) {
  const target = event.target as HTMLElement;
  if (target.closest('a, button, input, textarea, select, [contenteditable="true"]')) {
    return;
  }

  const el = document.getElementById(anchor);
  if (!el) return;

  const scrollMarginTop = parseFloat(getComputedStyle(el).scrollMarginTop || "0");
  const targetY = el.getBoundingClientRect().top + window.scrollY - scrollMarginTop;

  animateScrollTo(targetY, SCROLL_DURATION_MS);
  // Updates the URL fragment (so `.infoCard:target` still highlights the
  // card) without pushState's own scroll — only our animation moves the page.
  window.history.pushState(null, "", `#${anchor}`);
}
