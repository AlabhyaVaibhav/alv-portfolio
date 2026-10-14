"use client";

import { useState, useSyncExternalStore, type MouseEvent, type ReactNode } from "react";
import { createPortal } from "react-dom";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { usePrefersReducedMotion } from "@/components/mat/usePrefersReducedMotion";

type FolderLinkProps = {
  href: string;
  // Shown on the folder's tab and on the sheet inside.
  title: string;
  eyebrow?: string;
  className?: string;
  children: ReactNode;
};

const subscribeNever = () => () => {};

export const FROM_FOLDER = "case-from-folder";

// Timings, in seconds: the folder lands, its cover swings open, then the sheet lifts out and fills
// the screen, and the case-study page takes over.
const LAND = 0.32;
const OPEN = 0.5;
const LIFT = 0.42;
const EASE = [0.33, 1, 0.68, 1] as const;

// A link to a case study that opens a manila folder on the desk before navigating.
// Modified clicks (new tab, etc.) and reduced motion skip the animation.
export function FolderLink({ href, title, eyebrow, className = "", children }: FolderLinkProps) {
  const router = useRouter();
  const still = usePrefersReducedMotion();
  const [opening, setOpening] = useState(false);
  const isClient = useSyncExternalStore(subscribeNever, () => true, () => false);

  const onClick = (event: MouseEvent<HTMLAnchorElement>) => {
    if (still || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey || event.button !== 0) return;
    event.preventDefault();
    router.prefetch(href);
    // Lets the case-study page fade in from the paper the animation ends on.
    try {
      sessionStorage.setItem(FROM_FOLDER, "1");
    } catch {}
    setOpening(true);
  };

  return (
    <>
      <Link href={href} onClick={onClick} className={className}>
        {children}
      </Link>
      {isClient &&
        opening &&
        createPortal(<Folder title={title} eyebrow={eyebrow} onDone={() => router.push(href)} />, document.body)}
    </>
  );
}

function Folder({ title, eyebrow, onDone }: { title: string; eyebrow?: string; onDone: () => void }) {
  // The sheet sits under the closed cover, then comes to the front once the cover is open so it lifts
  // out over it. (framer-motion applies z-index instantly, ignoring delays, so this is plain state.)
  const [coverOpen, setCoverOpen] = useState(false);
  return (
    <div role="status" aria-live="polite" className="fixed inset-0 z-[60] flex items-center justify-center">
      <span className="sr-only">Opening the {title} case study</span>
      {/* The desk dims behind the folder. */}
      <motion.div
        aria-hidden
        className="absolute inset-0 bg-[#1a2c28]/70"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: LAND }}
      />

      <motion.div
        aria-hidden
        className="relative aspect-[4/3] w-[min(84vw,560px)] [perspective:1800px]"
        initial={{ y: 40, scale: 0.86, opacity: 0, rotate: -4 }}
        animate={{ y: 0, scale: 1, opacity: 1, rotate: -1.5 }}
        transition={{ duration: LAND, ease: EASE }}
      >
        {/* Back of the folder, with its tab. */}
        <div className="paper-kraft absolute inset-0 rounded-[6px] rounded-tl-none shadow-[0_24px_40px_rgba(0,0,0,0.35)]">
          <span className="paper-kraft absolute -top-7 left-0 flex h-8 w-[46%] items-center rounded-t-[8px] px-4 font-hand text-[20px] leading-none text-kraft-ink md:text-[22px]">
            {title}
          </span>
        </div>

        {/* The case-study sheet inside: it lifts out and grows to fill the screen. */}
        <motion.div
          className={`absolute inset-x-[5%] top-[7%] bottom-[5%] origin-center rounded-[4px] ${coverOpen ? "z-[3]" : "z-[1]"} bg-paper px-[7%] py-[8%] text-ink shadow-[0_2px_6px_rgba(0,0,0,0.15)]`}
          initial={{ y: 0, scale: 1 }}
          animate={{ y: [0, -24, 0], scale: [1, 1.04, 6] }}
          transition={{ delay: LAND + OPEN - 0.05, duration: LIFT, ease: "easeIn", times: [0, 0.3, 1] }}
          onAnimationComplete={onDone}
        >
          {eyebrow && <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-ink/55 md:text-[11px]">{eyebrow}</p>}
          <p className="mt-1 font-display text-[34px] leading-none md:text-[48px]">{title}</p>
          <div className="mt-4 space-y-2">
            {[92, 84, 88, 60].map((w) => (
              <span key={w} className="block h-[6px] rounded-full bg-ink/10" style={{ width: `${w}%` }} />
            ))}
          </div>
        </motion.div>

        {/* Front cover, hinged on the left edge like a book: it swings open and over. */}
        <motion.div
          className="absolute inset-0 z-[2] origin-left [transform-style:preserve-3d]"
          initial={{ rotateY: 0 }}
          animate={{ rotateY: -168 }}
          transition={{ delay: LAND - 0.04, duration: OPEN, ease: [0.55, 0.05, 0.25, 1] }}
          onAnimationComplete={() => setCoverOpen(true)}
        >
          <div className="paper-kraft absolute inset-0 rounded-[6px] [backface-visibility:hidden]">
            <span className="absolute bottom-[10%] right-[8%] font-mono text-[10px] uppercase tracking-[0.2em] text-kraft-ink/60">case study</span>
          </div>
          {/* The inside of the cover, seen once it swings past halfway. */}
          <div className="paper-kraft absolute inset-0 rounded-[6px] brightness-[0.82] [backface-visibility:hidden] [transform:rotateY(180deg)]" />
        </motion.div>
      </motion.div>

      {/* The page sheet: by the end, paper covers the screen so the case-study page arrives seamlessly. */}
      <motion.div
        aria-hidden
        className="absolute inset-0 bg-paper"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: LAND + OPEN + LIFT * 0.55, duration: LIFT * 0.45, ease: "easeIn" }}
      />
    </div>
  );
}
