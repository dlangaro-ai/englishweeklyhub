"use client";

import { goToNextCard, scrollToCard } from "@/lib/cardNav";

// A Study Tips card: click anywhere on it (or its "Next" button) to scroll
// down to the next one.
export default function TipCard({
  as: Tag = "li",
  id,
  nextId,
  nextLabel = "Next tip",
  className,
  children
}: {
  as?: "li" | "section";
  id: string;
  nextId: string;
  nextLabel?: string;
  className: string;
  children: React.ReactNode;
}) {
  return (
    <Tag
      id={id}
      className={`${className} tipClickable`}
      onClick={(event: React.MouseEvent<HTMLElement>) => goToNextCard(event, nextId)}
    >
      {children}
      <button type="button" className="tipNext" onClick={() => scrollToCard(nextId)}>
        {nextLabel} <span aria-hidden="true">↓</span>
      </button>
    </Tag>
  );
}
