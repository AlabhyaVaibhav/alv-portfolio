"use client";

import { useId, type CSSProperties } from "react";

// One loose loop around a box, overshooting where it closes, as if circled by hand.
const LOOP = "M10 5 C 35 0, 72 -1, 95 5 C 101 30, 101 70, 96 95 C 70 101, 30 101, 5 96 C -1 70, -1 32, 4 9 C 6 3, 18 1, 34 2";

type ChalkOutlineProps = {
  // Seconds before the loop starts drawing itself.
  delay?: number;
  className?: string;
};

// A chalky marker loop around its parent (which needs `relative`). Drawn with a pen-draw animation and
// a rough edge so it reads as hand-drawn on the mat, not a CSS border.
export function ChalkOutline({ delay = 0, className = "" }: ChalkOutlineProps) {
  // A per-instance filter id: a shared one can resolve to a copy inside a hidden element, which
  // Chrome won't render, taking the outline with it.
  const filterId = `chalk-${useId().replace(/[^a-zA-Z0-9]/g, "")}`;
  return (
    <svg aria-hidden viewBox="0 0 100 100" preserveAspectRatio="none" className={`pointer-events-none absolute -inset-4 h-[calc(100%+2rem)] w-[calc(100%+2rem)] overflow-visible md:-inset-5 md:h-[calc(100%+2.5rem)] md:w-[calc(100%+2.5rem)] ${className}`}>
      <defs>
        <filter id={filterId} x="-10%" y="-10%" width="120%" height="120%">
          <feTurbulence type="fractalNoise" baseFrequency="1.6" numOctaves="2" seed="3" result="grain" />
          <feDisplacementMap in="SourceGraphic" in2="grain" scale="1.6" result="rough" />
          <feComponentTransfer in="grain" result="speckle">
            <feFuncA type="table" tableValues="0.35 1 1 1" />
          </feComponentTransfer>
          <feComposite in="rough" in2="speckle" operator="in" />
        </filter>
      </defs>
      <path
        d={LOOP}
        pathLength={1}
        fill="none"
        stroke="#fbf7ea"
        strokeWidth={2.6}
        strokeLinecap="round"
        strokeLinejoin="round"
        filter={`url(#${filterId})`}
        className="pen-draw"
        style={{ "--ink-delay": `${delay}s`, "--ink-dur": "0.9s" } as CSSProperties}
      />
    </svg>
  );
}
