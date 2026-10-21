import { site } from "@/content/site";
import { ChalkOutline } from "./ChalkOutline";

type ResumeButtonProps = {
  // Show the scribbled note for hiring managers underneath.
  note?: boolean;
  className?: string;
};

// The small "Resume ↓" tab: bright red and scribbled round in chalk so a recruiter finds it first.
export function ResumeButton({ note = false, className = "" }: ResumeButtonProps) {
  return (
    <div className={`relative ${className}`}>
      <a
        href={site.resumeHref}
        download
        className="drop-object relative block bg-resume-red px-3 py-1.5 font-mono text-[11px] font-bold uppercase tracking-[0.14em] text-paper transition-transform hover:-translate-y-0.5 focus-visible:-translate-y-0.5"
      >
        Resume ↓
      </a>
      <ChalkOutline scribble delay={0.4} className="!-inset-x-2.5 !-inset-y-2 !h-[calc(100%+1rem)] !w-[calc(100%+1.25rem)]" />
      {note && (
        // Phones: under the tab, pointing up. Wider screens: on the open mat to its left, pointing across.
        <p className="pointer-events-none absolute right-0 top-[calc(100%+14px)] flex w-[180px] items-start gap-1 text-right font-hand text-[17px] leading-[1.05] text-cream md:right-[calc(100%+18px)] md:top-0 md:w-[300px] md:items-center md:text-[21px]">
          <svg aria-hidden width="22" height="26" viewBox="0 0 22 26" className="mt-[-6px] shrink-0 md:hidden">
            <path d="M18 24 C 6 20, 4 12, 8 3" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" />
            <path d="M3 8 L8 2 L13 7" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          <span>if you&apos;re a hiring manager, this is where you need to focus</span>
          <svg aria-hidden width="40" height="22" viewBox="0 0 40 22" className="hidden shrink-0 md:block">
            <path d="M2 18 C 12 6, 24 4, 35 9" stroke="currentColor" strokeWidth="2.2" fill="none" strokeLinecap="round" />
            <path d="M28 3 L36 9 L28 15" stroke="currentColor" strokeWidth="2.2" fill="none" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </p>
      )}
    </div>
  );
}
