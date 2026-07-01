"use client";

import { motion } from "framer-motion";
import type { ReactNode } from "react";

type ScrollRevealProps = {
  children: ReactNode;
  direction?: "up" | "left" | "right";
  delay?: number;
  className?: string;
};

const offsets: Record<NonNullable<ScrollRevealProps["direction"]>, { x: number; y: number }> = {
  up: { x: 0, y: 32 },
  left: { x: -32, y: 0 },
  right: { x: 32, y: 0 },
};

export function ScrollReveal({
  children,
  direction = "up",
  delay = 0,
  className,
}: ScrollRevealProps) {
  const offset = offsets[direction];
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, x: offset.x, y: offset.y }}
      whileInView={{ opacity: 1, x: 0, y: 0 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration: 0.6, delay, ease: "easeOut" }}
    >
      {children}
    </motion.div>
  );
}
