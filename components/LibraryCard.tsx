"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { LibraryLink } from "@/lib/courseData";
import { imageWidthStyle } from "@/lib/imageSize";
import { sanitizeRichText } from "@/lib/sanitizeHtml";
import ImageSizeControl from "./ImageSizeControl";
import RichTextEditor from "./RichTextEditor";
import { goToNextCard } from "@/lib/cardNav";
import { normalizeUrl } from "@/lib/normalizeUrl";
import Link from "next/link";
import AddResourceForm from "./AddResourceForm";

const MAX_LINKS = 12;

const RESOURCE_KINDS = {
  link: { icon: "🌐", label: "Website" },
  image: { icon: "🖼️", label: "Image" },
  pdf: { icon: "📄", label: "PDF" }
} as const;

const RESOURCE_TINTS = ["resBlue", "resSun", "resPink", "resPurple"];

export default function LibraryCard({
  weekNumber,
  text,
  image,
  imageWidth,
  links,
  resourceIds,
  libraryItems,
  isEditor
}: {
  weekNumber: number;
  text: string;
  image?: string;
  imageWidth?: number;
  links: LibraryLink[];
  resourceIds: string[];
  // The whole shared library — only sent to the page for the teacher.
  libraryItems: LibraryLink[];
  isEditor: boolean;
}) {
  const [saving, setSaving] = useState(false);
  const [width, setWidth] = useState<number | undefined>(imageWidth);
  const [editingText, setEditingText] = useState(false);
  const [draftText, setDraftText] = useState(text);
  const [textSaving, setTextSaving] = useState(false);
  const [pickerOpen, setPickerOpen] = useState(false);
  const [attachingId, setAttachingId] = useState<string | null>(null);
  // Two-step delete done inline (first click arms, second click deletes) —
  // window.confirm() can be silently blocked by the browser.
  const [armedId, setArmedId] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  async function patchWeek(body: Record<string, unknown>) {
    const response = await fetch(`/api/weeks/${weekNumber}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body)
    });
    if (!response.ok) {
      const result = await response.json().catch(() => ({}));
      throw new Error(result.error ?? "Could not save.");
    }
  }

  function startEditingText() {
    setDraftText(text);
    setEditingText(true);
  }

  async function handleSaveText() {
    setTextSaving(true);
    try {
      await patchWeek({ libraryText: draftText });
      setEditingText(false);
      router.refresh();
    } catch (error) {
      alert(error instanceof Error ? error.message : "Could not save.");
    } finally {
      setTextSaving(false);
    }
  }

  async function handleFileChange(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    event.target.value = "";
    if (!file) return;

    setSaving(true);
    try {
      const formData = new FormData();
      formData.append("file", file);
      const uploadResponse = await fetch("/api/upload", { method: "POST", body: formData });
      if (!uploadResponse.ok) {
        const result = await uploadResponse.json().catch(() => ({}));
        throw new Error(result.error ?? "Upload failed.");
      }
      const { url } = await uploadResponse.json();
      await patchWeek({ libraryImage: url });
      router.refresh();
    } catch (error) {
      alert(error instanceof Error ? error.message : "Something went wrong.");
    } finally {
      setSaving(false);
    }
  }

  async function handleRemoveImage() {
    if (armedId !== "main-image") {
      setArmedId("main-image");
      return;
    }
    setArmedId(null);
    setSaving(true);
    try {
      await patchWeek({ libraryImage: null, libraryImageWidth: null });
      setWidth(undefined);
      router.refresh();
    } catch (error) {
      alert(error instanceof Error ? error.message : "Could not remove this.");
    } finally {
      setSaving(false);
    }
  }

  async function handleSaveWidth() {
    setSaving(true);
    try {
      await patchWeek({ libraryImageWidth: width ?? null });
      router.refresh();
    } catch (error) {
      alert(error instanceof Error ? error.message : "Could not save the size.");
    } finally {
      setSaving(false);
    }
  }

  // Resources live in the shared library; a week only keeps a list of IDs,
  // so adding/removing here never deletes anything from the library.
  async function setWeekResources(ids: string[]) {
    await patchWeek({ resourceIds: ids });
    router.refresh();
  }

  async function handleAttach(id: string) {
    setAttachingId(id);
    try {
      await setWeekResources([...resourceIds, id]);
    } catch (error) {
      alert(error instanceof Error ? error.message : "Could not add this.");
    } finally {
      setAttachingId(null);
    }
  }

  async function handleDetach(id: string) {
    setAttachingId(id);
    try {
      await setWeekResources(resourceIds.filter((existing) => existing !== id));
    } catch (error) {
      alert(error instanceof Error ? error.message : "Could not remove this.");
    } finally {
      setAttachingId(null);
    }
  }

  const atCap = resourceIds.length >= MAX_LINKS;
  const available = libraryItems.filter((item) => !resourceIds.includes(item.id));

  return (
    <article
      id="library"
      className="infoCard infoCardLibrary cardClickable"
      onClick={!editingText && !pickerOpen ? (event) => goToNextCard(event, "summary") : undefined}
    >
      <span className="infoIcon">📖</span>
      <div className="infoCardBody">
        <div className="infoCardHead">
          <p className="infoLabel">RESOURCES</p>
          {isEditor && !editingText && (
            <button className="editButton" type="button" onClick={startEditingText}>
              ✏️ Edit
            </button>
          )}
        </div>
        <h2>Resources</h2>

        {editingText ? (
          <div className="editForm">
            <RichTextEditor value={draftText} onChange={setDraftText} maxWords={150} />
            <div className="editActions">
              <button className="primaryButton" type="button" onClick={handleSaveText} disabled={textSaving}>
                {textSaving ? "Saving…" : "Save"}
              </button>
              <button
                className="cancelButton"
                type="button"
                onClick={() => setEditingText(false)}
                disabled={textSaving}
              >
                Cancel
              </button>
            </div>
          </div>
        ) : (
          text && (
            <div className="infoText richTextDisplay" dangerouslySetInnerHTML={{ __html: sanitizeRichText(text) }} />
          )
        )}

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

        {isEditor && (
          <div className="editImageButtons">
            <button type="button" onClick={() => fileInputRef.current?.click()} disabled={saving}>
              📷 {image ? "Change image" : "Add image"}
            </button>
            {image && (
              <button
                type="button"
                onClick={handleRemoveImage}
                onBlur={() => setArmedId((id) => (id === "main-image" ? null : id))}
                disabled={saving}
              >
                {armedId === "main-image" ? "Click again to delete" : "Remove image"}
              </button>
            )}
          </div>
        )}
        {isEditor && image && (
          <>
            <ImageSizeControl src={image} width={width} onChange={setWidth} />
            <button
              type="button"
              className="primaryButton"
              onClick={handleSaveWidth}
              disabled={saving || width === imageWidth}
            >
              {saving ? "Saving…" : "Save size"}
            </button>
          </>
        )}
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          className="hiddenFileInput"
          onChange={handleFileChange}
        />

        {links.length > 0 ? (
          <ul className="weekResourceGrid">
            {links.map((link, index) => {
              const kind = RESOURCE_KINDS[link.resourceType ?? "link"];
              return (
                <li key={link.id} className={`weekResource ${RESOURCE_TINTS[index % RESOURCE_TINTS.length]}`}>
                  <a
                    href={normalizeUrl(link.href)}
                    target="_blank"
                    rel="noreferrer"
                    className="weekResourceLink"
                  >
                    {link.image ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={link.image} alt="" className="weekResourceThumb" />
                    ) : (
                      <span className="weekResourceIcon" aria-hidden="true">{kind.icon}</span>
                    )}
                    <span className="weekResourceText">
                      <span className="weekResourceTitle">{link.title.replace(/^📄\s*/, "")}</span>
                      <span className="weekResourceKind">{kind.label}</span>
                    </span>
                  </a>
                  {isEditor && (
                    <button
                      type="button"
                      className="removeButton"
                      onClick={() => handleDetach(link.id)}
                      disabled={attachingId === link.id}
                      title="Take off this week (stays in the library)"
                    >
                      {attachingId === link.id ? "…" : "✕"}
                    </button>
                  )}
                </li>
              );
            })}
          </ul>
        ) : (
          !isEditor && <p className="infoText">No resources added yet.</p>
        )}

        {isEditor && (
          <div className="libraryPicker">
            {!pickerOpen ? (
              <div className="addActivityBar">
                <button
                  type="button"
                  className="addActivityButton"
                  onClick={() => setPickerOpen(true)}
                  disabled={atCap}
                >
                  📚 Add from library ({resourceIds.length}/{MAX_LINKS})
                </button>
                <Link href="/resources" className="addActivityButton">
                  Manage library →
                </Link>
              </div>
            ) : (
              <div className="editForm addActivityForm">
                <p className="infoText">
                  Pick a resource to show on this week. Removing it later only takes it off this week.
                </p>
                {available.length > 0 ? (
                  <ul className="libraryPickList">
                    {available.map((item) => (
                      <li key={item.id}>
                        <span>
                          {item.resourceType === "pdf" ? "📄 " : item.resourceType === "image" ? "🖼️ " : "🌐 "}
                          {item.title}
                        </span>
                        <button
                          type="button"
                          className="addActivityButton"
                          onClick={() => handleAttach(item.id)}
                          disabled={atCap || attachingId === item.id}
                        >
                          {attachingId === item.id ? "…" : "＋ Add"}
                        </button>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="infoText">Everything in the library is already on this week.</p>
                )}
                <p className="infoLabel">NEW RESOURCE</p>
                <AddResourceForm onCreated={(item) => setWeekResources([...resourceIds, item.id])} />
                <div className="editActions">
                  <button className="cancelButton" type="button" onClick={() => setPickerOpen(false)}>
                    Done
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </article>
  );
}
