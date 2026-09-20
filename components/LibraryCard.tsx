"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { LibraryLink } from "@/lib/courseData";
import { imageWidthStyle } from "@/lib/imageSize";
import { sanitizeRichText } from "@/lib/sanitizeHtml";
import ImageSizeControl from "./ImageSizeControl";
import RichTextEditor from "./RichTextEditor";
import NextCardLink from "./NextCardLink";

const MAX_LINKS = 6;

export default function LibraryCard({
  weekNumber,
  text,
  image,
  imageWidth,
  links,
  isEditor
}: {
  weekNumber: number;
  text: string;
  image?: string;
  imageWidth?: number;
  links: LibraryLink[];
  isEditor: boolean;
}) {
  const [saving, setSaving] = useState(false);
  const [width, setWidth] = useState<number | undefined>(imageWidth);
  const [editingText, setEditingText] = useState(false);
  const [draftText, setDraftText] = useState(text);
  const [textSaving, setTextSaving] = useState(false);
  const [addingType, setAddingType] = useState<"link" | "image" | "pdf" | null>(null);
  const [linkTitle, setLinkTitle] = useState("");
  const [linkUrl, setLinkUrl] = useState("");
  const [linkFile, setLinkFile] = useState<File | null>(null);
  const [linkImageWidth, setLinkImageWidth] = useState<number | undefined>(undefined);
  const [uploadFile, setUploadFile] = useState<File | null>(null);
  const [removingId, setRemovingId] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const linkFileInputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  const linkFilePreview = useMemo(() => (linkFile ? URL.createObjectURL(linkFile) : null), [linkFile]);
  useEffect(() => {
    return () => {
      if (linkFilePreview) URL.revokeObjectURL(linkFilePreview);
    };
  }, [linkFilePreview]);

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
    if (!confirm("Remove this image?")) return;
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

  function startAdding(type: "link" | "image" | "pdf") {
    setAddingType(type);
    setLinkTitle("");
    setLinkUrl("");
    setLinkFile(null);
    setLinkImageWidth(undefined);
    setUploadFile(null);
  }

  async function handleAdd() {
    if (!addingType) return;

    if (!linkTitle.trim()) {
      alert("Please add a title.");
      return;
    }
    if (addingType === "link" && !linkUrl.trim()) {
      alert("Please add a link.");
      return;
    }
    if (addingType !== "link" && !uploadFile) {
      alert(addingType === "image" ? "Please choose an image." : "Please choose a PDF.");
      return;
    }

    setSaving(true);
    try {
      let href = linkUrl.trim();
      let resourceImage: string | undefined;

      if (addingType === "link") {
        if (linkFile) {
          const formData = new FormData();
          formData.append("file", linkFile);
          const uploadResponse = await fetch("/api/upload", { method: "POST", body: formData });
          if (!uploadResponse.ok) {
            const result = await uploadResponse.json().catch(() => ({}));
            throw new Error(result.error ?? "Image upload failed.");
          }
          resourceImage = (await uploadResponse.json()).url;
        }
      } else {
        const formData = new FormData();
        formData.append("file", uploadFile as File);
        const uploadResponse = await fetch("/api/upload", { method: "POST", body: formData });
        if (!uploadResponse.ok) {
          const result = await uploadResponse.json().catch(() => ({}));
          throw new Error(result.error ?? "Upload failed.");
        }
        href = (await uploadResponse.json()).url;
        if (addingType === "image") resourceImage = href;
      }

      const newLink: LibraryLink = {
        id: `library-${Date.now()}`,
        title: linkTitle.trim(),
        href,
        resourceType: addingType,
        ...(resourceImage ? { image: resourceImage } : {}),
        ...(resourceImage && linkImageWidth != null ? { imageWidth: linkImageWidth } : {})
      };

      await patchWeek({ libraryLinks: [...links, newLink] });
      setAddingType(null);
      router.refresh();
    } catch (error) {
      alert(error instanceof Error ? error.message : "Something went wrong.");
    } finally {
      setSaving(false);
    }
  }

  async function handleRemoveLink(id: string) {
    if (!confirm("Remove this resource?")) return;
    setRemovingId(id);
    try {
      await patchWeek({ libraryLinks: links.filter((link) => link.id !== id) });
      router.refresh();
    } catch (error) {
      alert(error instanceof Error ? error.message : "Could not remove this.");
    } finally {
      setRemovingId(null);
    }
  }

  const atCap = links.length >= MAX_LINKS;

  return (
    <article id="library" className="infoCard infoCardLibrary">
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
              <button type="button" onClick={handleRemoveImage} disabled={saving}>
                Remove image
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
          <ul className="libraryLinksList">
            {links.map((link) =>
              link.image ? (
                <li key={link.id} className="libraryLinkButton">
                  <a href={link.href} target="_blank" rel="noreferrer" className="libraryLinkImageWrap">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={link.image}
                      alt={link.title}
                      className="bookImage"
                      style={imageWidthStyle(link.imageWidth)}
                    />
                    <span className="libraryLinkCaption">{link.title}</span>
                  </a>
                  {isEditor && (
                    <button
                      type="button"
                      className="removeButton"
                      onClick={() => handleRemoveLink(link.id)}
                      disabled={removingId === link.id}
                    >
                      {removingId === link.id ? "…" : "🗑 Remove"}
                    </button>
                  )}
                </li>
              ) : (
                <li key={link.id}>
                  <a href={link.href} target="_blank" rel="noreferrer" className="textLink">
                    {link.resourceType === "pdf" ? "📄 " : ""}
                    {link.title} ↗
                  </a>
                  {isEditor && (
                    <button
                      type="button"
                      className="removeButton"
                      onClick={() => handleRemoveLink(link.id)}
                      disabled={removingId === link.id}
                    >
                      {removingId === link.id ? "…" : "🗑"}
                    </button>
                  )}
                </li>
              )
            )}
          </ul>
        ) : (
          !isEditor && <p className="infoText">No resources added yet.</p>
        )}

        {isEditor && !addingType && (
          <div className="addActivityBar">
            <button type="button" className="addActivityButton" onClick={() => startAdding("link")} disabled={atCap}>
              🔗 Add link ({links.length}/{MAX_LINKS})
            </button>
            <button type="button" className="addActivityButton" onClick={() => startAdding("image")} disabled={atCap}>
              🖼️ Add image ({links.length}/{MAX_LINKS})
            </button>
            <button type="button" className="addActivityButton" onClick={() => startAdding("pdf")} disabled={atCap}>
              📄 Add PDF ({links.length}/{MAX_LINKS})
            </button>
          </div>
        )}

        {isEditor && addingType && (
          <div className="editForm addActivityForm">
            <input
              className="editTextarea"
              placeholder={addingType === "link" ? "Website name" : addingType === "image" ? "Image title" : "PDF title"}
              value={linkTitle}
              onChange={(event) => setLinkTitle(event.target.value)}
            />

            {addingType === "link" && (
              <input
                className="editTextarea"
                placeholder="https://..."
                value={linkUrl}
                onChange={(event) => setLinkUrl(event.target.value)}
              />
            )}

            {addingType === "link" && (
              <div className="editImageButtons">
                <button type="button" onClick={() => linkFileInputRef.current?.click()}>
                  📷 {linkFile ? "Change button image" : "Add button image (optional)"}
                </button>
                {linkFile && (
                  <button type="button" onClick={() => setLinkFile(null)}>
                    Remove image
                  </button>
                )}
              </div>
            )}
            <input
              ref={linkFileInputRef}
              type="file"
              accept="image/*"
              className="hiddenFileInput"
              onChange={(event) => setLinkFile(event.target.files?.[0] ?? null)}
            />

            {(addingType === "image" || addingType === "pdf") && (
              <input
                type="file"
                accept={addingType === "image" ? "image/*" : "application/pdf"}
                onChange={(event) => setUploadFile(event.target.files?.[0] ?? null)}
              />
            )}

            {addingType === "link" && linkFilePreview && (
              <ImageSizeControl src={linkFilePreview} width={linkImageWidth} onChange={setLinkImageWidth} />
            )}
            <div className="editActions">
              <button className="primaryButton" type="button" onClick={handleAdd} disabled={saving}>
                {saving ? "Saving…" : "Add"}
              </button>
              <button
                className="cancelButton"
                type="button"
                onClick={() => setAddingType(null)}
                disabled={saving}
              >
                Cancel
              </button>
            </div>
          </div>
        )}

        {!editingText && !addingType && <NextCardLink anchor="bonus" label="Eager Learners" />}
      </div>
    </article>
  );
}
