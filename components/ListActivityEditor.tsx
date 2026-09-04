"use client";

import { useState } from "react";

// Inline editor for the one-item-per-line text of a "list" Eager Learners activity.
export default function ListActivityEditor({
  initialText,
  saving,
  onSave,
  onCancel
}: {
  initialText: string;
  saving: boolean;
  onSave: (text: string) => void;
  onCancel: () => void;
}) {
  const [text, setText] = useState(initialText);

  return (
    <div className="editForm">
      <textarea
        className="editTextarea"
        rows={5}
        placeholder="One item per line"
        value={text}
        onChange={(event) => setText(event.target.value)}
      />
      <div className="editActions">
        <button className="primaryButton" type="button" onClick={() => onSave(text)} disabled={saving}>
          {saving ? "Saving…" : "Save"}
        </button>
        <button className="cancelButton" type="button" onClick={onCancel} disabled={saving}>
          Cancel
        </button>
      </div>
    </div>
  );
}
