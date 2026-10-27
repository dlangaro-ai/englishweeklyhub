"use client";

import { useState } from "react";
import { useEditableField } from "./useEditableField";
import RichTextEditor from "./RichTextEditor";
import SummaryButtons from "./SummaryButtons";
import SummaryButtonsEditor, { buildButton, EMPTY_DRAFT, hasTypedDraft } from "./SummaryButtonsEditor";
import { SummaryButton } from "@/lib/courseData";
import ImageSizeControl from "./ImageSizeControl";
import { sanitizeRichText } from "@/lib/sanitizeHtml";
import { imageWidthStyle, imageAlignStyle, ImageAlign } from "@/lib/imageSize";
import { goToNextCard } from "@/lib/cardNav";
import Icon from "./Icon";

// The "This Week" card on the week page. The message is shown directly on
// the card; the teacher edits it in place.
export default function SummaryCard({
  weekNumber,
  summary,
  image,
  imageWidth,
  imageAlign,
  summaryButtons,
  isEditor
}: {
  weekNumber: number;
  summary: string;
  image?: string;
  imageWidth?: number;
  imageAlign?: ImageAlign;
  summaryButtons?: SummaryButton[];
  isEditor: boolean;
}) {
  const [buttons, setButtons] = useState<SummaryButton[]>(summaryButtons ?? []);
  const [draft, setDraft] = useState(EMPTY_DRAFT);
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
    maxWords: 300,
    extraPayload: { summaryButtons: buttons }
  });

  function startEdit() {
    setButtons(summaryButtons ?? []);
    setDraft(EMPTY_DRAFT);
    editable.startEdit();
  }

  // A button that was typed but not yet added is added as part of Save.
  function save() {
    if (!hasTypedDraft(draft)) return editable.save();
    const pending = buildButton(draft);
    if (!pending) {
      alert("Finish the new link button — choose where it goes — or clear its name, before saving.");
      return;
    }
    return editable.saveWith({ summaryButtons: [...buttons, pending] });
  }

  return (
    <article
      id="summary"
      className="infoCard summaryCard cardClickable"
      onClick={!editable.editing ? (event) => goToNextCard(event, "books") : undefined}
    >
      <span className="infoIcon"><Icon name="sparkle" size={48} /></span>
      <div className="infoCardBody">
        <div className="infoCardHead">
          <p className="infoLabel">THIS WEEK</p>
          {isEditor && !editable.editing && (
            <button className="editButton" type="button" onClick={startEdit}>
              ✏️ Edit
            </button>
          )}
        </div>
        <h2>What&apos;s happening this week</h2>

        {editable.editing ? (
          <div className="editForm">
            <RichTextEditor value={editable.text} onChange={editable.setText} maxWords={300} />
            <SummaryButtonsEditor buttons={buttons} onChange={setButtons} draft={draft} onDraftChange={setDraft} />
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
              <button className="primaryButton" type="button" onClick={save} disabled={editable.saving}>
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
                alt="Picture for this week"
                style={{ ...imageWidthStyle(imageWidth), ...imageAlignStyle(imageAlign) }}
                onError={(event) => {
                  event.currentTarget.style.display = "none";
                }}
              />
            )}
          </>
        ) : (
          <p className="infoText">Check back soon for this week&apos;s update.</p>
        )}

        {!editable.editing && <SummaryButtons buttons={summaryButtons ?? []} />}
      </div>
    </article>
  );
}
