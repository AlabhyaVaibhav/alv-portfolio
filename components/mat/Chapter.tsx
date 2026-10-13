"use client";

import { useRef, useState, type ReactNode } from "react";
import { useMotionValueEvent, useScroll } from "framer-motion";
import { chapters, type ChapterMeta } from "@/content/chapters";
import { SECTION_CLASS, STAGE_CLASS, stageInteractive } from "@/lib/chapterLayout";
import { ChapterContext, type ChapterContextValue } from "./chapterContext";
import { ChapterLabel } from "./ChapterLabel";
import { Piece } from "./Piece";
import { usePrefersReducedMotion } from "./usePrefersReducedMotion";

type ChapterProps = {
  meta: ChapterMeta;
  children: ReactNode;
};

// A 160vh scroll spacer whose stage is fixed over the mat. Progress runs 0→1 from the moment the
// section's top enters the viewport bottom until its bottom reaches the viewport bottom, so
// consecutive chapters hand over with no empty scroll in between.
export function Chapter({ meta, children }: ChapterProps) {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end end"] });
  const still = usePrefersReducedMotion();
  const isFirst = meta.number === chapters[0].number;
  const isLast = meta.number === chapters[chapters.length - 1].number;

  const [onMat, setOnMat] = useState(() => stageInteractive(scrollYProgress.get(), isFirst, isLast));
  useMotionValueEvent(scrollYProgress, "change", (p) => setOnMat(stageInteractive(p, isFirst, isLast)));

  const value: ChapterContextValue = { progress: scrollYProgress, isFirst, isLast, still };

  return (
    <ChapterContext.Provider value={value}>
      <section ref={ref} id={meta.id} data-chapter={meta.number} aria-label={meta.title} className={SECTION_CLASS}>
        <div className={STAGE_CLASS} inert={!still && !onMat}>
          <Piece x={3} y={4} rotate={-2} from="left" enterAt={0} mobile={{ x: 4, y: 3 }}>
            <ChapterLabel meta={meta} />
          </Piece>
          {children}
        </div>
      </section>
    </ChapterContext.Provider>
  );
}
