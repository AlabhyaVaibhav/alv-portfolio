import type { CSSProperties } from "react";

// Two quick passes of a sketch pen: a long stroke, then a shorter one back across it.
const STROKE = "M3 13 C 45 7, 120 5, 197 8 M 26 17 C 80 12, 140 11, 188 13";

type PenUnderlineProps = {
  delay: number;
  duration?: number;
  className?: string;
};

// A thick, slightly rough marker underline that draws itself after `delay` seconds.
export function PenUnderline({ delay, duration = 0.7, className = "" }: PenUnderlineProps) {
  return (
    <svg aria-hidden viewBox="0 0 200 20" preserveAspectRatio="none" className={`pointer-events-none absolute overflow-visible ${className}`}>
      <defs>
        <filter id="sketch-pen" x="-5%" y="-50%" width="110%" height="200%">
          <feTurbulence type="fractalNoise" baseFrequency="0.8" numOctaves="2" seed="7" />
          <feDisplacementMap in="SourceGraphic" scale="2.2" />
        </filter>
      </defs>
      <path
        d={STROKE}
        pathLength={1}
        fill="none"
        stroke="#e0623a"
        strokeOpacity={0.92}
        strokeWidth={6}
        strokeLinecap="round"
        strokeLinejoin="round"
        filter="url(#sketch-pen)"
        className="pen-draw"
        style={{ "--ink-delay": `${delay}s`, "--ink-dur": `${duration}s` } as CSSProperties}
      />
    </svg>
  );
}
