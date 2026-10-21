"use client";

import { useEffect, useRef, useState } from "react";
import { cleanPastedHtml, sanitizeRichText } from "@/lib/sanitizeHtml";

const FONT_FAMILIES = ["Arial", "Comic Sans MS", "Georgia", "Verdana", "Times New Roman"];
const FONT_SIZES = [
  { label: "Small", value: "14px" },
  { label: "Large", value: "20px" },
  { label: "Extra large", value: "26px" }
];
const TEXT_COLORS = [
  { label: "Red", value: "#e53935" },
  { label: "Orange", value: "#f08a24" },
  { label: "Gold", value: "#c99700" },
  { label: "Green", value: "#1f9d68" },
  { label: "Teal", value: "#00897b" },
  { label: "Blue", value: "#2f8fef" },
  { label: "Navy", value: "#1f2a44" },
  { label: "Purple", value: "#6c63ff" },
  { label: "Pink", value: "#e84a86" },
  { label: "Brown", value: "#8d5a3b" },
  { label: "Grey", value: "#697386" },
  { label: "Black", value: "#000000" }
];
const HIGHLIGHTS = [
  { label: "Yellow", value: "#fff176" },
  { label: "Green", value: "#c8f7c5" },
  { label: "Blue", value: "#cfe8ff" },
  { label: "Pink", value: "#ffd6e7" },
  { label: "Orange", value: "#ffe0b2" },
  { label: "Purple", value: "#e4dbfb" }
];

type StyleProp = "fontFamily" | "fontSize" | "color" | "backgroundColor";
type ToggleState = Record<string, boolean>;
type MenuId = "font" | "size" | "color" | "highlight";

const TOGGLES = [
  "bold",
  "italic",
  "underline",
  "insertUnorderedList",
  "insertOrderedList",
  "justifyLeft",
  "justifyCenter",
  "justifyRight"
];

function countWords(text: string) {
  const trimmed = text.trim();
  return trimmed ? trimmed.split(/\s+/).length : 0;
}

// A small Word-like editor. Everything that can go through the browser's own
// editing commands does, so Undo / Redo (and Ctrl+Z / Ctrl+Y) work, and every
// style has a way back: "Default" font, "Normal" size, "Automatic" colour,
// "No highlight" and "Clear formatting".
export default function RichTextEditor({
  value,
  onChange,
  maxWords = 300
}: {
  value: string;
  onChange: (html: string) => void;
  maxWords?: number;
}) {
  const editorRef = useRef<HTMLDivElement>(null);
  const savedRangeRef = useRef<Range | null>(null);
  const [wordCount, setWordCount] = useState(0);
  const [active, setActive] = useState<ToggleState>({});
  const [openMenu, setOpenMenu] = useState<MenuId | null>(null);
  const toolbarRef = useRef<HTMLDivElement>(null);

  // Close an open menu when clicking anywhere else.
  useEffect(() => {
    if (!openMenu) return;
    function onPointerDown(event: MouseEvent) {
      if (!toolbarRef.current?.contains(event.target as Node)) setOpenMenu(null);
    }
    document.addEventListener("mousedown", onPointerDown);
    return () => document.removeEventListener("mousedown", onPointerDown);
  }, [openMenu]);

  useEffect(() => {
    const el = editorRef.current;
    if (!el) return;
    // Cleaning on load also repairs older content (e.g. empty bullets).
    el.innerHTML = sanitizeRichText(value || "");
    setWordCount(countWords(el.innerText));
    // Runs once on mount only — this editor is uncontrolled after that,
    // so React never fights the browser over cursor position.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Keep the toolbar in step with the cursor, like Word's highlighted B / I / U.
  useEffect(() => {
    function onSelectionChange() {
      const el = editorRef.current;
      const selection = window.getSelection();
      if (!el || !selection || selection.rangeCount === 0 || !el.contains(selection.anchorNode)) return;
      savedRangeRef.current = selection.getRangeAt(0).cloneRange();
      const next: ToggleState = {};
      for (const command of TOGGLES) {
        try {
          next[command] = document.queryCommandState(command);
        } catch {
          next[command] = false;
        }
      }
      setActive(next);
    }
    document.addEventListener("selectionchange", onSelectionChange);
    return () => document.removeEventListener("selectionchange", onSelectionChange);
  }, []);

  function emit() {
    const el = editorRef.current;
    if (!el) return;
    setWordCount(countWords(el.innerText));
    onChange(el.innerHTML);
  }

  // Selects and pickers take focus away from the text; put the cursor back
  // where it was before running a command.
  function focusEditor() {
    const el = editorRef.current;
    if (!el) return null;
    const hadFocus = document.activeElement === el;
    const saved = savedRangeRef.current;
    el.focus();
    const selection = window.getSelection();
    if (selection && saved && (!hadFocus || selection.rangeCount === 0 || !el.contains(selection.anchorNode))) {
      selection.removeAllRanges();
      selection.addRange(saved);
    }
    return el;
  }

  function run(command: string, commandValue?: string, withCss = false, afterCommand?: () => void) {
    if (!focusEditor()) return;
    try {
      document.execCommand("styleWithCSS", false, String(withCss));
    } catch {
      // Older browsers don't support this toggle — the command still runs.
    }
    document.execCommand(command, false, commandValue);
    afterCommand?.();
    tidy();
    emit();
  }

  function selectedRange(): Range | null {
    const el = focusEditor();
    const selection = window.getSelection();
    if (!el || !selection || selection.rangeCount === 0) return null;
    const range = selection.getRangeAt(0);
    return el.contains(range.commonAncestorContainer) ? range : null;
  }

  // Takes one style (font, size, colour or highlight) off everything the
  // selection touches — or, with nothing selected, off the text around the
  // cursor — so it goes back to the page's normal look.
  function removeStyle(prop: StyleProp) {
    const el = editorRef.current;
    const range = selectedRange();
    if (!el || !range) return;

    const targets: HTMLElement[] = [];
    let node: Node | null = range.commonAncestorContainer;
    while (node && node !== el) {
      if (node instanceof HTMLElement) targets.push(node);
      node = node.parentNode;
    }
    el.querySelectorAll<HTMLElement>("[style], font").forEach((child) => {
      if (range.intersectsNode(child)) targets.push(child);
    });

    for (const target of targets) {
      target.style[prop] = "";
      if (target.tagName === "FONT") {
        if (prop === "fontFamily") target.removeAttribute("face");
        if (prop === "fontSize") target.removeAttribute("size");
        if (prop === "color") target.removeAttribute("color");
      }
    }
    tidy();
    emit();
  }

  function applyStyle(prop: StyleProp, styleValue: string) {
    if (!styleValue) return removeStyle(prop);

    if (prop === "fontSize") {
      // The browser's size command only knows sizes 1–7; mark the text with
      // size 7, then swap those marks for the real pixel size.
      run("fontSize", "7", false, () => {
        editorRef.current?.querySelectorAll<HTMLElement>('font[size="7"]').forEach((font) => {
          font.removeAttribute("size");
          font.style.fontSize = styleValue;
        });
      });
      return;
    }

    const command = { fontFamily: "fontName", color: "foreColor", backgroundColor: "hiliteColor" }[prop];
    run(command, styleValue, true);
  }

  // Turns <font> tags into plain spans and drops spans that no longer carry
  // any style, so the saved HTML stays small and predictable.
  function tidy() {
    const el = editorRef.current;
    if (!el) return;

    el.querySelectorAll("font").forEach((font) => {
      const span = document.createElement("span");
      const face = font.getAttribute("face");
      const color = font.getAttribute("color");
      span.style.cssText = font.style.cssText;
      if (face) span.style.fontFamily = face;
      if (color) span.style.color = color;
      while (font.firstChild) span.appendChild(font.firstChild);
      font.replaceWith(span);
    });

    el.querySelectorAll<HTMLElement>("[style]").forEach((node) => {
      if (!node.getAttribute("style")?.trim()) node.removeAttribute("style");
    });

    el.querySelectorAll("span").forEach((span) => {
      if (span.attributes.length === 0) span.replaceWith(...Array.from(span.childNodes));
    });
  }

  function applyLink() {
    const range = selectedRange();
    if (!range || range.collapsed) {
      alert("Select some text first, then add a link.");
      return;
    }
    const href = window.prompt("Link to (e.g. https://example.com):", "https://");
    if (!href || !href.trim() || href.trim() === "https://") return;
    run("createLink", href.trim());
  }

  function handlePaste(event: React.ClipboardEvent<HTMLDivElement>) {
    event.preventDefault();
    const html = event.clipboardData.getData("text/html");
    const text = event.clipboardData.getData("text/plain");
    if (html) {
      document.execCommand("insertHTML", false, cleanPastedHtml(html));
    } else if (text) {
      document.execCommand("insertText", false, text);
    }
    tidy();
    emit();
  }

  function handleKeyDown(event: React.KeyboardEvent<HTMLDivElement>) {
    // Tab inside a bullet list moves the item in / out, like Word.
    if (event.key === "Tab" && (active.insertUnorderedList || active.insertOrderedList)) {
      event.preventDefault();
      run(event.shiftKey ? "outdent" : "indent");
    }
  }

  function button(
    label: React.ReactNode,
    title: string,
    onClick: () => void,
    pressed?: boolean
  ) {
    return (
      <button
        type="button"
        className={`richTextFormatButton${pressed ? " isActive" : ""}`}
        title={title}
        aria-label={title}
        aria-pressed={pressed}
        // Keep the text selected while clicking the toolbar.
        onMouseDown={(event) => event.preventDefault()}
        onClick={onClick}
      >
        {label}
      </button>
    );
  }

  // Toolbar menus are plain buttons (not <select>s), so clicking them never
  // takes the cursor out of the text.
  function menu(id: MenuId, title: string, label: React.ReactNode, panel: React.ReactNode) {
    const open = openMenu === id;
    return (
      <div className="richTextMenu">
        <button
          type="button"
          className={`richTextFormatButton richTextMenuButton${open ? " isActive" : ""}`}
          title={title}
          aria-label={title}
          aria-expanded={open}
          onMouseDown={(event) => event.preventDefault()}
          onClick={() => setOpenMenu(open ? null : id)}
        >
          {label} <span aria-hidden="true">▾</span>
        </button>
        {open && (
          <div className="richTextMenuPanel" role="menu" onMouseDown={(event) => event.preventDefault()}>
            {panel}
          </div>
        )}
      </div>
    );
  }

  function choose(prop: StyleProp, styleValue: string) {
    setOpenMenu(null);
    applyStyle(prop, styleValue);
  }

  function listPanel(prop: StyleProp, resetLabel: string, options: { label: string; value: string }[]) {
    return (
      <>
        <button type="button" className="richTextMenuItem" onClick={() => choose(prop, "")}>
          {resetLabel}
        </button>
        {options.map((option) => (
          <button
            key={option.value}
            type="button"
            className="richTextMenuItem"
            style={prop === "fontFamily" ? { fontFamily: option.value } : { fontSize: option.value }}
            onClick={() => choose(prop, option.value)}
          >
            {option.label}
          </button>
        ))}
      </>
    );
  }

  function swatchPanel(prop: StyleProp, resetLabel: string, colors: { label: string; value: string }[]) {
    return (
      <>
        <div className="richTextSwatches">
          {colors.map((color) => (
            <button
              key={color.value}
              type="button"
              className="richTextSwatch"
              title={color.label}
              aria-label={color.label}
              style={{ background: color.value }}
              onClick={() => choose(prop, color.value)}
            />
          ))}
        </div>
        <button type="button" className="richTextMenuItem richTextMenuReset" onClick={() => choose(prop, "")}>
          <span className="richTextSwatch richTextSwatchNone" aria-hidden="true" /> {resetLabel}
        </button>
      </>
    );
  }

  return (
    <div className="richTextEditor">
      <div className="richTextToolbar" role="toolbar" aria-label="Text formatting" ref={toolbarRef}>
        <div className="richTextGroup">
          {button("↶", "Undo (Ctrl+Z)", () => run("undo"))}
          {button("↷", "Redo (Ctrl+Y)", () => run("redo"))}
        </div>
        <div className="richTextGroup">
          {menu("font", "Font", "Font", listPanel("fontFamily", "Default font", FONT_FAMILIES.map((f) => ({ label: f, value: f }))))}
          {menu("size", "Size", "Size", listPanel("fontSize", "Normal size", FONT_SIZES))}
        </div>
        <div className="richTextGroup">
          {button(<strong>B</strong>, "Bold (Ctrl+B)", () => run("bold"), active.bold)}
          {button(<em>I</em>, "Italic (Ctrl+I)", () => run("italic"), active.italic)}
          {button(<span style={{ textDecoration: "underline" }}>U</span>, "Underline (Ctrl+U)", () => run("underline"), active.underline)}
          {menu(
            "color",
            "Text colour",
            <span className="richTextColorIcon">A<span style={{ background: "linear-gradient(90deg, #e53935, #f08a24, #1f9d68, #2f8fef, #6c63ff)" }} /></span>,
            swatchPanel("color", "Automatic", TEXT_COLORS)
          )}
          {menu(
            "highlight",
            "Highlight",
            <span className="richTextHighlightIcon">ab</span>,
            swatchPanel("backgroundColor", "No highlight", HIGHLIGHTS)
          )}
          {button("⌫ Clear", "Clear formatting", () => run("removeFormat"))}
        </div>
        <div className="richTextGroup">
          {button("• List", "Bullet list", () => run("insertUnorderedList"), active.insertUnorderedList)}
          {button("1. List", "Numbered list", () => run("insertOrderedList"), active.insertOrderedList)}
          {button("⇤", "Align left", () => run("justifyLeft", undefined, true), active.justifyLeft)}
          {button("⇔", "Center", () => run("justifyCenter", undefined, true), active.justifyCenter)}
          {button("⇥", "Align right", () => run("justifyRight", undefined, true), active.justifyRight)}
        </div>
        <div className="richTextGroup">
          {button("🔗 Link", "Add link", applyLink)}
          {button("Unlink", "Remove link", () => run("unlink"))}
        </div>
      </div>
      <div
        ref={editorRef}
        className="richTextArea"
        contentEditable
        suppressContentEditableWarning
        onInput={emit}
        onPaste={handlePaste}
        onKeyDown={handleKeyDown}
      />
      <p className={`richTextWordCount ${wordCount > maxWords ? "richTextWordCountOver" : ""}`}>
        {wordCount} / {maxWords} words
      </p>
    </div>
  );
}
