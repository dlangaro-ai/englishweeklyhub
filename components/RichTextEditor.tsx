"use client";

import { useEffect, useRef, useState } from "react";

const FONT_FAMILIES = ["Arial", "Comic Sans MS", "Georgia", "Verdana", "Times New Roman"];
const FONT_SIZES: { label: string; value: string }[] = [
  { label: "Small", value: "14px" },
  { label: "Medium", value: "18px" },
  { label: "Large", value: "24px" }
];
const HIGHLIGHT_COLOR = "#fff176";

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

  useEffect(() => {
    const el = editorRef.current;
    if (!el) return;
    el.innerHTML = value || "";
    setWordCount(countWords(el.innerText));
    // Runs once on mount only — this editor is uncontrolled after that,
    // so React never fights the browser over cursor position.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function countWords(text: string) {
    const trimmed = text.trim();
    return trimmed ? trimmed.split(/\s+/).length : 0;
  }

  function handleInput() {
    const el = editorRef.current;
    if (!el) return;
    setWordCount(countWords(el.innerText));
    onChange(el.innerHTML);
  }

  function saveSelection() {
    const selection = window.getSelection();
    if (selection && selection.rangeCount > 0 && editorRef.current?.contains(selection.anchorNode)) {
      savedRangeRef.current = selection.getRangeAt(0).cloneRange();
    }
  }

  function restoreSelection() {
    const selection = window.getSelection();
    if (selection && savedRangeRef.current) {
      selection.removeAllRanges();
      selection.addRange(savedRangeRef.current);
    }
  }

  // Bold / italic / underline / bullets run through the browser's built-in
  // editing commands. styleWithCSS=false keeps them emitting plain tags
  // (<b>, <i>, <u>, <ul><li>) rather than inline styles — that's what
  // sanitizeRichText allows through when the content is displayed.
  function applyCommand(command: "bold" | "italic" | "underline" | "insertUnorderedList") {
    const el = editorRef.current;
    if (!el) return;
    el.focus();
    restoreSelection();
    try {
      document.execCommand("styleWithCSS", false, "false");
    } catch {
      // Older browsers don't support this toggle — the command below still runs.
    }
    document.execCommand(command);
    handleInput();
    saveSelection();
  }

  function applyStyle(styleProp: "fontFamily" | "fontSize" | "backgroundColor" | "color", styleValue: string) {
    restoreSelection();
    const selection = window.getSelection();

    if (!selection || selection.rangeCount === 0 || selection.isCollapsed) {
      alert("Select some text first, then choose a style.");
      return;
    }

    const range = selection.getRangeAt(0);
    if (!editorRef.current || !editorRef.current.contains(range.commonAncestorContainer)) return;

    const span = document.createElement("span");
    span.style[styleProp] = styleValue;

    try {
      range.surroundContents(span);
    } catch {
      const contents = range.extractContents();
      span.appendChild(contents);
      range.insertNode(span);
    }

    selection.removeAllRanges();
    onChange(editorRef.current.innerHTML);
  }

  return (
    <div className="richTextEditor">
      <div className="richTextToolbar">
        <button
          type="button"
          className="richTextFormatButton"
          title="Bold"
          aria-label="Bold"
          onMouseDown={saveSelection}
          onClick={() => applyCommand("bold")}
        >
          <strong>B</strong>
        </button>
        <button
          type="button"
          className="richTextFormatButton"
          title="Italic"
          aria-label="Italic"
          onMouseDown={saveSelection}
          onClick={() => applyCommand("italic")}
        >
          <em>I</em>
        </button>
        <button
          type="button"
          className="richTextFormatButton"
          title="Underline"
          aria-label="Underline"
          onMouseDown={saveSelection}
          onClick={() => applyCommand("underline")}
        >
          <span style={{ textDecoration: "underline" }}>U</span>
        </button>
        <button
          type="button"
          className="richTextFormatButton"
          title="Bullet list"
          aria-label="Bullet list"
          onMouseDown={saveSelection}
          onClick={() => applyCommand("insertUnorderedList")}
        >
          • List
        </button>
        <span className="richTextToolbarDivider" aria-hidden="true" />
        <select onMouseDown={saveSelection} onChange={(event) => applyStyle("fontFamily", event.target.value)} defaultValue="">
          <option value="" disabled>Font</option>
          {FONT_FAMILIES.map((font) => (
            <option key={font} value={font} style={{ fontFamily: font }}>
              {font}
            </option>
          ))}
        </select>
        <select onMouseDown={saveSelection} onChange={(event) => applyStyle("fontSize", event.target.value)} defaultValue="">
          <option value="" disabled>Size</option>
          {FONT_SIZES.map((size) => (
            <option key={size.value} value={size.value}>
              {size.label}
            </option>
          ))}
        </select>
        <button
          type="button"
          onMouseDown={saveSelection}
          onClick={() => applyStyle("backgroundColor", HIGHLIGHT_COLOR)}
        >
          🖍 Highlight
        </button>
        <label className="richTextColorLabel">
          Font color
          <input
            type="color"
            defaultValue="#000000"
            onMouseDown={saveSelection}
            onChange={(event) => applyStyle("color", event.target.value)}
          />
        </label>
      </div>
      <div
        ref={editorRef}
        className="richTextArea"
        contentEditable
        suppressContentEditableWarning
        onInput={handleInput}
        onMouseUp={saveSelection}
        onKeyUp={saveSelection}
      />
      <p className={`richTextWordCount ${wordCount > maxWords ? "richTextWordCountOver" : ""}`}>
        {wordCount} / {maxWords} words
      </p>
    </div>
  );
}
