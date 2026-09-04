"use client";

import { DEFAULT_IMAGE_WIDTH, MAX_IMAGE_WIDTH, MIN_IMAGE_WIDTH } from "@/lib/imageSize";

// Slider + live preview for setting how wide an image shows on the page.
// The preview renders at the real chosen width (capped to its container) so
// the teacher sees exactly what students will get.
export default function ImageSizeControl({
  src,
  width,
  onChange
}: {
  src: string;
  width?: number;
  onChange: (width: number) => void;
}) {
  const current = width ?? DEFAULT_IMAGE_WIDTH;

  return (
    <div className="imageSizeControl">
      <div className="imageSizePreviewWrap">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={src}
          alt=""
          className="imageSizePreview"
          style={{ width: `${current}px`, maxWidth: "100%" }}
        />
      </div>
      <label className="imageSizeSlider">
        <span>Image width</span>
        <input
          type="range"
          min={MIN_IMAGE_WIDTH}
          max={MAX_IMAGE_WIDTH}
          step={10}
          value={current}
          onChange={(event) => onChange(Number(event.target.value))}
        />
        <span className="imageSizeValue">{current}px</span>
      </label>
    </div>
  );
}
