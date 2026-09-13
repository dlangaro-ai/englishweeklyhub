"use client";

import { useEditableField } from "./useEditableField";
import RichTextEditor from "./RichTextEditor";
import ImageSizeControl from "./ImageSizeControl";
import { sanitizeRichText } from "@/lib/sanitizeHtml";
import { imageWidthStyle, imageAlignStyle, ImageAlign } from "@/lib/imageSize";

// The "This Week" card on the week page. The message is shown directly on
// the card; the teacher edits it in place.
export default function SummaryCard({
  weekNumber,
  summary,
  image,
  imageWidth,
  imageAlign,
  isEditor
}: {
  weekNumber: number;
  summary: string;
  image?: string;
  imageWidth?: number;
  imageAlign?: ImageAlign;
  isEditor: boolean;
}) {
  const editable = useEditableField({
    weekNumber,
    field: "summary",
    imageField: "summaryImage",
    imageWidthField: "summaryImageWidth",
    imageAlignField: "summaryImageAlign",
    isList: false,
    initialText: summary,
    initialImage: image,
    initialImageWidth: imageWidth,
    initialImageAlign: imageAlign,
    maxWords: 300
  });

  return (
    <article className="infoCard summaryCard">
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
        <h2>What&apos;s Happening this week</h2>

        {editable.editing ? (
          <div className="editForm">
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
                align={editable.imageAlign}
                onAlignChange={editable.setImageAlign}
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
        ) : summary ? (
          <>
            <div
              className="infoText richTextDisplay"
              dangerouslySetInnerHTML={{ __html: sanitizeRichText(summary) }}
            />
            {image && (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                className="bookImage"
                src={image}
                alt=""
                style={imageWidthStyle(imageWidth)}
                onError={(event) => {
                  event.currentTarget.style.display = "none";
                }}
              />
            )}
          </>
        ) : (
          <p className="infoText">Check back soon for this week&apos;s update.</p>
        )}
      </div>
    </article>
  );
}
