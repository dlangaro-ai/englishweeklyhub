"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { LibraryLink } from "@/lib/courseData";
import { imageWidthStyle } from "@/lib/imageSize";
import ImageSizeControl from "./ImageSizeControl";

const MAX_LINKS = 6;

export default function LibraryCard({
  weekNumber,
  image,
  imageWidth,
  links,
  isEditor
}: {
  weekNumber: number;
  image?: string;
  imageWidth?: number;
  links: LibraryLink[];
  isEditor: boolean;
}) {
  const [saving, setSaving] = useState(false);
  const [width, setWidth] = useState<number | undefined>(imageWidth);
  const [addingLink, setAddingLink] = useState(false);
  const [linkTitle, setLinkTitle] = useState("");
  const [linkUrl, setLinkUrl] = useState("");
  const [removingId, setRemovingId] = useState<string | null>(null);
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

  async function handleAddLink() {
    if (!linkTitle.trim() || !linkUrl.trim()) {
      alert("Please add both a title and a link.");
      return;
    }

    setSaving(true);
    try {
      const newLink: LibraryLink = {
        id: `library-${Date.now()}`,
        title: linkTitle.trim(),
        href: linkUrl.trim()
      };
      await patchWeek({ libraryLinks: [...links, newLink] });
      setAddingLink(false);
      setLinkTitle("");
      setLinkUrl("");
      router.refresh();
    } catch (error) {
      alert(error instanceof Error ? error.message : "Something went wrong.");
    } finally {
      setSaving(false);
    }
  }

  async function handleRemoveLink(id: string) {
    if (!confirm("Remove this website?")) return;
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
        </div>
        <h2>Resources</h2>

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
            {links.map((link) => (
              <li key={link.id}>
                <a href={link.href} target="_blank" rel="noreferrer" className="textLink">
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
            ))}
          </ul>
        ) : (
          !isEditor && <p className="infoText">No websites added yet.</p>
        )}

        {isEditor && !addingLink && (
          <div className="addActivityBar">
            <button
              type="button"
              className="addActivityButton"
              onClick={() => setAddingLink(true)}
              disabled={atCap}
            >
              🔗 Add website ({links.length}/{MAX_LINKS})
            </button>
          </div>
        )}

        {isEditor && addingLink && (
          <div className="editForm addActivityForm">
            <input
              className="editTextarea"
              placeholder="Website name"
              value={linkTitle}
              onChange={(event) => setLinkTitle(event.target.value)}
            />
            <input
              className="editTextarea"
              placeholder="https://..."
              value={linkUrl}
              onChange={(event) => setLinkUrl(event.target.value)}
            />
            <div className="editActions">
              <button className="primaryButton" type="button" onClick={handleAddLink} disabled={saving}>
                {saving ? "Saving…" : "Add"}
              </button>
              <button
                className="cancelButton"
                type="button"
                onClick={() => setAddingLink(false)}
                disabled={saving}
              >
                Cancel
              </button>
            </div>
          </div>
        )}
      </div>
    </article>
  );
}
