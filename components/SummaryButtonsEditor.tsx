"use client";

import { useState } from "react";
import { SummaryButton } from "@/lib/courseData";
import { SITE_PAGES } from "@/lib/sitePages";

const MAX_BUTTONS = 8;
const OTHER_WEBSITE = "__website";

// Edit-mode controls for the link buttons under the "This week" message.
// Changes are held in the parent and saved together with the message text.
export default function SummaryButtonsEditor({
  buttons,
  onChange
}: {
  buttons: SummaryButton[];
  onChange: (buttons: SummaryButton[]) => void;
}) {
  const [label, setLabel] = useState("");
  const [target, setTarget] = useState(SITE_PAGES[0].href);
  const [url, setUrl] = useState("");

  const atCap = buttons.length >= MAX_BUTTONS;

  function pickTarget(value: string) {
    setTarget(value);
    // Suggest the page's name as the button text if none has been typed yet.
    const page = SITE_PAGES.find((item) => item.href === value);
    if (page && !label.trim()) setLabel(page.label);
  }

  function addButton() {
    const href = target === OTHER_WEBSITE ? url.trim() : target;
    if (!label.trim() || !href) {
      alert("Please give the button a name and choose where it goes.");
      return;
    }
    onChange([...buttons, { id: `button-${Date.now()}`, label: label.trim(), href }]);
    setLabel("");
    setUrl("");
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
            placeholder="Button name, e.g. STUDY TIPS"
            value={label}
            maxLength={40}
            onChange={(event) => setLabel(event.target.value)}
          />
          <select
            className="summaryButtonsSelect"
            value={target}
            onChange={(event) => pickTarget(event.target.value)}
            aria-label="Where the button goes"
          >
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
              onChange={(event) => setUrl(event.target.value)}
            />
          )}
          <button type="button" className="addActivityButton" onClick={addButton}>
            ➕ Add button
          </button>
        </div>
      )}
    </div>
  );
}
