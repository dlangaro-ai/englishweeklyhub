"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { LibraryLink } from "@/lib/courseData";
import ImageSizeControl from "./ImageSizeControl";

type ResourceType = "link" | "image" | "pdf";

async function upload(file: File): Promise<string> {
  const formData = new FormData();
  formData.append("file", file);
  const response = await fetch("/api/upload", { method: "POST", body: formData });
  if (!response.ok) {
    const result = await response.json().catch(() => ({}));
    throw new Error(result.error ?? "Upload failed.");
  }
  return (await response.json()).url;
}

// Adds a new item to the shared resource library. Used on the All Resources
// page and inside a week's Resources card (where onCreated also attaches the
// new item to that week).
export default function AddResourceForm({
  onCreated
}: {
  onCreated: (item: LibraryLink) => Promise<void> | void;
}) {
  const [type, setType] = useState<ResourceType | null>(null);
  const [title, setTitle] = useState("");
  const [url, setUrl] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [buttonImage, setButtonImage] = useState<File | null>(null);
  const [imageWidth, setImageWidth] = useState<number | undefined>(undefined);
  const [saving, setSaving] = useState(false);
  const buttonImageInput = useRef<HTMLInputElement>(null);

  const preview = useMemo(() => (buttonImage ? URL.createObjectURL(buttonImage) : null), [buttonImage]);
  useEffect(() => {
    return () => {
      if (preview) URL.revokeObjectURL(preview);
    };
  }, [preview]);

  function start(next: ResourceType) {
    setType(next);
    setTitle("");
    setUrl("");
    setFile(null);
    setButtonImage(null);
    setImageWidth(undefined);
  }

  async function handleAdd() {
    if (!type) return;
    if (!title.trim()) return alert("Please add a title.");
    if (type === "link" && !url.trim()) return alert("Please add a link.");
    if (type !== "link" && !file) return alert(type === "image" ? "Please choose an image." : "Please choose a PDF.");

    setSaving(true);
    try {
      let href = url.trim();
      let image: string | undefined;

      if (type === "link") {
        if (buttonImage) image = await upload(buttonImage);
      } else {
        href = await upload(file as File);
        if (type === "image") image = href;
      }

      const response = await fetch("/api/library", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: title.trim(),
          href,
          resourceType: type,
          ...(image ? { image } : {}),
          ...(image && imageWidth != null ? { imageWidth } : {})
        })
      });
      const result = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(result.error ?? "Could not save.");

      await onCreated(result.item as LibraryLink);
      setType(null);
    } catch (error) {
      alert(error instanceof Error ? error.message : "Something went wrong.");
    } finally {
      setSaving(false);
    }
  }

  if (!type) {
    return (
      <div className="addActivityBar">
        <button type="button" className="addActivityButton" onClick={() => start("link")}>
          🔗 New link
        </button>
        <button type="button" className="addActivityButton" onClick={() => start("image")}>
          🖼️ New image
        </button>
        <button type="button" className="addActivityButton" onClick={() => start("pdf")}>
          📄 New PDF
        </button>
      </div>
    );
  }

  return (
    <div className="editForm addActivityForm">
      <input
        className="editTextarea"
        placeholder={type === "link" ? "Website name" : type === "image" ? "Image title" : "PDF title"}
        value={title}
        onChange={(event) => setTitle(event.target.value)}
      />

      {type === "link" && (
        <>
          <input
            className="editTextarea"
            placeholder="https://..."
            value={url}
            onChange={(event) => setUrl(event.target.value)}
          />
          <div className="editImageButtons">
            <button type="button" onClick={() => buttonImageInput.current?.click()}>
              📷 {buttonImage ? "Change button image" : "Add button image (optional)"}
            </button>
            {buttonImage && (
              <button type="button" onClick={() => setButtonImage(null)}>
                Remove image
              </button>
            )}
          </div>
          <input
            ref={buttonImageInput}
            type="file"
            accept="image/*"
            className="hiddenFileInput"
            onChange={(event) => setButtonImage(event.target.files?.[0] ?? null)}
          />
          {preview && <ImageSizeControl src={preview} width={imageWidth} onChange={setImageWidth} />}
        </>
      )}

      {type !== "link" && (
        <input
          type="file"
          accept={type === "image" ? "image/*" : "application/pdf"}
          onChange={(event) => setFile(event.target.files?.[0] ?? null)}
        />
      )}

      <div className="editActions">
        <button className="primaryButton" type="button" onClick={handleAdd} disabled={saving}>
          {saving ? "Saving…" : "Add to library"}
        </button>
        <button className="cancelButton" type="button" onClick={() => setType(null)} disabled={saving}>
          Cancel
        </button>
      </div>
    </div>
  );
}
