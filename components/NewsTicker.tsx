"use client";

import { useState } from "react";

// The moving headline strip in the Big News card. Anything that moves on its
// own needs a way to stop it, so there's a big Pause / Play button.
export default function NewsTicker({ children }: { children: React.ReactNode }) {
  const [paused, setPaused] = useState(false);

  return (
    <div className={`newsTicker${paused ? " isPaused" : ""}`}>
      <button
        type="button"
        className="newsTickerToggle"
        onClick={() => setPaused(!paused)}
        aria-pressed={paused}
        aria-label={paused ? "Play the moving news" : "Pause the moving news"}
      >
        <span aria-hidden="true">{paused ? "▶" : "⏸"}</span> {paused ? "Play" : "Pause"}
      </button>
      <div className="newsTickerWindow">{children}</div>
    </div>
  );
}
