"use client";

import { useState } from "react";
import RichTextEditor from "@/components/RichTextEditor";
import { sanitizeRichText } from "@/lib/sanitizeHtml";

export default function EditorTest() {
  const [html, setHtml] = useState("");
  return (
    <main className="shell narrow">
      <RichTextEditor value={"<p>Hello <b>world</b> this is a test.</p>"} onChange={setHtml} />
      <div id="saved" className="richTextDisplay" dangerouslySetInnerHTML={{ __html: sanitizeRichText(html) }} />
    </main>
  );
}
