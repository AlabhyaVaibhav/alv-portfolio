"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { usePrefersReducedMotion } from "@/components/mat/usePrefersReducedMotion";
import { crossoutPath } from "@/lib/pen";
import { StickyNote } from "./StickyNote";

type TodoStickyProps = {
  title: string;
  items: string[];
  className?: string;
};

const CHECK = "M2 9 L6.5 13 L14 3";

// A to-do list on a sticky note. Ticking an item draws a check and a pen stroke through it.
export function TodoSticky({ title, items, className = "" }: TodoStickyProps) {
  const [done, setDone] = useState<Set<number>>(() => new Set());
  const still = usePrefersReducedMotion();
  const draw = (delay = 0) => ({
    initial: { pathLength: still ? 1 : 0 },
    animate: { pathLength: 1 },
    transition: { duration: still ? 0 : 0.35, ease: "easeOut" as const, delay: still ? 0 : delay },
  });

  const toggle = (i: number) =>
    setDone((prev) => {
      const next = new Set(prev);
      if (next.has(i)) next.delete(i);
      else next.add(i);
      return next;
    });

  return (
    <StickyNote bodyClassName="w-[52vw] px-4 pb-4 pt-3 md:w-[210px]" className={className}>
      <p className="text-[26px] leading-none">{title}</p>
      <ul className="mt-2 space-y-1">
        {items.map((item, i) => {
          const checked = done.has(i);
          return (
            <li key={item}>
              <button
                type="button"
                role="checkbox"
                aria-checked={checked}
                onClick={() => toggle(i)}
                className="flex w-full cursor-pointer items-center gap-2 text-left text-[22px] leading-tight"
              >
                <span aria-hidden className="relative h-4 w-4 shrink-0 rounded-[3px] border-[1.5px] border-ink/70">
                  {checked && (
                    <svg viewBox="0 0 16 16" className="absolute -left-0.5 -top-1.5 h-5 w-5 overflow-visible">
                      <motion.path d={CHECK} fill="none" stroke="#2b2620" strokeWidth={2.2} strokeLinecap="round" strokeLinejoin="round" {...draw()} />
                    </svg>
                  )}
                </span>
                <span className={`relative transition-opacity ${checked ? "opacity-60" : ""}`}>
                  {item}
                  {checked && (
                    <svg aria-hidden viewBox="0 0 100 20" preserveAspectRatio="none" className="absolute -inset-x-1 top-0 h-full w-[calc(100%+0.5rem)] overflow-visible">
                      <motion.path
                        d={crossoutPath(100, 20, item)}
                        fill="none"
                        stroke="#2b2620"
                        strokeWidth={2}
                        strokeLinecap="round"
                        vectorEffect="non-scaling-stroke"
                        {...draw(0.15)}
                      />
                    </svg>
                  )}
                </span>
              </button>
            </li>
          );
        })}
      </ul>
    </StickyNote>
  );
}
