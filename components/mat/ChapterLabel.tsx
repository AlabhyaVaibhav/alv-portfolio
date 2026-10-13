import type { ChapterMeta } from "@/content/chapters";

const SIDE_LABEL = { build: "Build", life: "Life", both: null } as const;

// Phones show only the title: the fixed chapter button already says "Ch. 0N", and the fixed Resume
// button leaves the label less than half the top bar.
export function ChapterLabel({ meta }: { meta: ChapterMeta }) {
  const side = SIDE_LABEL[meta.side];
  return (
    <div className="drop-object">
      <p className="max-w-[38vw] bg-paper px-3 py-1.5 md:max-w-none font-mono text-[10px] uppercase tracking-[0.14em] text-ink md:text-[11px]">
        <span className="max-md:hidden">
          Ch. {String(meta.number).padStart(2, "0")}
          {side && <> · {side}</>} ·{" "}
        </span>
        {meta.title}
      </p>
    </div>
  );
}
