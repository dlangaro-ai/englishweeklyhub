"use client";

import { SummaryButton } from "@/lib/courseData";
import { SITE_PAGES } from "@/lib/sitePages";

const MAX_BUTTONS = 8;
const OTHER_WEBSITE = "__website";

// The "new button" form. It lives in the parent so a button that was typed but
// not yet added can still be included when the teacher presses Save.
export type ButtonDraft = { label: string; target: string; url: string };

export const EMPTY_DRAFT: ButtonDraft = { label: "", target: "", url: "" };

// True once the teacher has actually typed something into the new-button form.
export function hasTypedDraft(draft: ButtonDraft): boolean {
  return draft.label.trim() !== "" || (draft.target === OTHER_WEBSITE && draft.url.trim() !== "");
}

// Turns the form into a button; null if it's not complete yet. Left empty, a
// button to a site page is named after that page.
export function buildButton(draft: ButtonDraft): SummaryButton | null {
  if (!draft.target) return null; // no destination chosen yet
  const page = SITE_PAGES.find((item) => item.href === draft.target);
  const href = draft.target === OTHER_WEBSITE ? draft.url.trim() : draft.target;
  const name = draft.label.trim() || page?.label || "";
  if (!name || !href) return null;
  return { id: `button-${Date.now()}`, label: name, href };
}

// Edit-mode controls for the link buttons under the "This week" message.
// Changes are held in the parent and saved together with the message text.
export default function SummaryButtonsEditor({
  buttons,
  onChange,
  draft,
  onDraftChange
}: {
  buttons: SummaryButton[];
  onChange: (buttons: SummaryButton[]) => void;
  draft: ButtonDraft;
  onDraftChange: (draft: ButtonDraft) => void;
}) {
  const { label, target, url } = draft;
  const atCap = buttons.length >= MAX_BUTTONS;
  const targetPage = SITE_PAGES.find((page) => page.href === target);
  const pending = hasTypedDraft(draft);

  function addButton() {
    const button = buildButton(draft);
    if (!button) {
      alert("Please give the button a name and choose where it goes (the list under the name).");
      return;
    }
    onChange([...buttons, button]);
    onDraftChange({ ...draft, label: "", url: "" });
  }

  function destinationName(href: string) {
    return SITE_PAGES.find((page) => page.href === href)?.label ?? href;
  }

  return (
    <div className="summaryButtonsEditor">
      <p className="summaryButtonsTitle">🔗 Link buttons</p>

      {buttons.length > 0 && (
        <ul className="summaryButtonsList">
          {buttons.map((button) => (
            <li key={button.id}>
              <span className="summaryButtonsName">{button.label}</span>
              <span className="summaryButtonsTarget">→ {destinationName(button.href)}</span>
              <button
                type="button"
                className="removeButton"
                onClick={() => onChange(buttons.filter((item) => item.id !== button.id))}
                aria-label={`Remove the ${button.label} button`}
              >
                ✕
              </button>
            </li>
          ))}
        </ul>
      )}

      {atCap ? (
        <p className="summaryButtonsHint">You can add up to {MAX_BUTTONS} buttons.</p>
      ) : (
        <div className="summaryButtonsAdd">
          <input
            className="editTextarea"
            placeholder={targetPage ? `Button name (empty = “${targetPage.label}”)` : "Button name"}
            value={label}
            maxLength={40}
            onChange={(event) => onDraftChange({ ...draft, label: event.target.value })}
          />
          <select
            className="summaryButtonsSelect"
            value={target}
            onChange={(event) => onDraftChange({ ...draft, target: event.target.value })}
            aria-label="Where the button goes"
          >
            <option value="" disabled>
              Choose where it goes…
            </option>
            {SITE_PAGES.map((page) => (
              <option key={page.href} value={page.href}>
                {page.label}
              </option>
            ))}
            <option value={OTHER_WEBSITE}>Another website…</option>
          </select>
          {target === OTHER_WEBSITE && (
            <input
              className="editTextarea"
              placeholder="https://..."
              value={url}
              onChange={(event) => onDraftChange({ ...draft, url: event.target.value })}
            />
          )}
          <button type="button" className="addActivityButton" onClick={addButton}>
            ➕ Add button
          </button>
          {pending && (
            <p className="summaryButtonsPending">
              ⚠️ This button isn’t added yet — press “Add button” (Save will add it too).
            </p>
          )}
        </div>
      )}
    </div>
  );
}
