import { Chapter } from "@/components/mat/Chapter";
import { Piece } from "@/components/mat/Piece";
import { Scatter, type ScatterItem } from "@/components/mat/Scatter";
import { StickerScatter, place } from "@/components/mat/StickerScatter";
import { aiTools, competencies } from "@/content/skills";
import { MarkerNote } from "@/components/paper/MarkerNote";
import { Squiggle } from "@/components/paper/Squiggle";
import { ResumeTag } from "@/components/paper/ResumeTag";
import { Sticker } from "@/components/paper/Sticker";
import { TornStrip } from "@/components/paper/TornStrip";
import { chapters } from "@/content/chapters";
import { site } from "@/content/site";

// The laptop photo is only a corner of the lid, cut off along the image's top and left edges: it's
// turned round so those cuts run off the bottom-right of the screen.
const OBJECTS: ScatterItem[] = [
  { name: "laptop-corner", x: 82, y: 78, rotate: 184, from: "right", mobile: null },
];

// The AI tools he builds with, in the open middle of the mat, and the resume's core competencies as
// kraft labels in the bottom-left. Phones get three AI stickers beside the heading; tablets, where
// the middle of the mat is narrower, skip both.
const AI_STICKERS = place(aiTools, [
  { x: 42, y: 42, rotate: -5, mobile: { x: 68, y: 9 }, className: "md:max-xl:hidden" },
  { x: 55, y: 39, rotate: 4, mobile: { x: 64, y: 16 }, className: "md:max-xl:hidden" },
  { x: 66, y: 45, rotate: -3, mobile: { x: 73, y: 22 }, className: "md:max-xl:hidden" },
  { x: 46, y: 53, rotate: 6, mobile: null, className: "md:max-xl:hidden" },
  { x: 59, y: 56, rotate: -4, mobile: null, className: "md:max-xl:hidden" },
]);

const SKILL_LABELS = place(competencies, [
  { x: 3, y: 70, rotate: -3, mobile: null, className: "md:max-xl:hidden" },
  { x: 22, y: 72, rotate: 2, mobile: null, className: "md:max-xl:hidden" },
  { x: 4, y: 78, rotate: 2, mobile: null, className: "md:max-xl:hidden" },
  { x: 19, y: 80, rotate: -2, mobile: null, className: "md:max-xl:hidden" },
  { x: 6, y: 86, rotate: -1, mobile: null, className: "md:max-xl:hidden" },
  { x: 19, y: 89, rotate: 3, mobile: null, className: "md:max-xl:hidden" },
]);

export function SayHi() {
  return (
    <Chapter meta={chapters[5]}>
      <Scatter items={OBJECTS} />
      <Piece x={6} y={12} from="left" enterAt={0.02} mobile={{ x: 5, y: 10 }}>
        <h2 className="font-display text-[22vw] italic leading-none text-cream md:text-[10vw]">Say hi.</h2>
      </Piece>
      <Piece x={8} y={44} rotate={-3} from="bottom" enterAt={0.06} mobile={{ x: 4, y: 29, rotate: -2 }}>
        <div className="drop-object">
          <div className="w-[88vw] bg-paper p-6 text-ink md:w-[380px]">
            <p className="font-display text-3xl italic">{site.name}</p>
            <p className="mt-1 font-mono text-[10px] uppercase tracking-[0.14em] text-ink/60">Product · Photography · Side projects</p>
            <div className="mt-5 flex flex-col items-start gap-3 font-mono text-[12px]">
              <a href={`mailto:${site.email}`} className="group relative outline-none">
                {site.email}
                <Squiggle />
              </a>
              <div className="flex gap-5">
                <a href={site.linkedinUrl} target="_blank" rel="noreferrer" className="group relative outline-none">
                  LinkedIn
                  <Squiggle />
                </a>
                <a href={site.githubUrl} target="_blank" rel="noreferrer" className="group relative outline-none">
                  GitHub
                  <Squiggle />
                </a>
              </div>
            </div>
          </div>
        </div>
      </Piece>
      <Piece x={40} y={13} rotate={-4} from="top" enterAt={0.1} mobile={{ x: 46, y: 60, rotate: 5 }}>
        <ResumeTag />
      </Piece>
      <Piece x={40} y={74} rotate={-1} from="bottom" enterAt={0.14} mobile={{ x: 4, y: 84, rotate: -1 }}>
        <TornStrip>
          <p className="max-w-[min(80vw,440px)]">{site.closingNote}</p>
        </TornStrip>
      </Piece>
      <Piece x={80} y={8} rotate={4} from="right" enterAt={0.12} mobile={{ x: 6, y: 61, rotate: -4 }}>
        <Sticker
          src="/sticker/alabhya-bailey-sticker.webp"
          alt="Alabhya grinning, with Bailey the cat perched on one shoulder"
          width={600}
          height={923}
          className="w-[26vw] md:w-[min(15vw,250px)]"
        />
      </Piece>
      <Piece x={80} y={68} rotate={-4} from="bottom" enterAt={0.16} hideOnMobile className="max-lg:hidden">
        <MarkerNote arrow="up">me &amp; Bailey</MarkerNote>
      </Piece>
      <Piece x={42} y={33} rotate={-2} from="top" enterAt={0.12} hideOnMobile className="max-xl:hidden">
        <MarkerNote arrow="down">my AI toolkit</MarkerNote>
      </Piece>
      <StickerScatter stickers={AI_STICKERS} />
      <StickerScatter stickers={SKILL_LABELS} from="left" enterAt={0.15} />
    </Chapter>
  );
}
