"use client";

import { useState } from "react";
import RichTextEditor from "./RichTextEditor";
import { listActivityToHtml } from "@/lib/sanitizeHtml";

// Rich-text editor for a "list" Eager Learners activity. Seeds from either the
// legacy "one item per line" text or previously-saved HTML.
export default function ListActivityEditor({
  initialText,
  saving,
  onSave,
  onCancel
}: {
  initialText: string;
  saving: boolean;
  onSave: (html: string) => void;
  onCancel: () => void;
}) {
  const [html, setHtml] = useState(() => listActivityToHtml(initialText));

  return (
    <div className="editForm">
      <RichTextEditor value={html} onChange={setHtml} maxWords={200} />
      <div className="editActions">
        <button className="primaryButton" type="button" onClick={() => onSave(html)} disabled={saving}>
          {saving ? "Saving…" : "Save"}
        </button>
        <button className="cancelButton" type="button" onClick={onCancel} disabled={saving}>
          Cancel
        </button>
      </div>
    </div>
  );
}
