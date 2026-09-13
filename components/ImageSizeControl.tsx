"use client";

import {
  DEFAULT_IMAGE_WIDTH,
  MAX_IMAGE_WIDTH,
  MIN_IMAGE_WIDTH,
  ImageAlign,
  imageAlignStyle
} from "@/lib/imageSize";

const ALIGN_OPTIONS: { value: ImageAlign; label: string }[] = [
  { value: "left", label: "Left" },
  { value: "center", label: "Center" },
  { value: "right", label: "Right" }
];

// Slider + live preview for setting how wide an image shows on the page.
// The preview renders at the real chosen width (capped to its container) so
// the teacher sees exactly what students will get.
export default function ImageSizeControl({
  src,
  width,
  onChange,
  align,
  onAlignChange
}: {
  src: string;
  width?: number;
  onChange: (width: number) => void;
  align?: ImageAlign;
  onAlignChange?: (align: ImageAlign) => void;
}) {
  const current = width ?? DEFAULT_IMAGE_WIDTH;
  const currentAlign = align ?? "left";

  return (
    <div className="imageSizeControl">
      <div className="imageSizePreviewWrap">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={src}
          alt=""
          className="imageSizePreview"
          style={{ width: `${current}px`, maxWidth: "100%", display: "block", ...imageAlignStyle(currentAlign) }}
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
      {onAlignChange && (
        <div className="imageAlignControl">
          <span>Image position</span>
          <div className="imageAlignButtons">
            {ALIGN_OPTIONS.map((option) => (
              <button
                key={option.value}
                type="button"
                className={`imageAlignButton${currentAlign === option.value ? " active" : ""}`}
                onClick={() => onAlignChange(option.value)}
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
