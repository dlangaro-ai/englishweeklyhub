"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { SITE_PAGES } from "@/lib/sitePages";
import SiteSearch from "./SiteSearch";

function isActive(pathname: string, href: string) {
  // A single week's page belongs to "All Weeks".
  if (href === "/weeks") return pathname === "/weeks" || pathname.startsWith("/week/");
  return pathname === href || pathname.startsWith(`${href}/`);
}

// The site-wide bar that stays at the top while scrolling (like apple.com's):
// the TEDANK5 name on the left of the page links, a menu button on small screens.
export default function SiteNav() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const headerRef = useRef<HTMLElement>(null);

  // Escape closes whichever panel is open; a click outside the bar closes it too.
  useEffect(() => {
    if (!open && !searchOpen) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setOpen(false);
        setSearchOpen(false);
      }
    };
    const onPointerDown = (event: PointerEvent) => {
      if (headerRef.current && !headerRef.current.contains(event.target as Node)) {
        setOpen(false);
        setSearchOpen(false);
      }
    };
    window.addEventListener("keydown", onKey);
    window.addEventListener("pointerdown", onPointerDown);
    return () => {
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("pointerdown", onPointerDown);
    };
  }, [open, searchOpen]);

  return (
    <header className="siteNav" ref={headerRef}>
      <div className="siteNavInner">
        <Link href="/" className="siteNavBrand" aria-label="TEDANK5 — home" onClick={() => setOpen(false)}>
          TEDANK<span>5</span>
        </Link>

        <nav id="site-nav-links" className={`siteNavLinks${open ? " isOpen" : ""}`} aria-label="Main">
          {SITE_PAGES.map((page) => {
            const active = isActive(pathname, page.href);
            return (
              <Link
                key={page.href}
                href={page.href}
                className={`siteNavLink${active ? " isActive" : ""}`}
                aria-current={active ? "page" : undefined}
                onClick={() => setOpen(false)}
              >
                {page.label}
              </Link>
            );
          })}
        </nav>

        <div className="siteNavActions">
          <button
            type="button"
            className={`siteNavSearch${searchOpen ? " isOpen" : ""}`}
            aria-label={searchOpen ? "Close search" : "Search"}
            aria-expanded={searchOpen}
            aria-controls="site-search"
            onClick={() => {
              setSearchOpen((value) => !value);
              setOpen(false);
            }}
          >
            <svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round">
              <circle cx="10.5" cy="10.5" r="6.5" />
              <path d="M15.5 15.5L21 21" />
            </svg>
          </button>

          <button
            type="button"
            className={`siteNavToggle${open ? " isOpen" : ""}`}
            aria-expanded={open}
            aria-controls="site-nav-links"
            aria-label={open ? "Close menu" : "Open menu"}
            onClick={() => {
              setOpen((value) => !value);
              setSearchOpen(false);
            }}
          >
            <span />
            <span />
          </button>
        </div>
      </div>
      {searchOpen && <SiteSearch onClose={() => setSearchOpen(false)} />}
    </header>
  );
}
