"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import type { VocabularyItem } from "@/lib/vocabulary";

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

// Teacher-only bar on the Vocabulary page for uploading a new PDF.
export function VocabularyAddBar() {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [saving, setSaving] = useState(false);

  function close() {
    setOpen(false);
    setTitle("");
    setFile(null);
  }

  async function handleAdd() {
    if (!title.trim()) return alert("Please add a title.");
    if (!file) return alert("Please choose a PDF.");

    setSaving(true);
    try {
      const href = await upload(file);
      const response = await fetch("/api/vocabulary", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title: title.trim(), href })
      });
      const result = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(result.error ?? "Could not save.");

      close();
      router.refresh();
    } catch (error) {
      alert(error instanceof Error ? error.message : "Something went wrong.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="libraryAddBar">
      {!open ? (
        <div className="addActivityBar">
          <button type="button" className="addActivityButton" onClick={() => setOpen(true)}>
            📄 New vocabulary PDF
          </button>
        </div>
      ) : (
        <div className="editForm addActivityForm">
          <input
            className="editTextarea"
            placeholder="PDF title"
            value={title}
            onChange={(event) => setTitle(event.target.value)}
          />
          <input
            type="file"
            accept="application/pdf"
            onChange={(event) => setFile(event.target.files?.[0] ?? null)}
          />
          <div className="editActions">
            <button className="primaryButton" type="button" onClick={handleAdd} disabled={saving}>
              {saving ? "Saving…" : "Add to Vocabulary"}
            </button>
            <button className="cancelButton" type="button" onClick={close} disabled={saving}>
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

// Teacher-only controls under a vocabulary card: rename, replace the file, delete.
export function VocabularyAdmin({ item }: { item: VocabularyItem }) {
  const router = useRouter();
  const [busy, setBusy] = useState(false);
  const [armed, setArmed] = useState(false);
  const [editing, setEditing] = useState(false);
  const [title, setTitle] = useState(item.title);
  const [file, setFile] = useState<File | null>(null);

  async function handleSave() {
    if (!title.trim()) return alert("Please add a title.");

    setBusy(true);
    try {
      const body: Record<string, string> = { title: title.trim() };
      if (file) body.href = await upload(file);

      const response = await fetch(`/api/vocabulary/${encodeURIComponent(item.id)}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body)
      });
      const result = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(result.error ?? "Could not save.");

      setEditing(false);
      setFile(null);
      router.refresh();
    } catch (error) {
      alert(error instanceof Error ? error.message : "Something went wrong.");
    } finally {
      setBusy(false);
    }
  }

  async function handleDelete() {
    if (!armed) {
      setArmed(true);
      return;
    }
    setArmed(false);
    setBusy(true);
    try {
      const response = await fetch(`/api/vocabulary/${encodeURIComponent(item.id)}`, { method: "DELETE" });
      if (!response.ok) {
        const result = await response.json().catch(() => ({}));
        throw new Error(result.error ?? "Could not delete.");
      }
      router.refresh();
    } catch (error) {
      alert(error instanceof Error ? error.message : "Something went wrong.");
    } finally {
      setBusy(false);
    }
  }

  if (editing) {
    return (
      <div className="resourceAdmin">
        <div className="editForm addActivityForm">
          <input
            className="editTextarea"
            placeholder="PDF title"
            value={title}
            onChange={(event) => setTitle(event.target.value)}
          />
          <label>
            Replace PDF (optional){" "}
            <input
              type="file"
              accept="application/pdf"
              onChange={(event) => setFile(event.target.files?.[0] ?? null)}
            />
          </label>
          <div className="editActions">
            <button className="primaryButton" type="button" onClick={handleSave} disabled={busy}>
              {busy ? "Saving…" : "Save"}
            </button>
            <button
              className="cancelButton"
              type="button"
              onClick={() => {
                setEditing(false);
                setTitle(item.title);
                setFile(null);
              }}
              disabled={busy}
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="resourceAdmin">
      <button type="button" className="editButton" onClick={() => setEditing(true)} disabled={busy}>
        ✏️ Edit
      </button>
      <button
        type="button"
        className="removeButton"
        onClick={handleDelete}
        onBlur={() => setArmed(false)}
        disabled={busy}
      >
        {armed ? "Click again to delete" : "🗑 Delete"}
      </button>
    </div>
  );
}
