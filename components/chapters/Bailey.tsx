import { Chapter } from "@/components/mat/Chapter";
import { Piece } from "@/components/mat/Piece";
import { MarkerNote } from "@/components/paper/MarkerNote";
import { Polaroid } from "@/components/paper/Polaroid";
import { StickyNote } from "@/components/paper/StickyNote";
import { Ticket } from "@/components/paper/Ticket";
import { TodoSticky } from "@/components/paper/TodoSticky";
import { bailey } from "@/content/bailey";
import { chapters } from "@/content/chapters";
import { site } from "@/content/site";

const PLACES = [
  { x: 8, y: 14, rotate: -5, from: "left", mobile: { x: 4, y: 11 } },
  { x: 28, y: 38, rotate: 4, from: "bottom", mobile: { x: 52, y: 14 } },
  { x: 50, y: 12, rotate: -2, from: "top", mobile: { x: 4, y: 42 } },
  { x: 70, y: 40, rotate: 5, from: "right", mobile: { x: 52, y: 45 } },
] as const;

export function Bailey() {
  return (
    <Chapter meta={chapters[4]}>
      {bailey.slice(0, PLACES.length).map((slot, i) => {
        const place = PLACES[i];
        return (
          <Piece
            key={slot.id}
            x={place.x}
            y={place.y}
            rotate={place.rotate}
            from={place.from}
            enterAt={0.02 + i * 0.03}
            mobile={{ ...place.mobile, rotate: place.rotate }}
          >
            <Polaroid src={slot.src} alt={slot.alt} caption={slot.caption} />
          </Piece>
        );
      })}
      <Piece x={71} y={13} rotate={-4} from="right" enterAt={0.12} hideOnMobile>
        <Ticket label="drive">
          BLR → somewhere
          <br />
          2 humans · 1 cat
        </Ticket>
      </Piece>
      <Piece x={8} y={66} rotate={-4} from="left" enterAt={0.15} mobile={{ x: 30, y: 74, rotate: -4, scale: 0.85 }}>
        <StickyNote color="pink">{site.baileyNote}</StickyNote>
      </Piece>
      <Piece x={48} y={52} rotate={3} from="bottom" enterAt={0.16} hideOnMobile className="max-lg:hidden">
        <TodoSticky title={site.todoTitle} items={site.todo} />
      </Piece>
      <Piece x={48} y={80} rotate={-2} from="bottom" enterAt={0.18} hideOnMobile>
        <MarkerNote arrow="left">the other half of the job</MarkerNote>
      </Piece>
    </Chapter>
  );
}
