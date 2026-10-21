import { site } from "@/content/site";
import { ChalkOutline } from "./ChalkOutline";
import { Squiggle } from "./Squiggle";

// The resume as a bright red luggage tag, scribbled round in chalk: the one call to action that should stand out from the paper.
export function ResumeTag({ className = "" }: { className?: string }) {
  return (
    <a
      href={site.resumeHref}
      download
      className={`group drop-object relative block transition-transform hover:-translate-y-1 focus-visible:-translate-y-1 ${className}`}
    >
      <div className="relative w-[46vw] rounded-l-[52px] rounded-r-md bg-resume-red py-4 pl-14 pr-5 text-paper md:w-[min(22vw,330px)] md:py-5 md:pl-16 md:pr-6">
        <span aria-hidden className="absolute left-5 top-1/2 h-5 w-5 -translate-y-1/2 rounded-full bg-mat ring-2 ring-paper/40 md:left-6 md:h-6 md:w-6" />
        <p className="font-mono text-[10px] font-bold uppercase tracking-[0.18em] md:text-[11px]">Resume · PDF</p>
        <p className="mt-0.5 font-display text-[22px] italic leading-tight md:text-[30px]">the long version</p>
        <p className="relative mt-1.5 inline-block font-mono text-[11px] uppercase tracking-[0.12em] md:text-[12px]">
          Download ↓
          <Squiggle className="!text-paper" />
        </p>
      </div>
      <ChalkOutline scribble delay={0.5} />
    </a>
  );
}
