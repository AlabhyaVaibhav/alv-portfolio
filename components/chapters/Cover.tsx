import { Chapter } from "@/components/mat/Chapter";
import { Piece } from "@/components/mat/Piece";
import { Scatter, type ScatterItem } from "@/components/mat/Scatter";
import type { CSSProperties } from "react";
import { MarkerNote } from "@/components/paper/MarkerNote";
import { PenUnderline } from "@/components/paper/PenUnderline";
import { chapters } from "@/content/chapters";
import { site } from "@/content/site";

// The working kit, scattered around the headline and tucked under its edges.
const OBJECTS: ScatterItem[] = [
  { name: "sticky-note-stack", x: 5, y: 12, rotate: -6, from: "left", mobile: { x: 4, y: 57 } },
  { name: "wireframe-sheets", x: -9, y: 52, rotate: 6, from: "left", mobile: null },
  { name: "dot-grid-notebook", x: 79, y: -8, rotate: 5, from: "right", mobile: { x: 40, y: 62 } },
  { name: "black-felt-pen", x: 84, y: 46, rotate: 8, from: "right", mobile: null },
  { name: "binder-clips", x: 72, y: 63, rotate: -9, from: "right", mobile: { x: 70, y: 7, rotate: 10 } },
  { name: "chisel-tip-marker", x: 25, y: 70, rotate: -62, from: "bottom", mobile: null },
];

// Write-on timing, in seconds: the greeting, then each headline line at a pace set by its length,
// then the underline once the last word is down.
const START = 0.35;
const GREETING_DUR = 0.7;
const PER_CHAR = 0.042;
const ink = (delay: number, dur: number) => ({ "--ink-delay": `${delay}s`, "--ink-dur": `${dur}s` }) as CSSProperties;

export function Cover() {
  const lines = site.headline;
  const last = lines[lines.length - 1];
  const cut = last.lastIndexOf(" ") + 1;
  const timing = lines.reduce<{ delay: number; dur: number }[]>((acc, line) => {
    const prev = acc[acc.length - 1];
    const delay = prev ? prev.delay + prev.dur - 0.08 : START + GREETING_DUR - 0.1;
    return [...acc, { delay, dur: Math.max(0.45, line.length * PER_CHAR) }];
  }, []);
  const end = timing[timing.length - 1];

  return (
    <Chapter meta={chapters[0]}>
      <Scatter items={OBJECTS} />
      <Piece x={0} y={24} mobile={{ x: 0, y: 17 }} className="w-full">
        <div className="mx-auto w-fit px-5 md:px-0">
          <p className="font-hand text-3xl leading-none text-cream md:pl-[0.4vw] md:text-[2.6vw]">
            <span className="ink-write inline-block" style={ink(START, GREETING_DUR)}>
              {site.greeting}
            </span>
          </p>
          <h1 className="mt-3 font-display text-[13vw] leading-[0.95] tracking-[-0.01em] text-cream [text-shadow:0_2px_14px_rgba(0,0,0,0.22)] md:mt-[1.2vw] md:text-[6.6vw]">
            {lines.slice(0, -1).map((line, i) => (
              <span key={line} className="ink-write block" style={ink(timing[i].delay, timing[i].dur)}>
                {line}
              </span>
            ))}
            <span className="ink-write block" style={ink(end.delay, end.dur)}>
              {last.slice(0, cut)}
              <em className="relative inline-block">
                {last.slice(cut)}
                <PenUnderline delay={end.delay + end.dur - 0.05} className="-bottom-[0.12em] -left-[3%] h-[0.22em] w-[104%]" />
              </em>
            </span>
          </h1>
        </div>
      </Piece>
      <Piece x={44} y={88} hideOnMobile>
        <MarkerNote arrow="down">scroll</MarkerNote>
      </Piece>
    </Chapter>
  );
}
