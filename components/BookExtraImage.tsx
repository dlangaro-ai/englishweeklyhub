"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";

export default function BookExtraImage({
  weekNumber,
  image,
  isEditor
}: {
  weekNumber: number;
  image?: string;
  isEditor: boolean;
}) {
  const [saving, setSaving] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  async function saveImage(url: string | null) {
    const response = await fetch(`/api/weeks/${weekNumber}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ bookImage2: url })
    });
    if (!response.ok) {
      const result = await response.json().catch(() => ({}));
      throw new Error(result.error ?? "Could not save.");
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
      await saveImage(url);
      router.refresh();
    } catch (error) {
      alert(error instanceof Error ? error.message : "Something went wrong.");
    } finally {
      setSaving(false);
    }
  }

  async function handleRemove() {
    if (!confirm("Remove this image?")) return;
    setSaving(true);
    try {
      await saveImage(null);
      router.refresh();
    } catch (error) {
      alert(error instanceof Error ? error.message : "Could not remove this.");
    } finally {
      setSaving(false);
    }
  }

  if (!isEditor && !image) return null;

  return (
    <div className="bookExtraImage">
      {image && (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={image} alt="" className="bookImage" />
      )}
      {isEditor && (
        <div className="editImageButtons">
          <button type="button" onClick={() => fileInputRef.current?.click()} disabled={saving}>
            📷 {image ? "Change 2nd image" : "Add 2nd image"}
          </button>
          {image && (
            <button type="button" onClick={handleRemove} disabled={saving}>
              Remove
            </button>
          )}
        </div>
      )}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        className="hiddenFileInput"
        onChange={handleFileChange}
      />
    </div>
  );
}
