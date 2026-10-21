import { DeskObject } from "@/components/paper/DeskObject";
import type { ObjectName } from "@/content/objects";
import type { Edge } from "@/lib/pieceTrack";
import { Piece } from "./Piece";

export type ScatterItem = {
  name: ObjectName;
  x: number;
  y: number;
  rotate: number;
  from: Edge;
  // Where it sits on phones; null hides it there.
  mobile: { x: number; y: number; rotate?: number } | null;
  enterAt?: number;
};

// Decorative desk objects for a chapter. Render before the chapter's content so they sit underneath it.
// `blurred` throws them slightly out of focus, for chapters whose content should hold the eye.
export function Scatter({ items, blurred = false }: { items: ScatterItem[]; blurred?: boolean }) {
  return items.map((o, i) => (
    <Piece
      key={o.name}
      decor
      x={o.x}
      y={o.y}
      rotate={o.rotate}
      from={o.from}
      enterAt={o.enterAt ?? 0.02 + i * 0.02}
      mobile={o.mobile ? { rotate: o.rotate, ...o.mobile } : undefined}
      hideOnMobile={o.mobile === null}
    >
      {blurred ? (
        <div className="blur-[1.5px] brightness-[0.85] md:blur-[2.5px]">
          <DeskObject name={o.name} />
        </div>
      ) : (
        <DeskObject name={o.name} />
      )}
    </Piece>
  ));
}
