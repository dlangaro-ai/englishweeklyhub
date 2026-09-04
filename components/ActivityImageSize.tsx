"use client";

import { useState } from "react";
import ImageSizeControl from "./ImageSizeControl";

// Edit-mode size slider for an image that's already on an Extra Activity.
// Keeps its own draft width and only persists when "Save size" is pressed.
export default function ActivityImageSize({
  src,
  width,
  saving,
  onSave
}: {
  src: string;
  width?: number;
  saving: boolean;
  onSave: (width: number) => void;
}) {
  const [draft, setDraft] = useState<number | undefined>(width);

  return (
    <div className="activityImageSize">
      <ImageSizeControl src={src} width={draft} onChange={setDraft} />
      <button
        type="button"
        className="primaryButton"
        onClick={() => draft != null && onSave(draft)}
        disabled={saving || draft === width}
      >
        {saving ? "Saving…" : "Save size"}
      </button>
    </div>
  );
}
