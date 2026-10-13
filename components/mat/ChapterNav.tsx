"use client";

import { useEffect, useState, useSyncExternalStore } from "react";
import { chapters } from "@/content/chapters";
import { site } from "@/content/site";
import { activeChapterIndex, holdScrollY } from "@/lib/chapterScroll";
import { Squiggle } from "@/components/paper/Squiggle";
import { usePrefersReducedMotion } from "./usePrefersReducedMotion";

function subscribe(onChange: () => void) {
  window.addEventListener("scroll", onChange, { passive: true });
  window.addEventListener("resize", onChange);
  return () => {
    window.removeEventListener("scroll", onChange);
    window.removeEventListener("resize", onChange);
  };
}

function readActive(): number {
  const rects = chapters.map((c) => {
    const el = document.getElementById(c.id);
    return el ? { top: el.offsetTop, height: el.offsetHeight } : { top: Infinity, height: 1 };
  });
  return activeChapterIndex(rects, window.scrollY, window.innerHeight);
}

const pad = (n: number) => String(n).padStart(2, "0");

export function ChapterNav() {
  const active = useSyncExternalStore(subscribe, readActive, () => 0);
  const [open, setOpen] = useState(false);
  const reduce = usePrefersReducedMotion();

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  const jump = (index: number) => {
    const el = document.getElementById(chapters[index].id);
    if (!el) return;
    const top =
      index === 0 ? 0 : reduce ? el.offsetTop : holdScrollY(el.offsetTop, el.offsetHeight, window.innerHeight);
    window.scrollTo({ top, behavior: reduce ? "auto" : "smooth" });
    setOpen(false);
  };

  return (
    // The resume sits beside the chapter menu in every chapter, so a recruiter is always one click away.
    <div className="fixed right-3 top-3 z-40 flex items-start gap-2 md:right-5 md:top-5">
      <a
        href={site.resumeHref}
        download
        className="drop-object bg-sticky-yellow px-3 py-1.5 font-mono text-[11px] font-bold uppercase tracking-[0.14em] text-ink transition-transform hover:-translate-y-0.5 focus-visible:-translate-y-0.5"
      >
        Resume ↓
      </a>
      <nav aria-label="Chapters" className="flex flex-col items-end">
        <button
          type="button"
          aria-expanded={open}
          aria-controls="chapter-index"
          onClick={() => setOpen((o) => !o)}
          className="drop-object bg-paper px-3 py-1.5 font-mono text-[11px] uppercase tracking-[0.14em] text-ink"
        >
          Ch. {pad(chapters[active].number)} {open ? "▴" : "▾"}
        </button>
        {open && (
          <ol id="chapter-index" className="drop-object mt-2 w-[min(80vw,300px)] bg-paper py-2 font-mono text-[11px] uppercase tracking-[0.1em] text-ink">
            {chapters.map((c, i) => (
              <li key={c.id}>
                <button
                  type="button"
                  onClick={() => jump(i)}
                  aria-current={i === active ? "step" : undefined}
                  className="group block w-full px-4 py-1.5 text-left outline-none"
                >
                  <span className="relative">
                    {pad(c.number)} · {c.title}
                    <Squiggle drawn={i === active} className="-bottom-1.5" />
                  </span>
                </button>
              </li>
            ))}
          </ol>
        )}
      </nav>
    </div>
  );
}
