"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { LibraryLink } from "@/lib/courseData";
import AddResourceForm from "./AddResourceForm";
import EditResourceForm from "./EditResourceForm";

export type WeekOption = { number: number; title: string; ids: string[] };

const MAX_PER_WEEK = 12;

// Teacher-only controls under a card on the All Resources page: put the item
// on a week, or delete it from the library (which also takes it off weeks).
export function ResourceAdmin({ item, weeks }: { item: LibraryLink; weeks: WeekOption[] }) {
  const id = item.id;
  const router = useRouter();
  const [busy, setBusy] = useState(false);
  const [armed, setArmed] = useState(false);
  const [editing, setEditing] = useState(false);

  const addable = weeks.filter((week) => !week.ids.includes(id) && week.ids.length < MAX_PER_WEEK);

  async function addToWeek(weekNumber: number) {
    const week = weeks.find((w) => w.number === weekNumber);
    if (!week) return;
    setBusy(true);
    try {
      const response = await fetch(`/api/weeks/${weekNumber}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ resourceIds: [...week.ids, id] })
      });
      if (!response.ok) {
        const result = await response.json().catch(() => ({}));
        throw new Error(result.error ?? "Could not add to the week.");
      }
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
      const response = await fetch(`/api/library/${encodeURIComponent(id)}`, { method: "DELETE" });
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
        <EditResourceForm item={item} onDone={() => setEditing(false)} />
      </div>
    );
  }

  return (
    <div className="resourceAdmin">
      <select
        className="resourceAdminSelect"
        value=""
        disabled={busy || addable.length === 0}
        onChange={(event) => addToWeek(Number(event.target.value))}
        aria-label="Add this resource to a week"
      >
        <option value="" disabled>
          📌 Add to week…
        </option>
        {addable.map((week) => (
          <option key={week.number} value={week.number}>
            Week {week.number} — {week.title}
          </option>
        ))}
      </select>
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

export function LibraryAddBar() {
  const router = useRouter();
  return (
    <div className="libraryAddBar">
      <AddResourceForm onCreated={() => router.refresh()} />
    </div>
  );
}
