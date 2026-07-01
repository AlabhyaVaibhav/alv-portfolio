"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { site } from "@/content/site";

export function Hero() {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });
  const y = useTransform(scrollYProgress, [0, 1], [0, 160]);
  const opacity = useTransform(scrollYProgress, [0, 1], [1, 0]);

  return (
    <section
      ref={ref}
      id="hero"
      className="relative flex h-screen items-center justify-center overflow-hidden bg-paper"
    >
      <motion.div style={{ y, opacity }} className="px-6 text-center">
        <h1 className="font-serif text-5xl text-ink sm:text-7xl">
          {site.name}
        </h1>
        <p className="mt-4 text-lg text-ink/70 sm:text-xl">{site.tagline}</p>
      </motion.div>
      <motion.div
        className="absolute bottom-10 text-sm tracking-widest text-ink/50"
        animate={{ y: [0, 8, 0] }}
        transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
      >
        SCROLL
      </motion.div>
    </section>
  );
}
