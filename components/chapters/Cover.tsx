import { Chapter } from "@/components/mat/Chapter";
import { Piece } from "@/components/mat/Piece";
import { MarkerNote } from "@/components/paper/MarkerNote";
import { Polaroid } from "@/components/paper/Polaroid";
import { chapters } from "@/content/chapters";
import { photography } from "@/content/photography";
import { site } from "@/content/site";

// A few prints scattered around the headline, overlapping its edges.
const PRINTS = [
  { id: "09", x: 6, y: 16, rotate: -8, from: "left", mobile: { x: 58, y: 64 } },
  { id: "17", x: 10, y: 60, rotate: 6, from: "left", mobile: { x: 8, y: 66 } },
  { id: "48", x: 82, y: 14, rotate: 7, from: "right", mobile: null },
  { id: "30", x: 81, y: 67, rotate: -5, from: "right", mobile: null },
] as const;

export function Cover() {
  const lines = site.headline;
  const last = lines[lines.length - 1];
  const cut = last.lastIndexOf(" ") + 1;

  return (
    <Chapter meta={chapters[0]}>
      {PRINTS.map((print) => {
        const photo = photography.find((p) => p.id === print.id)!;
        return (
          <Piece
            key={print.id}
            x={print.x}
            y={print.y}
            rotate={print.rotate}
            from={print.from}
            mobile={print.mobile ? { ...print.mobile, rotate: print.rotate } : undefined}
            hideOnMobile={print.mobile === null}
          >
            <Polaroid src={photo.src} alt={photo.alt} size="xs" ratio={Math.min(Math.max(photo.ratio, 0.75), 1.3)} />
          </Piece>
        );
      })}
      <Piece x={0} y={24} mobile={{ x: 0, y: 17 }} className="w-full">
        <div className="mx-auto w-fit px-5 md:px-0">
          <p className="font-hand text-3xl leading-none text-cream md:pl-[0.4vw] md:text-[2.6vw]">{site.greeting}</p>
          <h1 className="mt-3 font-display text-[13vw] leading-[0.95] tracking-[-0.01em] text-cream [text-shadow:0_2px_14px_rgba(0,0,0,0.22)] md:mt-[1.2vw] md:text-[6.6vw]">
            {lines.slice(0, -1).map((line) => (
              <span key={line} className="block">
                {line}
              </span>
            ))}
            <span className="block">
              {last.slice(0, cut)}
              <em>{last.slice(cut)}</em>
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
