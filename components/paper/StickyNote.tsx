import type { ReactNode } from "react";

type StickyNoteProps = {
  children: ReactNode;
  color?: "yellow" | "pink";
  className?: string;
};

export function StickyNote({ children, color = "yellow", className = "" }: StickyNoteProps) {
  const bg = color === "pink" ? "bg-sticky-pink" : "bg-sticky-yellow";
  return (
    <div className={`drop-object ${className}`}>
      <div className={`aspect-square w-[38vw] p-3 font-hand text-2xl leading-tight text-ink md:w-[170px] md:p-4 ${bg}`}>
        {children}
      </div>
    </div>
  );
}
