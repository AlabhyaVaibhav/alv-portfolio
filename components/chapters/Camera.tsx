"use client";

import { useState } from "react";
import { Chapter } from "@/components/mat/Chapter";
import { Piece } from "@/components/mat/Piece";
import { StickerScatter, place } from "@/components/mat/StickerScatter";
import { cameraKit } from "@/content/skills";
import { Lightbox } from "@/components/photography/Lightbox";
import { MarkerNote } from "@/components/paper/MarkerNote";
import { Polaroid } from "@/components/paper/Polaroid";
import { Tape } from "@/components/paper/Tape";
import { chapters } from "@/content/chapters";
import { PHOTO_GROUPS, photography } from "@/content/photography";
import { groupPhotos, printRatio } from "@/lib/photoGroups";

const PER_PILE = 4;

// One pile per group: three columns on desktop (two rows of two prints), three rows on mobile (three
// prints each). Prints share a height and keep their photo's width.
const PILES = [
  { x: 3, y: 15, rotate: -1.5, from: "left", mobile: { x: 4, y: 11 } },
  { x: 36, y: 18, rotate: 1, from: "bottom", mobile: { x: 4, y: 36 } },
  { x: 70, y: 15, rotate: -1, from: "right", mobile: { x: 4, y: 61 } },
] as const;

// Small per-print tilts so a pile reads as tossed-down prints, not a grid.
const TILT = ["-rotate-3", "rotate-2", "rotate-1", "-rotate-2"];

// What the photos were shot and edited with, stuck along the bottom of the mat.
const KIT_STICKERS = place(cameraKit, [
  { x: 4, y: 80, rotate: -4, mobile: { x: 3, y: 87 } },
  { x: 17, y: 88, rotate: 5, mobile: { x: 40, y: 90 } },
  { x: 68, y: 79, rotate: 3, mobile: { x: 66, y: 86 } },
  { x: 84, y: 77, rotate: -6, mobile: null, className: "md:max-lg:hidden" },
  { x: 87, y: 91, rotate: -2, mobile: null, className: "md:max-lg:hidden" },
]);

export function Camera() {
  const piles = groupPhotos(photography, PHOTO_GROUPS.map((g) => g.id), PER_PILE);
  const [open, setOpen] = useState<{ pile: number; index: number } | null>(null);

  return (
    <Chapter meta={chapters[2]}>
      {piles.map((pile, p) => {
        const place = PILES[p];
        const label = PHOTO_GROUPS[p].label;
        return (
          <Piece
            key={pile.id}
            x={place.x}
            y={place.y}
            rotate={place.rotate}
            from={place.from}
            enterAt={0.03 + p * 0.04}
            mobile={{ ...place.mobile, rotate: place.rotate }}
          >
            <div className="flex flex-col items-start gap-2 md:gap-3">
              <div className="relative ml-2 flex items-baseline gap-3 bg-paper px-3 py-1 shadow-sm">
                <Tape className="-top-2 left-1/2 -translate-x-1/2 -rotate-3" />
                <h3 className="font-hand text-2xl leading-none text-ink md:text-[28px]">{label}</h3>
                <button
                  type="button"
                  onClick={() => setOpen({ pile: p, index: 0 })}
                  className="font-mono text-[10px] uppercase tracking-[0.12em] text-ink/60 underline-offset-2 hover:text-ink hover:underline"
                >
                  all {pile.all.length} →
                </button>
              </div>
              {/* Mobile: the row wrappers dissolve into one row. Desktop: two rows stacked. */}
              <div className="flex items-end gap-2 md:flex-col md:items-start md:gap-3">
                {[pile.shown.slice(0, 2), pile.shown.slice(2, 4)].map((row, r) => (
                  <div key={r} className="flex items-end gap-3 max-md:contents">
                    {row.map((slot, k) => {
                      const i = r * 2 + k;
                      return (
                        <div key={slot.id} className={`${TILT[i % TILT.length]} ${i >= 3 ? "max-md:hidden" : ""}`}>
                          <Polaroid
                            src={slot.src}
                            alt={slot.alt}
                            size="xs"
                            ratio={printRatio(slot.ratio)}
                            onClick={() => setOpen({ pile: p, index: i })}
                          />
                        </div>
                      );
                    })}
                  </div>
                ))}
              </div>
            </div>
          </Piece>
        );
      })}
      <Piece x={30} y={88} rotate={-2} from="bottom" enterAt={0.2} hideOnMobile>
        {/* TODO(copy) */}
        <MarkerNote arrow="up">{photography.length} prints, three piles. click one to flip through</MarkerNote>
      </Piece>
      <Lightbox
        slots={open ? piles[open.pile].all : []}
        activeIndex={open ? open.index : null}
        onClose={() => setOpen(null)}
        onNavigate={(index) => setOpen((o) => (o ? { ...o, index } : o))}
      />
      <StickerScatter stickers={KIT_STICKERS} from="bottom" enterAt={0.1} />
    </Chapter>
  );
}
