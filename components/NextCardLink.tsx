// Small "jump to the next card" link shown at the bottom of each week-page
// card, chaining This Week -> Books -> Homework -> Resources -> Eager
// Learners -> back to This Week.
export default function NextCardLink({ anchor, label }: { anchor: string; label: string }) {
  return (
    <a href={`#${anchor}`} className="nextCardLink">
      Next: {label} ↓
    </a>
  );
}
