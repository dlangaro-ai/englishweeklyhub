// Shared rules for the per-image width control used by the Edit-mode slider.
// Widths are stored as a plain pixel number on the week (e.g. summaryImageWidth)
// or on an extra activity (imageWidth). Unset = fall back to the CSS default.

export const DEFAULT_IMAGE_WIDTH = 160;
export const MIN_IMAGE_WIDTH = 80;
export const MAX_IMAGE_WIDTH = 600;

/**
 * Coerce anything into a safe stored width, or undefined if it isn't a usable
 * number. Used on the server before persisting, so a bad payload can't write a
 * silly value.
 */
export function clampImageWidth(value: unknown): number | undefined {
  const n = Number(value);
  if (!Number.isFinite(n)) return undefined;
  return Math.min(MAX_IMAGE_WIDTH, Math.max(MIN_IMAGE_WIDTH, Math.round(n)));
}

/** Inline style for a displayed image, or undefined to leave the CSS default. */
export function imageWidthStyle(width?: number): { width: string; maxWidth: string } | undefined {
  return width ? { width: `${width}px`, maxWidth: "100%" } : undefined;
}
