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
  // Width classes for the object, e.g. "w-[40vw] md:w-[min(15vw,250px)]".
  width: string;
  // Where it sits on phones; null hides it there.
  mobile: { x: number; y: number; rotate?: number } | null;
  enterAt?: number;
};

// Decorative desk objects for a chapter. Render before the chapter's content so they sit underneath it.
export function Scatter({ items }: { items: ScatterItem[] }) {
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
      <DeskObject name={o.name} className={o.width} />
    </Piece>
  ));
}
