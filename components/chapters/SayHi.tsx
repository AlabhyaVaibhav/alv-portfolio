import { Chapter } from "@/components/mat/Chapter";
import { Piece } from "@/components/mat/Piece";
import { MarkerNote } from "@/components/paper/MarkerNote";
import { Sticker } from "@/components/paper/Sticker";
import { TornStrip } from "@/components/paper/TornStrip";
import { chapters } from "@/content/chapters";
import { site } from "@/content/site";

export function SayHi() {
  return (
    <Chapter meta={chapters[5]}>
      <Piece x={6} y={12} from="left" enterAt={0.02} mobile={{ x: 5, y: 10 }}>
        <h2 className="font-display text-[22vw] italic leading-none text-cream md:text-[10vw]">Say hi.</h2>
      </Piece>
      <Piece x={8} y={44} rotate={-3} from="bottom" enterAt={0.06} mobile={{ x: 4, y: 32, rotate: -2 }}>
        <div className="drop-object">
          <div className="w-[88vw] bg-paper p-6 text-ink md:w-[380px]">
            <p className="font-display text-3xl italic">{site.name}</p>
            <p className="mt-1 font-mono text-[10px] uppercase tracking-[0.14em] text-ink/60">Product · Photography · Side projects</p>
            <div className="mt-5 space-y-1.5 font-mono text-[12px]">
              <a href={`mailto:${site.email}`} className="block underline decoration-ink/30 underline-offset-4 hover:decoration-ink">
                {site.email}
              </a>
              <a href={site.linkedinUrl} target="_blank" rel="noreferrer" className="block underline decoration-ink/30 underline-offset-4 hover:decoration-ink">
                LinkedIn
              </a>
            </div>
          </div>
        </div>
      </Piece>
      <Piece x={56} y={40} rotate={6} from="right" enterAt={0.1} mobile={{ x: 46, y: 61, rotate: 5 }}>
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
