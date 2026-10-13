import { Chapter } from "@/components/mat/Chapter";
import { Piece } from "@/components/mat/Piece";
import { KraftCard } from "@/components/paper/KraftCard";
import { Ticket } from "@/components/paper/Ticket";
import { TornStrip } from "@/components/paper/TornStrip";
import { chapters } from "@/content/chapters";
import { site } from "@/content/site";
import { workHistory } from "@/content/work";

const CARD_PLACES = [
  { x: 6, y: 28, rotate: -3, from: "left", mobile: { x: 4, y: 12 } },
  { x: 30, y: 24, rotate: 2, from: "top", mobile: { x: 50, y: 15 } },
  { x: 54, y: 30, rotate: -2, from: "right", mobile: { x: 4, y: 38 } },
  { x: 18, y: 62, rotate: 3, from: "bottom", mobile: { x: 50, y: 41 } },
] as const;

export function DayJob() {
  const current = workHistory[0];
  const timeline = [...workHistory].reverse().filter((c) => !c.isInternship);
  const internship = workHistory.find((c) => c.isInternship);

  return (
    <Chapter meta={chapters[1]}>
      <Piece x={6} y={11} from="left" enterAt={0.12} hideOnMobile>
        <h2 className="font-display text-6xl italic text-cream md:text-7xl">Building at {current.name}</h2>
      </Piece>
      {current.highlights?.map((h, i) => {
        const place = CARD_PLACES[i % CARD_PLACES.length];
        return (
          <Piece
            key={h.title}
            x={place.x}
            y={place.y}
            rotate={place.rotate}
            from={place.from}
            enterAt={0.14 + i * 0.03}
            mobile={{ ...place.mobile, rotate: place.rotate }}
          >
            <KraftCard title={h.title} metric={h.metric}>
              {h.line}
            </KraftCard>
          </Piece>
        );
      })}
      <Piece x={46} y={66} rotate={-1} from="right" enterAt={0.24} mobile={{ x: 4, y: 68, rotate: -1 }}>
        <TornStrip>
          <p>{timeline.map((c) => `${c.name} ${c.years}`).join(" → ")}</p>
          {internship && (
            <p className="mt-1 text-[10px] opacity-70">
              + {internship.name}, {internship.positions[0].title}, {internship.years}
            </p>
          )}
        </TornStrip>
      </Piece>
      <Piece x={79} y={28} rotate={6} from="right" enterAt={0.2} mobile={{ x: 56, y: 84, rotate: 4 }}>
        <Ticket label="resume" href={site.resumeHref} download>
          resume.pdf
          <br />
          the long version
        </Ticket>
      </Piece>
    </Chapter>
  );
}
