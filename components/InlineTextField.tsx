"use client";

import { useEditableField } from "./useEditableField";

export default function InlineTextField({
  weekNumber,
  field,
  value,
  isEditor,
  tag: Tag,
  className
}: {
  weekNumber: number;
  field: "title" | "unit";
  value: string;
  isEditor: boolean;
  tag: "h1" | "p";
  className?: string;
}) {
  const editable = useEditableField({
    weekNumber,
    field,
    imageField: "__unused",
    isList: false,
    initialText: value
  });

  if (!isEditor) {
    return <Tag className={className}>{value}</Tag>;
  }

  if (editable.editing) {
    return (
      <div className="inlineEditRow">
        <input
          className="inlineEditInput"
          value={editable.text}
          onChange={(event) => editable.setText(event.target.value)}
          autoFocus
        />
        <button className="inlineEditSave" type="button" onClick={editable.save} disabled={editable.saving}>
          {editable.saving ? "…" : "✔ Save"}
        </button>
        <button className="inlineEditCancel" type="button" onClick={editable.cancelEdit} disabled={editable.saving}>
          ✕
        </button>
      </div>
    );
  }

  return (
    <div className="inlineEditDisplay">
      <Tag className={className}>{value}</Tag>
      <button className="inlineEditButton" type="button" onClick={editable.startEdit}>
        ✏️
      </button>
    </div>
  );
}
