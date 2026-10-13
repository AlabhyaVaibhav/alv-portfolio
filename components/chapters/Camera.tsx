"use client";

import { useState } from "react";
import { Chapter } from "@/components/mat/Chapter";
import { Piece } from "@/components/mat/Piece";
import { Lightbox } from "@/components/photography/Lightbox";
import { MarkerNote } from "@/components/paper/MarkerNote";
import { Polaroid } from "@/components/paper/Polaroid";
import { chapters } from "@/content/chapters";
import { photography } from "@/content/photography";
import { withSrc } from "@/lib/collections";

const PLACES = [
  { x: 6, y: 14, rotate: -6, from: "left", mobile: { x: 6, y: 12 } },
  { x: 24, y: 32, rotate: 4, from: "bottom", mobile: { x: 52, y: 14 } },
  { x: 42, y: 12, rotate: -3, from: "top", mobile: { x: 6, y: 38 } },
  { x: 60, y: 28, rotate: 5, from: "right", mobile: { x: 52, y: 40 } },
  { x: 79, y: 12, rotate: -4, from: "right", mobile: { x: 6, y: 64 } },
  { x: 10, y: 58, rotate: 3, from: "left", mobile: { x: 52, y: 66 } },
  { x: 46, y: 58, rotate: -5, from: "bottom", mobile: null },
  { x: 74, y: 56, rotate: 4, from: "right", mobile: null },
] as const;

export function Camera() {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const shown = withSrc(photography, PLACES.length);

  return (
    <Chapter meta={chapters[2]}>
      {shown.map((slot, i) => {
        const place = PLACES[i];
        return (
          <Piece
            key={slot.id}
            x={place.x}
            y={place.y}
            rotate={place.rotate}
            from={place.from}
            enterAt={0.12 + i * 0.025}
            mobile={place.mobile ? { ...place.mobile, rotate: place.rotate } : undefined}
            hideOnMobile={place.mobile === null}
          >
            <Polaroid
              src={slot.src}
              alt={slot.alt}
              size="sm"
              onClick={() => setActiveIndex(photography.indexOf(slot))}
            />
          </Piece>
        );
      })}
      <Piece x={28} y={86} rotate={-2} from="bottom" enterAt={0.3} hideOnMobile>
        <MarkerNote arrow="up">click any of them to look closer ({photography.length} in the box)</MarkerNote>
      </Piece>
      <Lightbox
        slots={photography}
        activeIndex={activeIndex}
        onClose={() => setActiveIndex(null)}
        onNavigate={setActiveIndex}
      />
    </Chapter>
  );
}
