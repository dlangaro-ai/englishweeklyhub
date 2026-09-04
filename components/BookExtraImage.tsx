"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import ImageSizeControl from "./ImageSizeControl";
import { imageWidthStyle } from "@/lib/imageSize";

export default function BookExtraImage({
  weekNumber,
  image,
  imageWidth,
  isEditor
}: {
  weekNumber: number;
  image?: string;
  imageWidth?: number;
  isEditor: boolean;
}) {
  const [saving, setSaving] = useState(false);
  const [width, setWidth] = useState<number | undefined>(imageWidth);
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
      await patchWeek({ bookImage2: url });
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
      await patchWeek({ bookImage2: null, bookImage2Width: null });
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
      await patchWeek({ bookImage2Width: width ?? null });
      router.refresh();
    } catch (error) {
      alert(error instanceof Error ? error.message : "Could not save the size.");
    } finally {
      setSaving(false);
    }
  }

  if (!isEditor && !image) return null;

  return (
    <div className="bookExtraImage">
      {image && (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={image} alt="" className="bookImage" style={imageWidthStyle(imageWidth)} />
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
    </div>
  );
}
