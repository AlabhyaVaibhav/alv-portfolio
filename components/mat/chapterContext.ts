"use client";

import { createContext, useContext } from "react";
import type { MotionValue } from "framer-motion";

export type ChapterContextValue = {
  progress: MotionValue<number>;
  isFirst: boolean;
  isLast: boolean;
  // Reduced motion: no pinning, every piece at rest.
  still: boolean;
};

export const ChapterContext = createContext<ChapterContextValue | null>(null);

export function useChapter(): ChapterContextValue {
  const ctx = useContext(ChapterContext);
  if (!ctx) throw new Error("Piece must be rendered inside a Chapter");
  return ctx;
}
