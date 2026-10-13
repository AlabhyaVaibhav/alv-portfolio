"use client";

import type { ReactNode } from "react";
import { cubicBezier, motion, useTransform } from "framer-motion";
import { pieceTrack, type Ease, type Edge } from "@/lib/pieceTrack";
import { useChapter } from "./chapterContext";
import { useIsMobile } from "./useIsMobile";

const EASING: Record<Ease, (t: number) => number> = {
  linear: (t) => t,
  in: cubicBezier(0.55, 0, 1, 0.45),
  out: cubicBezier(0.33, 1, 0.68, 1),
};

type Placement = { x: number; y: number; rotate?: number; scale?: number };

type PieceProps = Placement & {
  from?: Edge;
  enterAt?: number;
  mobile?: Placement;
  hideOnMobile?: boolean;
  // Purely decorative: clicks pass through to whatever is underneath.
  decor?: boolean;
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
  decor = false,
  className = "",
  children,
}: PieceProps) {
  const { progress, isFirst, isLast, still } = useChapter();
  const isMobile = useIsMobile();
  const place =
    isMobile && mobile
      ? { x: mobile.x, y: mobile.y, rotate: mobile.rotate ?? rotate, scale: mobile.scale ?? scale }
      : { x, y, rotate, scale };

  const track = pieceTrack({ from, enterAt, rotate: place.rotate, enter: !isFirst, exit: !isLast, vertical: isMobile });
  const ease = { ease: track.ease.map((e) => EASING[e]) };
  const tx = useTransform(progress, track.input, track.x.map((v) => `${v}vw`), ease);
  const ty = useTransform(progress, track.input, track.y.map((v) => `${v}vh`), ease);
  const tr = useTransform(progress, track.input, track.rotate, ease);

  if (isMobile && hideOnMobile) return null;

  return (
    <motion.div
      // Remount when the breakpoint flips so the transforms pick up the new placement.
      key={isMobile ? "mobile" : "desktop"}
      className={`${decor ? "pointer-events-none" : "pointer-events-auto"} absolute ${className}`}
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
