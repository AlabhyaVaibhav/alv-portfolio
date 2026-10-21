import { Chapter } from "@/components/mat/Chapter";
import { Piece } from "@/components/mat/Piece";
import { Scatter, type ScatterItem } from "@/components/mat/Scatter";
import { ClassifiedsClipping } from "@/components/paper/ClassifiedsClipping";
import { KraftCard } from "@/components/paper/KraftCard";
import { LogoSticker, type LogoName } from "@/components/paper/LogoStickers";
import { MarkerNote } from "@/components/paper/MarkerNote";
import { ProcessScrap } from "@/components/paper/ProcessScrap";
import { Receipt } from "@/components/paper/Receipt";
import { ResumeTag } from "@/components/paper/ResumeTag";
import { chapters } from "@/content/chapters";
import { workHistory, type Company } from "@/content/work";

// Worker safety kit around the current job. Kept to things without much writing on them, so they
// don't compete with the cards for attention.
const OBJECTS: ScatterItem[] = [
  { name: "safety-checklist-clipboard", x: 83, y: 46, rotate: -8, from: "right", mobile: null },
  { name: "hard-hat", x: 69, y: 73, rotate: 12, from: "bottom", mobile: null },
  { name: "walkie-talkie", x: 55, y: 2, rotate: -14, from: "top", mobile: null },
];

// Each company's logo, stuck on or beside its artifact. Rendered after the paper so it sits on top.
// `className` limits a sticker to wide screens where the desktop spot is free (the heading runs wider
// on tablets).
const LOGO_STICKERS: { name: LogoName; x: number; y: number; rotate: number; mobile: { x: number; y: number } | null; className?: string }[] = [
  { name: "itron", x: 50, y: 9, rotate: -6, mobile: { x: 36, y: 5 }, className: "md:max-xl:hidden" },
  { name: "commerceiq", x: 71, y: 31, rotate: 9, mobile: { x: 85, y: 44 } },
  { name: "soroco", x: 50, y: 76, rotate: 7, mobile: { x: 34, y: 68 } },
  { name: "quikr", x: 19, y: 53, rotate: -8, mobile: { x: 30, y: 43 } },
  { name: "mckinsey", x: 30, y: 88, rotate: -3, mobile: null },
];

const company = (name: string): Company => {
  const found = workHistory.find((c) => c.name === name);
  if (!found) throw new Error(`No ${name} in workHistory`);
  return found;
};

// What each earlier job left on the desk. TODO(copy): the ad and process wording is illustrative.
// The ringed ad comes first so it survives on phones, which show only two.
const QUIKR_ADS = ["Interviews: book a slot online", "Wanted: delivery associates", "Hiring: field sales, Bengaluru", "Openings: warehouse staff"];
const SOROCO_STEPS = ["inbox", "cluster", "map process", "automate"];

export function DayJob() {
  const current = workHistory[0];
  const ciq = company("CommerceIQ");
  const soroco = company("Soroco");
  const quikr = company("Quikr");

  return (
    <Chapter meta={chapters[1]}>
      <Scatter items={OBJECTS} />
      <Piece x={6} y={8} from="left" enterAt={0.02} hideOnMobile>
        <h2 className="font-display text-6xl italic text-cream md:text-7xl">Building at {current.name}</h2>
      </Piece>
      {current.highlights?.map((h, i) => (
        <Piece
          key={h.title}
          x={[5, 29][i] ?? 5}
          y={[22, 20][i] ?? 22}
          rotate={[-3, 2][i] ?? 0}
          from={i ? "top" : "left"}
          enterAt={0.04 + i * 0.03}
          mobile={{ x: [4, 50][i] ?? 4, y: [11, 14][i] ?? 11, rotate: [-3, 2][i] ?? 0 }}
        >
          <KraftCard title={h.title} metric={h.metric} tag={`${current.name} · now`}>
            {h.line}
          </KraftCard>
        </Piece>
      ))}
      <Piece x={55} y={35} rotate={3} from="right" enterAt={0.08} mobile={{ x: 49, y: 47, rotate: 3, scale: 0.88 }}>
        <Receipt
          company={ciq.name}
          years={ciq.years}
          focus={ciq.focus ?? ""}
          lines={[
            { item: "Ally · AI insights", value: "ARR+GDR" },
            { item: "Reporting platform", value: "−79% manual" },
            { item: "RBAC & users", value: "+10% QoQ" },
            { item: "Discovery", value: "4 shipped" },
          ]}
          total={{ label: "Saved / yr", value: "~$500K" }}
        />
      </Piece>
      <Piece x={29} y={60} rotate={-2} from="bottom" enterAt={0.11} mobile={{ x: 1, y: 71, rotate: -2, scale: 0.82 }}>
        <ProcessScrap company={soroco.name} years={soroco.years} focus={soroco.focus ?? ""} steps={SOROCO_STEPS} />
      </Piece>
      <Piece x={4} y={58} rotate={2} from="left" enterAt={0.14} mobile={{ x: 1, y: 46, rotate: 2, scale: 0.82 }}>
        <ClassifiedsClipping company={`${quikr.name} Jobs`} years={quikr.years} focus={quikr.focus ?? ""} ads={QUIKR_ADS} circled={0} />
      </Piece>
      <Piece x={5} y={50} rotate={-2} from="left" enterAt={0.12} hideOnMobile className="max-xl:hidden">
        <MarkerNote arrow="down">before {current.name}</MarkerNote>
      </Piece>
      {/* Phones skip it here: the Say hi chapter has the same tag. */}
      <Piece x={73} y={8} rotate={4} from="right" enterAt={0.1} hideOnMobile>
        <ResumeTag />
      </Piece>
      {LOGO_STICKERS.map((logo, i) => (
        <Piece
          key={logo.name}
          x={logo.x}
          y={logo.y}
          rotate={logo.rotate}
          from="top"
          enterAt={0.14 + i * 0.015}
          mobile={logo.mobile ? { ...logo.mobile, rotate: logo.rotate, scale: 0.85 } : undefined}
          hideOnMobile={logo.mobile === null}
          className={logo.className}
        >
          <LogoSticker name={logo.name} />
        </Piece>
      ))}
    </Chapter>
  );
}
