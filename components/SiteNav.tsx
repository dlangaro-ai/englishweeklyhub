"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { SITE_PAGES } from "@/lib/sitePages";

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

  useEffect(() => {
    if (!open) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  return (
    <header className="siteNav">
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

        <button
          type="button"
          className={`siteNavToggle${open ? " isOpen" : ""}`}
          aria-expanded={open}
          aria-controls="site-nav-links"
          aria-label={open ? "Close menu" : "Open menu"}
          onClick={() => setOpen((value) => !value)}
        >
          <span />
          <span />
        </button>
      </div>
    </header>
  );
}
