"use client";

import Link from "next/link";
import { useEditableField } from "./useEditableField";
import RichTextEditor from "./RichTextEditor";
import ImageSizeControl from "./ImageSizeControl";

// The "This Week" card on the week page. Students see a folder link to the
// full message at /week/N/this-week; the teacher edits the message in place.
export default function SummaryCard({
  weekNumber,
  summary,
  image,
  imageWidth,
  isEditor
}: {
  weekNumber: number;
  summary: string;
  image?: string;
  imageWidth?: number;
  isEditor: boolean;
}) {
  const editable = useEditableField({
    weekNumber,
    field: "summary",
    imageField: "summaryImage",
    imageWidthField: "summaryImageWidth",
    isList: false,
    initialText: summary,
    initialImage: image,
    initialImageWidth: imageWidth,
    maxWords: 300
  });

  return (
    <article className="infoCard skillsFolder summaryCard">
      <span className="infoIcon">✨</span>
      <div className="infoCardBody">
        <div className="infoCardHead">
          <p className="infoLabel">THIS WEEK</p>
          {isEditor && !editable.editing && (
            <button className="editButton" type="button" onClick={editable.startEdit}>
              ✏️ Edit
            </button>
          )}
        </div>

        {editable.editing ? (
          <div className="editForm">
            <h2>What&apos;s Happening this week</h2>
            <RichTextEditor value={editable.text} onChange={editable.setText} maxWords={300} />
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
            {editable.imageWidthField && editable.imagePreview && (
              <ImageSizeControl
                src={editable.imagePreview}
                width={editable.imageWidth}
                onChange={editable.setImageWidth}
              />
            )}
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
          <Link href={`/week/${weekNumber}/this-week`} className="skillsFolderLink">
            <h2>What&apos;s Happening this week</h2>
            <span className="openLabel">Open folder →</span>
          </Link>
        )}
      </div>
    </article>
  );
}
