"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { usePrefersReducedMotion } from "@/components/mat/usePrefersReducedMotion";
import { Tape } from "@/components/paper/Tape";
import type { Project } from "@/content/projects";
import { carouselEdges } from "@/lib/carousel";
import { ProjectCard } from "./ProjectCard";

// A sheet of graph paper holding a sideways-scrolling row of project cards. Swipe or trackpad
// scrolls it directly; the arrows step one card. Vertical scroll still drives the page.
export function ProjectCarousel({ projects }: { projects: Project[] }) {
  const ref = useRef<HTMLDivElement>(null);
  const still = usePrefersReducedMotion();
  const [edges, setEdges] = useState({ atStart: true, atEnd: false });

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

  const scrollable = !(edges.atStart && edges.atEnd);
  const arrow =
    "flex h-9 w-9 items-center justify-center rounded-full bg-paper font-mono text-base text-ink shadow-md transition-opacity hover:bg-white disabled:opacity-60 disabled:text-ink/30 md:h-10 md:w-10";

  return (
    <div className="paper-grid drop-object relative w-[92vw] rounded-[22px] pb-6 pt-4 md:rounded-[28px] md:pb-8 md:pt-6">
      <Tape className="-top-2 left-10 -rotate-6" />
      <Tape className="-top-2 right-10 rotate-6" />
      <div
        ref={ref}
        onScroll={update}
        role="region"
        aria-label="Side projects"
        tabIndex={0}
        className="no-scrollbar flex snap-x snap-mandatory scroll-px-4 gap-4 overflow-x-auto overscroll-x-contain px-4 pb-2 pt-1 outline-none focus-visible:ring-2 focus-visible:ring-ink/40 md:scroll-px-8 md:gap-6 md:px-8"
      >
        {projects.map((project) => (
          <ProjectCard key={project.name} project={project} />
        ))}
      </div>
      {scrollable && (
        // Hangs off the sheet's bottom edge so it costs no height.
        <div className="absolute -bottom-4 right-5 flex gap-2 md:-bottom-5 md:right-8">
          <button type="button" aria-label="Previous project" onClick={() => step(-1)} disabled={edges.atStart} className={arrow}>
            ←
          </button>
          <button type="button" aria-label="Next project" onClick={() => step(1)} disabled={edges.atEnd} className={arrow}>
            →
          </button>
        </div>
      )}
    </div>
  );
}
