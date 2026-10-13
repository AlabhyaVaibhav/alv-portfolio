"use client";

import { useEffect, useState, useSyncExternalStore } from "react";
import { useReducedMotion } from "framer-motion";
import { chapters } from "@/content/chapters";
import { activeChapterIndex, holdScrollY } from "@/lib/chapterScroll";

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
  const reduce = useReducedMotion() ?? false;

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
    <nav aria-label="Chapters" className="fixed right-3 top-3 z-40 flex flex-col items-end md:right-5 md:top-5">
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
                className={`block w-full px-4 py-1.5 text-left hover:bg-ink/5 ${i === active ? "font-bold" : ""}`}
              >
                {pad(c.number)} · {c.title}
              </button>
            </li>
          ))}
        </ol>
      )}
    </nav>
  );
}
