// A link typed as "wordwall.net/resource/123" has no scheme, so the browser
// treats it as a path on this site (tedank5.vercel.app/wordwall.net/...).
// Add https:// when the scheme is missing; leave full URLs and site paths alone.
export function normalizeUrl(href: string): string {
  const trimmed = href.trim();
  if (!trimmed) return trimmed;
  if (/^[a-z][a-z0-9+.-]*:/i.test(trimmed)) {
    return /^(https?|mailto):/i.test(trimmed) ? trimmed : "#";
  }
  if (trimmed.startsWith("/") && !trimmed.startsWith("//")) return trimmed;
  return `https://${trimmed.replace(/^\/\//, "")}`;
}
