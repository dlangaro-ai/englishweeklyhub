"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ExtraActivity, Week } from "@/lib/courseData";
import { sanitizeRichText } from "@/lib/sanitizeHtml";
import { imageWidthStyle } from "@/lib/imageSize";
import { useProgress } from "./ProgressProvider";
import RichTextEditor from "./RichTextEditor";
import ImageSizeControl from "./ImageSizeControl";
import ActivityImageSize from "./ActivityImageSize";

const iconFor = (type?: string) => {
  if (type === "video") return "▶️";
  if (type === "pdf") return "📄";
  if (type === "link") return "🔗";
  if (type === "image") return "🖼️";
  if (type === "list") return "📋";
  return "⭐";
};

const CAPS: Record<"link" | "image" | "pdf" | "list", number> = { link: 3, image: 3, pdf: 2, list: 5 };

type AddType = "link" | "image" | "pdf" | "list" | null;

export default function ExtraActivitiesView({ week, isEditor }: { week: Week; isEditor: boolean }) {
  const { isComplete, toggleActivity } = useProgress();
  const router = useRouter();

  const [addingType, setAddingType] = useState<AddType>(null);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [url, setUrl] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [imageWidth, setImageWidth] = useState<number | undefined>(undefined);
  const [saving, setSaving] = useState(false);
  const [removingId, setRemovingId] = useState<string | null>(null);
  const [savingSizeId, setSavingSizeId] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const filePreview = useMemo(() => (file ? URL.createObjectURL(file) : null), [file]);
  useEffect(() => {
    return () => {
      if (filePreview) URL.revokeObjectURL(filePreview);
    };
  }, [filePreview]);

  const counts = week.extraActivities.reduce<Record<string, number>>((acc, activity) => {
    if (activity.resourceType) acc[activity.resourceType] = (acc[activity.resourceType] ?? 0) + 1;
    return acc;
  }, {});

  function startAdding(type: AddType) {
    setAddingType(type);
    setTitle("");
    setDescription("");
    setUrl("");
    setFile(null);
    setImageWidth(undefined);
  }

  function cancelAdding() {
    setAddingType(null);
  }

  async function saveActivities(nextActivities: ExtraActivity[]) {
    const response = await fetch(`/api/weeks/${week.number}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ extraActivities: nextActivities })
    });

    if (!response.ok) {
      const result = await response.json().catch(() => ({}));
      throw new Error(result.error ?? "Could not save changes.");
    }
  }

  async function handleAdd() {
    if (!addingType || !title.trim()) {
      alert("Please add a title.");
      return;
    }

    if (addingType === "list" && !description.trim()) {
      alert("Please add at least one list item.");
      return;
    }

    setSaving(true);

    try {
      let href = url.trim();

      if (addingType === "image" || addingType === "pdf") {
        if (!file) {
          alert("Please choose a file.");
          setSaving(false);
          return;
        }
        const formData = new FormData();
        formData.append("file", file);
        const uploadResponse = await fetch("/api/upload", { method: "POST", body: formData });
        if (!uploadResponse.ok) {
          const result = await uploadResponse.json().catch(() => ({}));
          throw new Error(result.error ?? "Upload failed.");
        }
        href = (await uploadResponse.json()).url;
      } else if (addingType === "link" && !href) {
        alert("Please add a link.");
        setSaving(false);
        return;
      }

      const newActivity: ExtraActivity = {
        id: `activity-${Date.now()}`,
        title: title.trim(),
        description: description.trim() || undefined,
        href: addingType === "list" ? undefined : href,
        resourceType: addingType,
        ...(addingType === "image" && imageWidth != null ? { imageWidth } : {})
      };

      await saveActivities([...week.extraActivities, newActivity]);
      setAddingType(null);
      router.refresh();
    } catch (error) {
      alert(error instanceof Error ? error.message : "Something went wrong.");
    } finally {
      setSaving(false);
    }
  }

  async function handleRemove(activityId: string) {
    if (!confirm("Remove this activity?")) return;

    setRemovingId(activityId);

    try {
      await saveActivities(week.extraActivities.filter((activity) => activity.id !== activityId));
      router.refresh();
    } catch (error) {
      alert(error instanceof Error ? error.message : "Could not remove this.");
    } finally {
      setRemovingId(null);
    }
  }

  async function handleActivityWidth(activityId: string, width: number) {
    setSavingSizeId(activityId);

    try {
      await saveActivities(
        week.extraActivities.map((activity) =>
          activity.id === activityId ? { ...activity, imageWidth: width } : activity
        )
      );
      router.refresh();
    } catch (error) {
      alert(error instanceof Error ? error.message : "Could not save the size.");
    } finally {
      setSavingSizeId(null);
    }
  }

  return (
    <main className="shell narrow">
      <Link href={`/week/${week.number}`} className="backLink">← Week {week.number}</Link>

      <header className="skillHero">
        <div className="skillIcon large">🎁</div>
        <div>
          <p className="eyebrow">WEEK {week.number} · BONUS</p>
          <h1>Extra Activities</h1>
          <p className="heroText">
            Optional fun practice for this week — try one whenever you like!
          </p>
        </div>
      </header>

      {isEditor && (
        <div className="addActivityBar">
          {(["link", "image", "pdf", "list"] as const).map((type) => {
            const count = counts[type] ?? 0;
            const atCap = count >= CAPS[type];
            return (
              <button
                key={type}
                type="button"
                className="addActivityButton"
                disabled={atCap}
                onClick={() => startAdding(type)}
              >
                {iconFor(type)} Add {type} ({count}/{CAPS[type]})
              </button>
            );
          })}
        </div>
      )}

      {addingType && (
        <div className="editForm addActivityForm">
          <input
            className="editTextarea"
            placeholder="Title"
            value={title}
            onChange={(event) => setTitle(event.target.value)}
          />
          {addingType === "list" ? (
            <textarea
              className="editTextarea"
              placeholder="One item per line"
              rows={5}
              value={description}
              onChange={(event) => setDescription(event.target.value)}
            />
          ) : (
            <RichTextEditor
              key={addingType}
              value={description}
              onChange={setDescription}
              maxWords={200}
            />
          )}
          {addingType === "link" && (
            <input
              className="editTextarea"
              placeholder="https://..."
              value={url}
              onChange={(event) => setUrl(event.target.value)}
            />
          )}
          {(addingType === "image" || addingType === "pdf") && (
            <input
              ref={fileInputRef}
              type="file"
              accept={addingType === "image" ? "image/*" : "application/pdf"}
              onChange={(event) => setFile(event.target.files?.[0] ?? null)}
            />
          )}
          {addingType === "image" && filePreview && (
            <ImageSizeControl src={filePreview} width={imageWidth} onChange={setImageWidth} />
          )}
          <div className="editActions">
            <button className="primaryButton" type="button" onClick={handleAdd} disabled={saving}>
              {saving ? "Saving…" : "Add"}
            </button>
            <button className="cancelButton" type="button" onClick={cancelAdding} disabled={saving}>
              Cancel
            </button>
          </div>
        </div>
      )}

      <section className="activityList">
        {week.extraActivities.length === 0 ? (
          <div className="emptyState compact">
            <div className="emptyIcon">✨</div>
            <h2>Nothing here yet</h2>
            <p>Check back soon — extra activities will appear here.</p>
          </div>
        ) : (
          week.extraActivities.map((activity, index) => {
            const done = isComplete(activity.id);
            return (
              <article className={`activityCard ${done ? "activityDone" : ""}`} key={activity.id}>
                <div className="activityIndex">{done ? "✓" : iconFor(activity.resourceType)}</div>
                <div className="activityBody">
                  <span className="activityType">EXTRA ACTIVITY {index + 1}</span>
                  <h2>{activity.title}</h2>
                  {activity.resourceType === "list" ? (
                    activity.description && (
                      <ul className="simpleList">
                        {activity.description
                          .split("\n")
                          .map((line) => line.trim())
                          .filter(Boolean)
                          .map((line, lineIndex) => (
                            <li key={lineIndex}>{line}</li>
                          ))}
                      </ul>
                    )
                  ) : (
                    activity.description && (
                      <div
                        className="richTextDisplay"
                        dangerouslySetInnerHTML={{ __html: sanitizeRichText(activity.description) }}
                      />
                    )
                  )}
                  {activity.resourceType === "image" && activity.href && (
                    <>
                      <a href={activity.href} target="_blank" rel="noreferrer">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={activity.href}
                          alt={activity.title}
                          className="activityThumbnail"
                          style={imageWidthStyle(activity.imageWidth)}
                        />
                      </a>
                      {isEditor && (
                        <ActivityImageSize
                          src={activity.href}
                          width={activity.imageWidth}
                          saving={savingSizeId === activity.id}
                          onSave={(width) => handleActivityWidth(activity.id, width)}
                        />
                      )}
                    </>
                  )}
                  {activity.resourceType !== "image" && activity.href && (
                    <a href={activity.href} target="_blank" rel="noreferrer" className="textLink">
                      Open resource ↗
                    </a>
                  )}
                </div>
                <div className="activityActions">
                  <button
                    className="completeButton"
                    onClick={() => toggleActivity(week.number, activity.id, activity.title)}
                  >
                    {done ? "Completed" : "Mark complete"}
                  </button>
                  {isEditor && (
                    <button
                      className="removeButton"
                      type="button"
                      onClick={() => handleRemove(activity.id)}
                      disabled={removingId === activity.id}
                    >
                      {removingId === activity.id ? "Removing…" : "🗑 Remove"}
                    </button>
                  )}
                </div>
              </article>
            );
          })
        )}
      </section>
    </main>
  );
}
