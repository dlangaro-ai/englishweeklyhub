"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function PublishToggle({
  weekNumber,
  published,
  isEditor
}: {
  weekNumber: number;
  published: boolean;
  isEditor: boolean;
}) {
  const [saving, setSaving] = useState(false);
  const router = useRouter();

  if (!isEditor) return null;

  async function toggle() {
    setSaving(true);
    try {
      const response = await fetch(`/api/weeks/${weekNumber}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ published: !published })
      });
      if (response.ok) router.refresh();
    } finally {
      setSaving(false);
    }
  }

  return (
    <button
      className={`publishToggle ${published ? "publishToggleOn" : ""}`}
      type="button"
      onClick={toggle}
      disabled={saving}
    >
      {published ? "✅ Published — click to unpublish" : "🔒 Not published — click to publish"}
    </button>
  );
}
