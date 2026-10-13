"use client";

import { useRef, type ReactNode } from "react";
import { useReducedMotion, useScroll } from "framer-motion";
import { chapters, type ChapterMeta } from "@/content/chapters";
import { ChapterContext, type ChapterContextValue } from "./chapterContext";
import { ChapterLabel } from "./ChapterLabel";
import { Piece } from "./Piece";

type ChapterProps = {
  meta: ChapterMeta;
  children: ReactNode;
};

// A 250vh scroll spacer whose stage is fixed over the mat. Progress runs 0→1 from the moment the
// section's top enters the viewport bottom until its bottom reaches the viewport bottom, so
// consecutive chapters hand over with no empty scroll in between.
export function Chapter({ meta, children }: ChapterProps) {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end end"] });
  const still = useReducedMotion() ?? false;
  const value: ChapterContextValue = {
    progress: scrollYProgress,
    isFirst: meta.number === chapters[0].number,
    isLast: meta.number === chapters[chapters.length - 1].number,
    still,
  };

  return (
    <ChapterContext.Provider value={value}>
      <section
        ref={ref}
        id={meta.id}
        data-chapter={meta.number}
        aria-label={meta.title}
        className={still ? "relative min-h-[110vh] md:min-h-screen" : "relative h-[250vh]"}
      >
        <div className={still ? "relative min-h-[110vh] md:min-h-screen" : "pointer-events-none fixed inset-0"}>
          <Piece x={3} y={4} rotate={-2} from="left" enterAt={0} mobile={{ x: 4, y: 3 }}>
            <ChapterLabel meta={meta} />
          </Piece>
          {children}
        </div>
      </section>
    </ChapterContext.Provider>
  );
}
