const ALLOWED_TAGS = new Set([
  "span", "br", "b", "i", "u", "strong", "em", "mark", "div", "p", "ul", "ol", "li"
]);
const ALLOWED_STYLE_PROPS = new Set([
  "font-family", "font-size", "background-color", "color", "text-align"
]);

// Minimal allowlist sanitizer for the rich-text summary field. Only the
// logged-in teacher can write this content (via RichTextEditor's own
// constrained toolbar), but this strips anything else out as a safety net —
// no scripts, no event handlers, no arbitrary tags/styles.
export function sanitizeRichText(html: string): string {
  let cleaned = html
    .replace(/<script[\s\S]*?>[\s\S]*?<\/script>/gi, "")
    .replace(/<style[\s\S]*?>[\s\S]*?<\/style>/gi, "")
    .replace(/ on\w+\s*=\s*"[^"]*"/gi, "")
    .replace(/ on\w+\s*=\s*'[^']*'/gi, "")
    .replace(/javascript:/gi, "");

  cleaned = cleaned.replace(/<(\/?)([a-zA-Z0-9]+)([^>]*)>/g, (_match, closing, tagName, attrs) => {
    const tag = tagName.toLowerCase();
    if (!ALLOWED_TAGS.has(tag)) return "";
    if (closing) return `</${tag}>`;

    const styleMatch = /style\s*=\s*"([^"]*)"/i.exec(attrs) ?? /style\s*=\s*'([^']*)'/i.exec(attrs);
    if (!styleMatch) return `<${tag}>`;

    const safeDeclarations = styleMatch[1]
      .split(";")
      .map((decl) => decl.trim())
      .filter(Boolean)
      .filter((decl) => {
        const [prop] = decl.split(":");
        return Boolean(prop && ALLOWED_STYLE_PROPS.has(prop.trim().toLowerCase()));
      })
      .join("; ");

    return safeDeclarations ? `<${tag} style="${safeDeclarations}">` : `<${tag}>`;
  });

  return cleaned;
}

// "list" activities used to store their items as plain "one per line" text.
// Newer ones store rich HTML from RichTextEditor. This normalises either form
// to HTML so it can go through sanitizeRichText and render consistently.
export function listActivityToHtml(value: string): string {
  const text = value.trim();
  if (!text) return "";
  if (/<[a-zA-Z]/.test(text)) return text;

  const items = text
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line) => line.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;"));

  return `<ul>${items.map((item) => `<li>${item}</li>`).join("")}</ul>`;
}
