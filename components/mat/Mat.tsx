// Fixed cutting-mat background: grid (CSS), ruler numbers along the top and left edges, protractor arcs.
const RULER_MARKS = Array.from({ length: 30 }, (_, i) => i);

export function Mat() {
  return (
    <div aria-hidden className="mat pointer-events-none fixed inset-0 z-0 overflow-hidden">
      <div className="absolute left-0 top-0 flex font-mono text-[9px] text-cream/45">
        {RULER_MARKS.map((i) => (
          <span key={i} className="w-[100px] shrink-0 pl-1 pt-0.5">
            {i * 10}
          </span>
        ))}
      </div>
      <div className="absolute left-0 top-0 flex flex-col font-mono text-[9px] text-cream/45">
        {RULER_MARKS.slice(1).map((i) => (
          <span key={i} className="flex h-[100px] shrink-0 items-start pl-1 pt-[88px]">
            {i * 10}
          </span>
        ))}
      </div>
      <div className="absolute -bottom-[35vmax] -right-[20vmax] h-[70vmax] w-[70vmax] rounded-full border border-cream/15" />
      <div className="absolute -bottom-[22vmax] -right-[8vmax] h-[46vmax] w-[46vmax] rounded-full border border-cream/12" />
      <div className="absolute bottom-0 left-[8%] h-px w-[140vmax] origin-left -rotate-[24deg] bg-cream/10" />
    </div>
  );
}
