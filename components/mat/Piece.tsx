"use client";

import type { ReactNode } from "react";
import { motion, useTransform } from "framer-motion";
import { pieceTrack, type Edge } from "@/lib/pieceTrack";
import { useChapter } from "./chapterContext";
import { useIsMobile } from "./useIsMobile";

type Placement = { x: number; y: number; rotate?: number; scale?: number };

type PieceProps = Placement & {
  from?: Edge;
  enterAt?: number;
  mobile?: Placement;
  hideOnMobile?: boolean;
  className?: string;
  children: ReactNode;
};

// Places one object on the chapter stage at (x%, y%) and drives it from the chapter's scroll progress.
export function Piece({
  x,
  y,
  rotate = 0,
  scale = 1,
  from = "bottom",
  enterAt = 0.2,
  mobile,
  hideOnMobile = false,
  className = "",
  children,
}: PieceProps) {
  const { progress, isFirst, isLast, still } = useChapter();
  const isMobile = useIsMobile();
  const place =
    isMobile && mobile
      ? { x: mobile.x, y: mobile.y, rotate: mobile.rotate ?? rotate, scale: mobile.scale ?? scale }
      : { x, y, rotate, scale };

  const track = pieceTrack({ from, enterAt, rotate: place.rotate, enter: !isFirst, exit: !isLast });
  const tx = useTransform(progress, track.input, track.x.map((v) => `${v}vw`));
  const ty = useTransform(progress, track.input, track.y.map((v) => `${v}vh`));
  const tr = useTransform(progress, track.input, track.rotate);

  if (isMobile && hideOnMobile) return null;

  return (
    <motion.div
      // Remount when the breakpoint flips so the transforms pick up the new placement.
      key={isMobile ? "mobile" : "desktop"}
      className={`pointer-events-auto absolute ${className}`}
      style={{
        left: `${place.x}%`,
        top: `${place.y}%`,
        scale: place.scale,
        ...(still ? { rotate: place.rotate } : { x: tx, y: ty, rotate: tr }),
      }}
    >
      {children}
    </motion.div>
  );
}
