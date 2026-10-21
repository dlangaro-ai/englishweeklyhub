const ALLOWED_TAGS = new Set([
  "span", "br", "b", "i", "u", "strong", "em", "mark", "div", "p", "a", "ul", "ol", "li"
]);
const ALLOWED_STYLE_PROPS = new Set([
  "font-family", "font-size", "background-color", "color", "text-align"
]);

function isSafeHref(href: string): boolean {
  const trimmed = href.trim();
  if (!trimmed) return false;
  if (/^https?:\/\//i.test(trimmed)) return true;
  if (trimmed.startsWith("/")) return true;
  return false;
}

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
    const safeDeclarations = styleMatch
      ? styleMatch[1]
          .split(";")
          .map((decl) => decl.trim())
          .filter(Boolean)
          .filter((decl) => {
            const [prop] = decl.split(":");
            return Boolean(prop && ALLOWED_STYLE_PROPS.has(prop.trim().toLowerCase()));
          })
          .join("; ")
      : "";

    let hrefAttr = "";
    if (tag === "a") {
      const hrefMatch = /href\s*=\s*"([^"]*)"/i.exec(attrs) ?? /href\s*=\s*'([^']*)'/i.exec(attrs);
      const href = hrefMatch?.[1] ?? "";
      if (isSafeHref(href)) {
        hrefAttr = ` href="${href.trim().replace(/"/g, "&quot;")}" target="_blank" rel="noreferrer"`;
      }
    }

    const styleAttr = safeDeclarations ? ` style="${safeDeclarations}"` : "";
    return `<${tag}${hrefAttr}${styleAttr}>`;
  });

  // Empty bullet points still draw a dot, so drop them (and any list left
  // with nothing in it).
  const emptyItem = /<li[^>]*>(?:\s|&nbsp;|<br>|<(span|b|i|u|strong|em)[^>]*>(?:\s|&nbsp;|<br>)*<\/\1>)*<\/li>/gi;
  const emptyList = /<(ul|ol)[^>]*>\s*<\/\1>/gi;
  let previous;
  do {
    previous = cleaned;
    cleaned = cleaned.replace(emptyItem, "").replace(emptyList, "");
  } while (cleaned !== previous);

  return cleaned;
}

// Cleans HTML pasted from Word, Google Docs or web pages so it fits the site:
// keeps bold / italic / underline, real lists, links, colours and alignment,
// but drops the source's fonts and sizes, hidden Word markup and the fake
// "·" bullet characters Word pastes in front of list items. Browser-only
// (uses DOMParser); the result still goes through sanitizeRichText.
export function cleanPastedHtml(html: string): string {
  const doc = new DOMParser().parseFromString(html, "text/html");
  const body = doc.body;

  body.querySelectorAll("style, script, meta, title, link, xml, o\\:p").forEach((node) => node.remove());

  const walker = doc.createTreeWalker(body, NodeFilter.SHOW_COMMENT);
  const comments: Node[] = [];
  while (walker.nextNode()) comments.push(walker.currentNode);
  comments.forEach((node) => node.parentNode?.removeChild(node));

  // Word's pretend bullets / numbers ("·", "o", "1.") sit in mso-list:Ignore spans.
  const listKinds = new Map<Element, "ul" | "ol">();
  body.querySelectorAll<HTMLElement>("[style]").forEach((node) => {
    if (/mso-list\s*:\s*ignore/i.test(node.getAttribute("style") ?? "")) {
      const marker = node.textContent?.trim() ?? "";
      const paragraph = node.closest("p");
      if (paragraph) listKinds.set(paragraph, /^[0-9a-z]+[.)]$/i.test(marker) ? "ol" : "ul");
      node.remove();
    }
  });

  // Turn runs of Word list paragraphs into real lists.
  const isWordListItem = (node: Element | null): node is HTMLElement =>
    !!node &&
    node.tagName === "P" &&
    (listKinds.has(node) || /MsoListParagraph/i.test(node.className) || /mso-list/i.test(node.getAttribute("style") ?? ""));

  body.querySelectorAll("p").forEach((paragraph) => {
    if (!paragraph.isConnected || !isWordListItem(paragraph)) return;
    const kind = listKinds.get(paragraph) ?? "ul";
    const list = doc.createElement(kind);
    paragraph.before(list);
    let current: Element | null = paragraph;
    while (isWordListItem(current)) {
      const next: Element | null = current.nextElementSibling;
      const item = doc.createElement("li");
      while (current.firstChild) item.appendChild(current.firstChild);
      list.appendChild(item);
      current.remove();
      current = next;
    }
  });

  // Google Docs wraps everything in <b style="font-weight:normal">; unwrap it
  // so pasted text isn't all bold.
  body.querySelectorAll<HTMLElement>("b, strong").forEach((node) => {
    if (/font-weight\s*:\s*(normal|400)/i.test(node.getAttribute("style") ?? "")) {
      node.replaceWith(...Array.from(node.childNodes));
    }
  });

  // Inline styles that mean bold / italic / underline become real tags.
  body.querySelectorAll<HTMLElement>("span").forEach((span) => {
    const style = span.style;
    const wrap = (tag: string) => {
      const wrapper = doc.createElement(tag);
      while (span.firstChild) wrapper.appendChild(span.firstChild);
      span.appendChild(wrapper);
    };
    if (style.fontWeight === "bold" || Number(style.fontWeight) >= 600) wrap("b");
    if (style.fontStyle === "italic") wrap("i");
    if (/underline/.test(style.textDecoration || style.textDecorationLine)) wrap("u");
  });

  // Headings become bold paragraphs.
  body.querySelectorAll("h1, h2, h3, h4, h5, h6").forEach((heading) => {
    const paragraph = doc.createElement("p");
    const bold = doc.createElement("b");
    while (heading.firstChild) bold.appendChild(heading.firstChild);
    paragraph.appendChild(bold);
    heading.replaceWith(paragraph);
  });

  // Keep only colour, highlight and alignment; plain black and "no
  // background" are the default anyway, so they're dropped too.
  const isDefaultColor = (value: string) =>
    !value || /^(#000000|#000|black|windowtext|rgb\(0,\s*0,\s*0\)|inherit|initial|auto)$/i.test(value.trim());
  const isNoBackground = (value: string) =>
    !value || /^(transparent|white|#fff|#ffffff|rgb\(255,\s*255,\s*255\)|rgba\(0,\s*0,\s*0,\s*0\)|inherit|initial)$/i.test(value.trim());

  body.querySelectorAll<HTMLElement>("*").forEach((node) => {
    const color = node.style.color;
    const background = node.style.backgroundColor;
    const align = node.style.textAlign;
    for (const attr of Array.from(node.attributes)) {
      if (!(node.tagName === "A" && attr.name === "href")) node.removeAttribute(attr.name);
    }
    if (!isDefaultColor(color)) node.style.color = color;
    if (!isNoBackground(background)) node.style.backgroundColor = background;
    if (align && align !== "left" && align !== "start") node.style.textAlign = align;
  });

  return sanitizeRichText(body.innerHTML.replace(/&nbsp;/g, " "));
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
