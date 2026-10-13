// A clipping from the jobs classifieds: a few small-ad blocks, one ringed in red pen. Phones show the first two.
type ClassifiedsClippingProps = {
  company: string;
  years: string;
  focus: string;
  ads: string[];
  // Which ad gets the red-pen ring.
  circled?: number;
};

export function ClassifiedsClipping({ company, years, focus, ads, circled = 0 }: ClassifiedsClippingProps) {
  return (
    <div className="drop-object">
      <div className="paper-torn relative w-[44vw] bg-[#ece6d6] px-3 pb-4 pt-3 text-ink md:w-[min(17vw,270px)] md:px-4">
        <p className="border-b-2 border-double border-ink/60 pb-1 text-center font-display text-lg italic leading-none md:text-xl">Classifieds · Jobs</p>
        <div className="mt-2 grid grid-cols-2 gap-1.5">
          {ads.map((ad, i) => (
            <p key={ad} className={`relative border border-ink/25 px-1.5 py-1 font-mono text-[7.5px] uppercase leading-snug tracking-[0.04em] md:text-[8.5px] ${i >= 2 ? "max-md:hidden" : ""}`}>
              {ad}
              {i === circled && (
                <svg aria-hidden viewBox="0 0 100 60" preserveAspectRatio="none" className="pointer-events-none absolute -inset-1.5 h-[calc(100%+0.75rem)] w-[calc(100%+0.75rem)] overflow-visible">
                  <path d="M52 4 C 92 2, 99 22, 95 40 C 90 58, 30 60, 10 50 C -4 40, 2 12, 30 6 C 40 4, 50 4, 60 7" fill="none" stroke="#c2412c" strokeWidth={2.2} strokeLinecap="round" vectorEffect="non-scaling-stroke" />
                </svg>
              )}
            </p>
          ))}
        </div>
        <p className="mt-2 font-hand text-xl leading-none md:text-[22px]">
          {company} <span className="font-mono text-[9px] uppercase tracking-[0.12em] text-ink/60">{years}</span>
        </p>
        <p className="font-mono text-[9px] uppercase tracking-[0.1em] text-ink/70 md:text-[10px]">{focus}</p>
      </div>
    </div>
  );
}
