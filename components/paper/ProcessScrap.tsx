// A torn scrap of graph paper with a hand-drawn process map: boxes joined by pen arrows.
type ProcessScrapProps = {
  company: string;
  years: string;
  focus: string;
  steps: string[];
};

export function ProcessScrap({ company, years, focus, steps }: ProcessScrapProps) {
  return (
    <div className="drop-object">
      <div className="paper-torn relative w-[43vw] bg-[#f6f3ea] bg-[linear-gradient(rgba(70,110,150,0.14)_1px,transparent_1px),linear-gradient(90deg,rgba(70,110,150,0.14)_1px,transparent_1px)] bg-[size:12px_12px] px-3 pb-3 pt-3 text-ink md:w-[min(22vw,330px)] md:px-4 md:pb-4 md:pt-4">
        <div className="flex flex-wrap items-center gap-x-1 gap-y-2">
          {steps.map((step, i) => (
            <span key={step} className="flex items-center gap-1">
              <span className="rounded-[3px] border-[1.5px] border-ink/80 px-1.5 py-0.5 font-hand text-[17px] leading-none md:text-[21px]">{step}</span>
              {i < steps.length - 1 && (
                <svg aria-hidden viewBox="0 0 22 10" className="h-2.5 w-5 shrink-0 overflow-visible">
                  <path d="M1 5 C 7 3, 13 7, 19 5 M15 1.5 L20 5 L15 8.5" fill="none" stroke="#2b2620" strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              )}
            </span>
          ))}
        </div>
        <p className="mt-2 font-hand text-[22px] leading-none md:mt-3 md:text-[28px]">
          {company} <span className="font-mono text-[10px] uppercase tracking-[0.12em] text-ink/70 md:text-[12px]">{years}</span>
        </p>
        <p className="font-mono text-[10px] uppercase tracking-[0.08em] text-ink/80 md:text-[12px]">{focus}</p>
      </div>
    </div>
  );
}
