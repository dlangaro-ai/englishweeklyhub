"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { LibraryLink } from "@/lib/courseData";
import ImageSizeControl from "./ImageSizeControl";

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

// Edits an item in the shared library: title, link, and picture. Changes show
// up on the All Resources page and on every week the item is pinned to.
export default function EditResourceForm({
  item,
  onDone
}: {
  item: LibraryLink;
  onDone: () => void;
}) {
  const router = useRouter();
  const type = item.resourceType ?? "link";
  const [title, setTitle] = useState(item.title.replace(/^📄\s*/, ""));
  const [url, setUrl] = useState(item.href);
  const [file, setFile] = useState<File | null>(null);
  const [removeImage, setRemoveImage] = useState(false);
  const [width, setWidth] = useState<number | undefined>(item.imageWidth);
  const [saving, setSaving] = useState(false);
  const fileInput = useRef<HTMLInputElement>(null);

  const filePreview = useMemo(() => (file ? URL.createObjectURL(file) : null), [file]);
  useEffect(() => {
    return () => {
      if (filePreview) URL.revokeObjectURL(filePreview);
    };
  }, [filePreview]);

  const shownImage = removeImage ? null : filePreview ?? item.image ?? null;

  async function handleSave() {
    if (!title.trim()) return alert("Please add a title.");
    if (type === "link" && !url.trim()) return alert("Please add a link.");

    setSaving(true);
    try {
      const body: Record<string, unknown> = { title: title.trim() };

      if (type === "link") {
        body.href = url.trim();
        if (file) body.image = await upload(file);
        else if (removeImage) body.image = null;
        if (shownImage) body.imageWidth = width ?? null;
      } else if (file) {
        // Image / PDF items: replacing the file replaces the link itself.
        body.href = await upload(file);
        if (type === "image") body.imageWidth = width ?? null;
      } else if (type === "image") {
        body.imageWidth = width ?? null;
      }

      const response = await fetch(`/api/library/${encodeURIComponent(item.id)}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body)
      });
      const result = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(result.error ?? "Could not save.");

      router.refresh();
      onDone();
    } catch (error) {
      alert(error instanceof Error ? error.message : "Something went wrong.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="editForm addActivityForm">
      <input
        className="editTextarea"
        placeholder="Title"
        value={title}
        onChange={(event) => setTitle(event.target.value)}
      />

      {type === "link" && (
        <input
          className="editTextarea"
          placeholder="https://..."
          value={url}
          onChange={(event) => setUrl(event.target.value)}
        />
      )}

      <div className="editImageButtons">
        <button type="button" onClick={() => fileInput.current?.click()}>
          {type === "pdf"
            ? "📄 Replace PDF"
            : type === "image"
              ? "🖼️ Replace image"
              : `📷 ${shownImage ? "Change button image" : "Add button image"}`}
        </button>
        {type === "link" && shownImage && (
          <button
            type="button"
            onClick={() => {
              setFile(null);
              setRemoveImage(true);
            }}
          >
            Remove image
          </button>
        )}
      </div>
      <input
        ref={fileInput}
        type="file"
        accept={type === "pdf" ? "application/pdf" : "image/*"}
        className="hiddenFileInput"
        onChange={(event) => {
          const chosen = event.target.files?.[0] ?? null;
          setFile(chosen);
          if (chosen) setRemoveImage(false);
        }}
      />
      {type === "pdf" && file && <p className="infoText">New file: {file.name}</p>}

      {type !== "pdf" && shownImage && (
        <ImageSizeControl src={shownImage} width={width} onChange={setWidth} />
      )}

      <div className="editActions">
        <button className="primaryButton" type="button" onClick={handleSave} disabled={saving}>
          {saving ? "Saving…" : "Save"}
        </button>
        <button className="cancelButton" type="button" onClick={onDone} disabled={saving}>
          Cancel
        </button>
      </div>
    </div>
  );
}
