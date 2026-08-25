"use client";

import { useEditableField } from "./useEditableField";
import EditFormBody from "./EditFormBody";
import RichTextEditor from "./RichTextEditor";
import { sanitizeRichText } from "@/lib/sanitizeHtml";

type EditableSectionProps = {
  weekNumber: number;
  icon: string;
  label: string;
  heading: string;
  field: string;
  imageField: string;
  isList: boolean;
  value: string | string[];
  image?: string;
  emptyText: string;
  isEditor: boolean;
  cardClassName?: string;
  richText?: boolean;
  maxWords?: number;
  extra?: React.ReactNode;
};

export default function EditableSection({
  weekNumber,
  icon,
  label,
  heading,
  field,
  imageField,
  isList,
  value,
  image,
  emptyText,
  isEditor,
  cardClassName,
  richText,
  maxWords,
  extra
}: EditableSectionProps) {
  const initialText = isList ? (value as string[]).join("\n") : (value as string);
  const editable = useEditableField({
    weekNumber,
    field,
    imageField,
    isList,
    initialText,
    initialImage: image,
    maxWords: richText ? maxWords : undefined
  });
  const listValue = Array.isArray(value) ? value : [];

  return (
    <article className={`infoCard ${cardClassName ?? ""}`}>
      <span className="infoIcon">{icon}</span>
      <div className="infoCardBody">
        <div className="infoCardHead">
          <p className="infoLabel">{label}</p>
          {isEditor && !editable.editing && (
            <button className="editButton" type="button" onClick={editable.startEdit}>
              ✏️ Edit
            </button>
          )}
        </div>
        <h2>{heading}</h2>

        {editable.editing ? (
          richText ? (
            <div className="editForm">
              <RichTextEditor value={editable.text} onChange={editable.setText} maxWords={maxWords} />
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
          ) : (
            <EditFormBody editable={editable} isList={isList} />
          )
        ) : (
          <>
            {isList ? (
              listValue.length ? (
                <ul className="simpleList">
                  {listValue.map((item, index) => (
                    <li key={index}>{item}</li>
                  ))}
                </ul>
              ) : (
                <p className="infoText">{emptyText}</p>
              )
            ) : richText ? (
              value ? (
                <div
                  className="infoText richTextDisplay"
                  dangerouslySetInnerHTML={{ __html: sanitizeRichText(value as string) }}
                />
              ) : (
                <p className="infoText">{emptyText}</p>
              )
            ) : (
              <p className="infoText">{(value as string) || emptyText}</p>
            )}
            {image && (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                className="bookImage"
                src={image}
                alt=""
                onError={(event) => {
                  event.currentTarget.style.display = "none";
                }}
              />
            )}
            {extra}
          </>
        )}
      </div>
    </article>
  );
}
