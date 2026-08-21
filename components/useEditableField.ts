"use client";

import { useRouter } from "next/navigation";
import { useRef, useState } from "react";

type UseEditableFieldArgs = {
  weekNumber: number;
  field: string;
  imageField: string;
  isList: boolean;
  initialText: string;
  initialImage?: string;
};

export function useEditableField({
  weekNumber,
  field,
  imageField,
  isList,
  initialText,
  initialImage
}: UseEditableFieldArgs) {
  const [editing, setEditing] = useState(false);
  const [text, setText] = useState(initialText);
  const [imagePreview, setImagePreview] = useState(initialImage);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imageRemoved, setImageRemoved] = useState(false);
  const [saving, setSaving] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  function startEdit() {
    setText(initialText);
    setImagePreview(initialImage);
    setImageFile(null);
    setImageRemoved(false);
    setEditing(true);
  }

  function cancelEdit() {
    setEditing(false);
  }

  function handleFileChange(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;
    setImageFile(file);
    setImageRemoved(false);
    setImagePreview(URL.createObjectURL(file));
  }

  function handleRemoveImage() {
    setImageFile(null);
    setImagePreview(undefined);
    setImageRemoved(true);
  }

  async function save() {
    setSaving(true);

    try {
      let uploadedUrl: string | undefined;

      if (imageFile) {
        const formData = new FormData();
        formData.append("file", imageFile);
        const uploadResponse = await fetch("/api/upload", { method: "POST", body: formData });
        if (!uploadResponse.ok) throw new Error("upload failed");
        uploadedUrl = (await uploadResponse.json()).url;
      }

      const payload: Record<string, unknown> = {
        [field]: isList
          ? text.split("\n").map((line) => line.trim()).filter(Boolean)
          : text
      };

      if (uploadedUrl) payload[imageField] = uploadedUrl;
      else if (imageRemoved) payload[imageField] = null;

      const response = await fetch(`/api/weeks/${weekNumber}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });

      if (!response.ok) throw new Error("save failed");

      setEditing(false);
      router.refresh();
    } catch {
      alert("Sorry, something went wrong saving this. Please try again.");
    } finally {
      setSaving(false);
    }
  }

  return {
    editing,
    text,
    setText,
    imagePreview,
    saving,
    fileInputRef,
    startEdit,
    cancelEdit,
    handleFileChange,
    handleRemoveImage,
    save
  };
}
