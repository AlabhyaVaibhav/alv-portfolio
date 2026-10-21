"use client";

import { useCallback, useEffect, useRef, useState, useSyncExternalStore } from "react";
import { usePrefersReducedMotion } from "@/components/mat/usePrefersReducedMotion";
import { ChalkOutline } from "@/components/paper/ChalkOutline";
import { Tape } from "@/components/paper/Tape";
import type { Project } from "@/content/projects";
import { carouselEdges } from "@/lib/carousel";
import { ProjectCard } from "./ProjectCard";

const HINT_KEY = "unclip-hint-seen";

const noSubscribe = () => () => {};

function hintUnseen() {
  try {
    return !localStorage.getItem(HINT_KEY);
  } catch {
    return true;
  }
}

// A sheet of graph paper holding a sideways-scrolling row of project cards. Swipe or trackpad
// scrolls it directly; the arrows step one card. Vertical scroll still drives the page.
export function ProjectCarousel({ projects }: { projects: Project[] }) {
  const ref = useRef<HTMLDivElement>(null);
  const still = usePrefersReducedMotion();
  const [edges, setEdges] = useState({ atStart: true, atEnd: false });
  // The "unclip for a summary" hint shows on the first card until any clip has been opened, once per
  // browser. The server render leaves it off so a returning visitor never sees it flash.
  const unseen = useSyncExternalStore(noSubscribe, hintUnseen, () => false);
  const [dismissed, setDismissed] = useState(false);
  const hint = unseen && !dismissed;

  const unclipped = () => {
    setDismissed(true);
    try {
      localStorage.setItem(HINT_KEY, "1");
    } catch {}
  };

  const update = useCallback(() => {
    if (ref.current) setEdges(carouselEdges(ref.current));
  }, []);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    update();
    const observer = new ResizeObserver(update);
    observer.observe(el);
    return () => observer.disconnect();
  }, [update]);

  const step = (direction: 1 | -1) => {
    const el = ref.current;
    const card = el?.querySelector<HTMLElement>("[data-card]");
    if (!el || !card) return;
    const gap = parseFloat(getComputedStyle(el).columnGap) || 0;
    // An exact, in-range target: a smooth scrollBy past the end can snap back to the start in Chrome.
    const max = el.scrollWidth - el.clientWidth;
    const left = Math.min(Math.max(el.scrollLeft + direction * (card.offsetWidth + gap), 0), max);
    el.scrollTo({ left, behavior: still ? "auto" : "smooth" });
  };

  const firstClipped = projects.findIndex((p) => p.caseStudy);
  const scrollable = !(edges.atStart && edges.atEnd);
  // Always opaque: a see-through disabled button let the sheet edge and grid show through it.
  const arrow =
    "flex h-10 w-10 items-center justify-center rounded-full bg-paper font-mono text-base text-ink shadow-md transition-colors hover:bg-white disabled:cursor-default disabled:bg-[#e9e6dc] disabled:text-ink/30 disabled:shadow-sm md:h-11 md:w-11";

  return (
    <div className="paper-grid drop-object relative w-[92vw] rounded-[22px] pb-6 pt-2 md:rounded-[28px] md:pb-8 md:pt-3">
      <Tape className="-top-2 left-10 -rotate-6" />
      <Tape className="-top-2 right-10 rotate-6" />
      <div
        ref={ref}
        onScroll={update}
        role="region"
        aria-label="Side projects"
        tabIndex={0}
        className="no-scrollbar flex snap-x snap-mandatory scroll-px-4 gap-4 overflow-x-auto overscroll-x-contain px-4 pb-2 pt-8 md:pt-10 outline-none focus-visible:ring-2 focus-visible:ring-ink/40 md:scroll-px-8 md:gap-6 md:px-8"
      >
        {projects.map((project, i) => (
          <ProjectCard key={project.name} project={project} hint={hint && i === firstClipped} onUnclip={unclipped} />
        ))}
      </div>
      {scrollable && (
        // Sits on the mat just below the sheet, clear of its edge, so it costs the sheet no height. The
        // chalk note and loop tell visitors the sheet holds more than fits: it scrolls sideways.
        <div className="absolute right-5 top-[calc(100%+14px)] flex items-center gap-5 md:right-8 md:top-[calc(100%+18px)] md:gap-7">
          <p className="max-w-[46vw] text-right font-hand text-[17px] leading-tight text-sticky-yellow md:max-w-none md:text-[24px]">
            more projects this way. use the arrows or swipe →
          </p>
          <div className="relative flex shrink-0 gap-2.5">
            <ChalkOutline color="#f08a4b" className="!-inset-3 !h-[calc(100%+1.5rem)] !w-[calc(100%+1.5rem)]" />
            <button type="button" aria-label="Previous project" onClick={() => step(-1)} disabled={edges.atStart} className={arrow}>
              ←
            </button>
            <button type="button" aria-label="Next project" onClick={() => step(1)} disabled={edges.atEnd} className={arrow}>
              →
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
