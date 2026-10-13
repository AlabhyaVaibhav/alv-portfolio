import { Chapter } from "@/components/mat/Chapter";
import { Piece } from "@/components/mat/Piece";
import { Scatter, type ScatterItem } from "@/components/mat/Scatter";
import { ClassifiedsClipping } from "@/components/paper/ClassifiedsClipping";
import { KraftCard } from "@/components/paper/KraftCard";
import { ProcessScrap } from "@/components/paper/ProcessScrap";
import { Receipt } from "@/components/paper/Receipt";
import { Ticket } from "@/components/paper/Ticket";
import { chapters } from "@/content/chapters";
import { site } from "@/content/site";
import { workHistory, type Company } from "@/content/work";

// Worker safety kit around the current job.
const OBJECTS: ScatterItem[] = [
  { name: "safety-checklist-clipboard", x: 82, y: 48, rotate: -8, from: "right", mobile: null },
  { name: "hard-hat", x: 64, y: 70, rotate: 12, from: "bottom", mobile: null },
  { name: "near-miss-report", x: 66, y: 3, rotate: 6, from: "top", mobile: null },
  { name: "walkie-talkie", x: 47, y: 3, rotate: -14, from: "top", mobile: null },
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
      <Piece x={6} y={10} from="left" enterAt={0.02} hideOnMobile>
        <h2 className="font-display text-6xl italic text-cream md:text-7xl">Building at {current.name}</h2>
      </Piece>
      {current.highlights?.map((h, i) => (
        <Piece
          key={h.title}
          x={[5, 27][i] ?? 5}
          y={[27, 25][i] ?? 27}
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
      <Piece x={50} y={22} rotate={3} from="right" enterAt={0.08} mobile={{ x: 50, y: 50, rotate: 3 }}>
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
      <Piece x={23} y={58} rotate={-2} from="bottom" enterAt={0.11} mobile={{ x: 4, y: 71, rotate: -2 }}>
        <ProcessScrap company={soroco.name} years={soroco.years} focus={soroco.focus ?? ""} steps={SOROCO_STEPS} />
      </Piece>
      <Piece x={4} y={56} rotate={3} from="left" enterAt={0.14} mobile={{ x: 4, y: 42, rotate: 2 }}>
        <ClassifiedsClipping company={`${quikr.name} Jobs`} years={quikr.years} focus={quikr.focus ?? ""} ads={QUIKR_ADS} circled={0} />
      </Piece>
      {/* Phones skip the ticket: the Say hi chapter has the resume too. */}
      <Piece x={80} y={22} rotate={6} from="right" enterAt={0.1} hideOnMobile>
        <Ticket label="resume" href={site.resumeHref} download>
          resume.pdf
          <br />
          the long version
        </Ticket>
      </Piece>
    </Chapter>
  );
}
