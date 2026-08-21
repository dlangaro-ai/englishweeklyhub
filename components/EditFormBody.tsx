"use client";

import { useEditableField } from "./useEditableField";

type Editable = ReturnType<typeof useEditableField>;

export default function EditFormBody({ editable, isList }: { editable: Editable; isList: boolean }) {
  return (
    <div className="editForm">
      <textarea
        className="editTextarea"
        value={editable.text}
        onChange={(event) => editable.setText(event.target.value)}
        rows={isList ? 5 : 4}
        placeholder={isList ? "One item per line" : undefined}
      />

      <div className="editImageRow">
        {editable.imagePreview && (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={editable.imagePreview} alt="" className="editImagePreview" />
        )}
        <div className="editImageButtons">
          <button type="button" onClick={() => editable.fileInputRef.current?.click()}>
            📷 {editable.imagePreview ? "Change image" : "Add image"}
          </button>
          {editable.imagePreview && (
            <button type="button" onClick={editable.handleRemoveImage}>
              Remove image
            </button>
          )}
        </div>
        <input
          ref={editable.fileInputRef}
          type="file"
          accept="image/*"
          className="hiddenFileInput"
          onChange={editable.handleFileChange}
        />
      </div>

      <div className="editActions">
        <button className="primaryButton" type="button" onClick={editable.save} disabled={editable.saving}>
          {editable.saving ? "Saving…" : "Save"}
        </button>
        <button className="cancelButton" type="button" onClick={editable.cancelEdit} disabled={editable.saving}>
          Cancel
        </button>
      </div>
    </div>
  );
}
