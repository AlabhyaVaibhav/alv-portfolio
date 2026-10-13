import { Chapter } from "@/components/mat/Chapter";
import { Piece } from "@/components/mat/Piece";
import { Scatter, type ScatterItem } from "@/components/mat/Scatter";
import { MarkerNote } from "@/components/paper/MarkerNote";
import { chapters } from "@/content/chapters";
import { site } from "@/content/site";

// The working kit, scattered around the headline and tucked under its edges.
const OBJECTS: ScatterItem[] = [
  { name: "sticky-note-stack", x: 3, y: 8, rotate: -6, from: "left", width: "w-[40vw] md:w-[min(15vw,250px)]", mobile: { x: 3, y: 56 } },
  { name: "wireframe-sheets", x: 3, y: 50, rotate: 6, from: "left", width: "md:w-[min(16vw,270px)]", mobile: null },
  { name: "dot-grid-notebook", x: 77, y: 2, rotate: 5, from: "right", width: "w-[52vw] md:w-[min(20vw,340px)]", mobile: { x: 45, y: 60 } },
  { name: "black-felt-pen", x: 83, y: 42, rotate: 8, from: "right", width: "md:w-[min(9vw,150px)]", mobile: null },
  { name: "binder-clips", x: 70, y: 62, rotate: -9, from: "right", width: "w-[26vw] md:w-[min(11vw,190px)]", mobile: { x: 70, y: 8, rotate: 10 } },
  { name: "chisel-tip-marker", x: 25, y: 70, rotate: -62, from: "bottom", width: "md:w-[min(6vw,100px)]", mobile: null },
];

export function Cover() {
  const lines = site.headline;
  const last = lines[lines.length - 1];
  const cut = last.lastIndexOf(" ") + 1;

  return (
    <Chapter meta={chapters[0]}>
      <Scatter items={OBJECTS} />
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
