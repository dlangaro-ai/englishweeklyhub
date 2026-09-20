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
  window.location.hash = anchor;
}
