// A till receipt on thermal paper, with a zig-zag tear and a barcode.
type ReceiptProps = {
  company: string;
  years: string;
  focus: string;
  lines: { item: string; value: string }[];
  total: { label: string; value: string };
};

const TEAR = "polygon(0 0, 100% 0, 100% calc(100% - 6px), 95% 100%, 90% calc(100% - 6px), 85% 100%, 80% calc(100% - 6px), 75% 100%, 70% calc(100% - 6px), 65% 100%, 60% calc(100% - 6px), 55% 100%, 50% calc(100% - 6px), 45% 100%, 40% calc(100% - 6px), 35% 100%, 30% calc(100% - 6px), 25% 100%, 20% calc(100% - 6px), 15% 100%, 10% calc(100% - 6px), 5% 100%, 0 calc(100% - 6px))";

export function Receipt({ company, years, focus, lines, total }: ReceiptProps) {
  return (
    <div className="drop-object">
      <div className="w-[46vw] bg-[#fbfaf5] px-3 pb-6 pt-3 font-mono text-[9.5px] uppercase leading-relaxed tracking-[0.04em] text-ink md:w-[min(20vw,300px)] md:px-5 md:pt-5 md:text-[12px]" style={{ clipPath: TEAR }}>
        <p className="text-center text-[12px] font-bold tracking-[0.18em] md:text-[15px]">{company}</p>
        <p className="text-center text-ink/70">{focus}</p>
        <p className="text-center text-ink/70">{years}</p>
        <p className="my-1.5 overflow-hidden whitespace-nowrap text-ink/40">{"-".repeat(60)}</p>
        <ul>
          {lines.map(({ item, value }) => (
            <li key={item} className="flex justify-between gap-2">
              <span>{item}</span>
              <span className="shrink-0">{value}</span>
            </li>
          ))}
        </ul>
        <p className="my-1.5 overflow-hidden whitespace-nowrap text-ink/40">{"-".repeat(60)}</p>
        <p className="flex justify-between gap-2 font-bold">
          <span>{total.label}</span>
          <span>{total.value}</span>
        </p>
        <div aria-hidden className="mx-auto mt-2.5 h-6 w-[85%] bg-[repeating-linear-gradient(90deg,#2b2620_0_1px,transparent_1px_3px,#2b2620_3px_5px,transparent_5px_6px,#2b2620_6px_7px,transparent_7px_10px)]" />
        <p className="mt-1.5 text-center text-ink/70">thank you, come again</p>
      </div>
    </div>
  );
}
