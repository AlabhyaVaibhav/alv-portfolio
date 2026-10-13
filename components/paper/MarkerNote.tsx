import type { ReactNode } from "react";

type Arrow = "left" | "right" | "up" | "down" | "none";

type MarkerNoteProps = {
  children: ReactNode;
  arrow?: Arrow;
  className?: string;
};

const ARROW_TRANSFORM: Record<Exclude<Arrow, "none">, string> = {
  right: "",
  left: "-scale-x-100",
  down: "rotate-90",
  up: "-rotate-90",
};

function HandArrow({ direction }: { direction: Exclude<Arrow, "none"> }) {
  return (
    <svg aria-hidden width="56" height="28" viewBox="0 0 56 28" className={`shrink-0 ${ARROW_TRANSFORM[direction]}`}>
      <path d="M2 20 C 16 4, 34 4, 50 14" stroke="currentColor" strokeWidth="2.2" fill="none" strokeLinecap="round" />
      <path d="M42 8 L51 14 L42 20" stroke="currentColor" strokeWidth="2.2" fill="none" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function MarkerNote({ children, arrow = "none", className = "" }: MarkerNoteProps) {
  return (
    <div className={`flex items-center gap-2 font-hand text-2xl leading-none text-cream md:text-[28px] ${className}`}>
      {arrow === "left" && <HandArrow direction="left" />}
      {arrow === "up" && <HandArrow direction="up" />}
      <span>{children}</span>
      {arrow === "right" && <HandArrow direction="right" />}
      {arrow === "down" && <HandArrow direction="down" />}
    </div>
  );
}
