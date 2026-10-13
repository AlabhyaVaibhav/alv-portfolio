import { Chapter } from "@/components/mat/Chapter";
import { Piece } from "@/components/mat/Piece";
import { MarkerNote } from "@/components/paper/MarkerNote";
import { Sticker } from "@/components/paper/Sticker";
import { TornStrip } from "@/components/paper/TornStrip";
import { chapters } from "@/content/chapters";
import { site } from "@/content/site";

export function Cover() {
  return (
    <Chapter meta={chapters[0]}>
      <Piece x={5} y={13} mobile={{ x: 5, y: 10 }}>
        <h1 className="font-display text-[19vw] italic leading-[0.88] text-cream [text-shadow:0_2px_12px_rgba(0,0,0,0.25)] md:text-[9vw]">
          Alabhya
          <br />
          Vaibhav
        </h1>
      </Piece>
      <Piece x={6} y={60} rotate={-1.5} mobile={{ x: 4, y: 40 }}>
        <TornStrip>
          <p className="max-w-[min(78vw,430px)]">{site.coverLine}</p>
        </TornStrip>
      </Piece>
      <Piece x={62} y={14} rotate={4} mobile={{ x: 40, y: 58, rotate: 5 }}>
        <Sticker src="/sticker/alabhya-bailey.png" alt="Dot-matrix portrait of Alabhya holding Bailey the cat" width={512} height={495} />
      </Piece>
      <Piece x={63} y={70} rotate={-4} mobile={{ x: 4, y: 84, rotate: -3 }}>
        <MarkerNote arrow="up">that&apos;s me &amp; Bailey</MarkerNote>
      </Piece>
      <Piece x={6} y={86} hideOnMobile>
        <MarkerNote arrow="down">scroll</MarkerNote>
      </Piece>
    </Chapter>
  );
}
