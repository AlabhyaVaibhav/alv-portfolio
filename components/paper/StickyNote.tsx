"use client";

import type { CSSProperties, ReactNode } from "react";
import { motion } from "framer-motion";
import { useFinePointer } from "@/components/mat/useFinePointer";
import { ChalkOutline } from "./ChalkOutline";

type StickyNoteProps = {
  children: ReactNode;
  color?: "yellow" | "pink";
  // Size and padding of the note itself. Defaults to a square note with big handwriting.
  bodyClassName?: string;
  // Circle the note in chalk, drawn after this many seconds, to set it apart from the other paper.
  // Lives inside the draggable layer so it moves with the note.
  outlineDelay?: number;
  className?: string;
};

const COLORS = {
  yellow: { bg: "bg-sticky-yellow", flap: "#fbe7a6" },
  pink: { bg: "bg-sticky-pink", flap: "#f8d3c4" },
};

// Square before hover; on hover the bottom-right corner lifts. Same vertex count both ways so it animates.
const FLAT = "polygon(0 0, 100% 0, 100% 100%, 100% 100%, 0 100%)";
const PEELED = "polygon(0 0, 100% 0, 100% calc(100% - 30px), calc(100% - 30px) 100%, 0 100%)";

// A sticky note that peels at the corner on hover and can be dragged around the mat with a mouse.
export function StickyNote({
  children,
  color = "yellow",
  bodyClassName = "aspect-square w-[38vw] p-3 text-2xl md:w-[170px] md:p-4",
  outlineDelay,
  className = "",
}: StickyNoteProps) {
  const canDrag = useFinePointer();
  const { bg, flap } = COLORS[color];

  return (
    <motion.div
      drag={canDrag}
      dragMomentum={false}
      whileDrag={{ scale: 1.05, rotate: 3 }}
      className={`group drop-object relative select-none ${canDrag ? "cursor-grab touch-none active:cursor-grabbing" : ""} ${className}`}
    >
      <div
        className={`font-hand leading-tight text-ink transition-[clip-path,translate] duration-300 ease-out [clip-path:var(--flat)] group-hover:-translate-y-0.5 group-hover:[clip-path:var(--peeled)] motion-reduce:transition-none ${bg} ${bodyClassName}`}
        style={{ "--flat": FLAT, "--peeled": PEELED } as CSSProperties}
      >
        {children}
      </div>
      {/* The lifted corner: a folded-back triangle that grows out of the bottom-right on hover. */}
      <span
        aria-hidden
        className="absolute bottom-0 right-0 h-[30px] w-[30px] origin-bottom-right scale-0 transition-transform duration-300 ease-out group-hover:-translate-y-0.5 group-hover:scale-100 motion-reduce:transition-none"
        style={{
          background: `linear-gradient(135deg, ${flap} 0%, ${flap} 48%, rgba(0,0,0,0.18) 50%, transparent 56%)`,
          clipPath: "polygon(0 0, 100% 0, 0 100%)",
        }}
      />
      {outlineDelay !== undefined && <ChalkOutline delay={outlineDelay} />}
    </motion.div>
  );
}
