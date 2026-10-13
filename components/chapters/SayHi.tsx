import { Chapter } from "@/components/mat/Chapter";
import { Piece } from "@/components/mat/Piece";
import { Scatter, type ScatterItem } from "@/components/mat/Scatter";
import { MarkerNote } from "@/components/paper/MarkerNote";
import { Squiggle } from "@/components/paper/Squiggle";
import { Sticker } from "@/components/paper/Sticker";
import { TornStrip } from "@/components/paper/TornStrip";
import { chapters } from "@/content/chapters";
import { site } from "@/content/site";

// Things you'd send or pin up. The laptop photo is only a corner of the lid, cut off along the image's
// top and left edges: it's turned round so those cuts run off the bottom-right of the screen.
const OBJECTS: ScatterItem[] = [
  { name: "postcard", x: 43, y: 7, rotate: -6, from: "top", mobile: null },
  { name: "laptop-corner", x: 82, y: 78, rotate: 184, from: "right", mobile: null },
  { name: "washi-masking-tape", x: 35, y: 35, rotate: -8, from: "bottom", mobile: null },
];

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
              <a href={site.linkedinUrl} target="_blank" rel="noreferrer" className="group relative outline-none">
                LinkedIn
                <Squiggle />
              </a>
            </div>
          </div>
        </div>
      </Piece>
      <Piece x={56} y={43} rotate={6} from="right" enterAt={0.1} mobile={{ x: 46, y: 61, rotate: 5 }}>
        <a href={site.resumeHref} download className="drop-object block transition-transform hover:-translate-y-1">
          <div className="paper-kraft relative w-[44vw] rounded-l-[48px] rounded-r-md py-6 pl-14 pr-6 text-kraft-ink md:w-[260px]">
            <span aria-hidden className="absolute left-5 top-1/2 h-5 w-5 -translate-y-1/2 rounded-full bg-mat ring-2 ring-kraft-ink/40" />
            <p className="font-mono text-[10px] uppercase tracking-[0.16em]">Resume</p>
            <p className="font-display text-2xl italic">resume.pdf</p>
          </div>
        </a>
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
      <Piece x={80} y={62} rotate={-4} from="bottom" enterAt={0.16} hideOnMobile className="max-lg:hidden">
        <MarkerNote arrow="up">me &amp; Bailey</MarkerNote>
      </Piece>
    </Chapter>
  );
}
