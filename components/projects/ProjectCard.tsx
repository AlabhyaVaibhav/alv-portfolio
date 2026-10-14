"use client";

import { useState } from "react";
import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import { usePrefersReducedMotion } from "@/components/mat/usePrefersReducedMotion";
import { BinderClip } from "@/components/paper/BinderClip";
import { Squiggle } from "@/components/paper/Squiggle";
import type { Project } from "@/content/projects";

const KIND_LABEL: Record<Project["kind"], string> = { client: "Client", internal: "Internal", writing: "Article" };

export function ProjectCard({ project }: { project: Project }) {
  const { name, kind, blurb, link, image, note, caseStudy } = project;
  const [open, setOpen] = useState(false);
  const still = usePrefersReducedMotion();
  const ease = { duration: still ? 0 : 0.4, ease: [0.33, 1, 0.68, 1] as const };

  return (
    <article
      data-card
      className="relative flex w-[74vw] shrink-0 snap-start flex-col rounded-[18px] bg-paper p-3 shadow-[0_1px_2px_rgba(30,40,20,0.06),0_10px_28px_rgba(30,40,20,0.10)] last:snap-end md:w-[min(34vw,480px)] md:rounded-[22px] md:p-5"
    >
      <div className="relative aspect-[16/10] max-h-[30vh] w-full overflow-hidden rounded-[12px] bg-[#ecebe6] md:rounded-[14px]">
        {image ? (
          <Image src={image} alt={`${name} screenshot`} fill sizes="(min-width: 768px) 480px, 74vw" className="object-cover" />
        ) : (
          <span
            role="img"
            aria-label={`${name} screenshot coming soon`}
            className="absolute inset-0 flex items-center justify-center bg-[repeating-linear-gradient(45deg,#e6e4dc_0_8px,#efede6_8px_16px)] font-mono text-[10px] uppercase tracking-[0.14em] text-ink/45"
          >
            screenshot soon
          </span>
        )}
        <span className="absolute right-2.5 top-2.5 rounded-full bg-paper px-3 py-1 font-mono text-[9px] uppercase tracking-[0.14em] text-ink shadow-sm md:right-3 md:top-3 md:text-[10px]">
          {KIND_LABEL[kind]}
        </span>
        {note && (
          <span className="absolute bottom-3 left-2 -rotate-6 bg-sticky-yellow px-2.5 py-1 font-hand text-xl leading-none text-ink shadow-sm md:text-2xl">
            {note}
          </span>
        )}
      </div>
      <h3 className="mt-4 font-display text-3xl italic leading-tight text-ink md:mt-5 md:text-4xl">{name}</h3>
      <p className="mt-2 font-mono text-[11px] leading-relaxed text-ink/80 md:text-[12.5px]">{blurb}</p>
      {link ? (
        <a
          href={link}
          target="_blank"
          rel="noreferrer"
          className="group relative mt-auto self-start pt-4 font-mono text-[11px] uppercase tracking-[0.12em] text-ink md:pt-5 md:text-xs"
        >
          Read more →
          <Squiggle />
        </a>
      ) : (
        // TODO(copy)
        <span className="mt-auto pt-4 font-mono text-[11px] uppercase tracking-[0.12em] text-ink/40 md:pt-5 md:text-xs">
          Write-up soon
        </span>
      )}

      {caseStudy && (
        <>
          {/* The case study, held under the clip. Unclipping slides it up over the card. */}
          <div className="pointer-events-none absolute inset-0 overflow-hidden rounded-[18px] md:rounded-[22px]">
            <AnimatePresence>
              {open && (
                <motion.div
                  id={`case-${name}`}
                  initial={{ y: "102%" }}
                  animate={{ y: 0 }}
                  exit={{ y: "102%" }}
                  transition={ease}
                  className="pointer-events-auto absolute inset-0 overflow-y-auto overscroll-contain bg-[#fdfcf7] bg-[linear-gradient(transparent_21px,rgba(80,110,160,0.16)_22px)] bg-[length:100%_22px] px-5 pb-2 pt-7 text-ink md:bg-[linear-gradient(transparent_27px,rgba(80,110,160,0.16)_28px)] md:bg-[length:100%_28px] md:px-7 md:pb-5 md:pt-11"
                >
                  <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-ink/55">case study · {name}</p>
                  {(
                    [
                      ["the problem", caseStudy.problem],
                      ["what I did", caseStudy.approach],
                      ["what changed", caseStudy.outcome],
                    ] as const
                  ).map(([label, text]) => (
                    <div key={label} className="mt-2 md:mt-4">
                      <p className="font-hand text-xl leading-none text-[#c2502c] md:text-2xl">{label}</p>
                      <p className="mt-1 font-mono text-[11px] leading-[22px] md:text-[12.5px] md:leading-[28px]">{text}</p>
                    </div>
                  ))}
                  {/* Phones: the sheet can be taller than the card, so a fade pinned to the bottom edge
                      shows there's more to scroll to. At the end it sits below the text. */}
                  <div aria-hidden className="pointer-events-none sticky bottom-0 -mx-5 h-8 bg-gradient-to-t from-[#fdfcf7] to-transparent md:hidden" />
                </motion.div>
              )}
            </AnimatePresence>
          </div>
          <button
            type="button"
            aria-expanded={open}
            aria-controls={`case-${name}`}
            aria-label={open ? `Clip the ${name} case study back` : `Unclip to read the ${name} case study`}
            onClick={() => setOpen((o) => !o)}
            className="group absolute -top-[18px] left-1/2 z-10 -translate-x-1/2 md:-top-[22px]"
          >
            <motion.span
              className="block"
              animate={open ? { rotate: -24, x: -22, y: -6 } : { rotate: 0, x: 0, y: 0 }}
              transition={ease}
            >
              <BinderClip className="h-[34px] w-[48px] drop-shadow-[0_3px_3px_rgba(0,0,0,0.3)] transition-transform group-hover:-translate-y-0.5 md:h-[42px] md:w-[60px]" />
            </motion.span>
            <span className="pointer-events-none absolute left-full top-1 ml-1 whitespace-nowrap font-hand text-lg leading-none text-ink/70 opacity-0 transition-opacity group-hover:opacity-100 group-focus-visible:opacity-100">
              {open ? "clip it back" : "unclip"}
            </span>
          </button>
        </>
      )}
    </article>
  );
}
