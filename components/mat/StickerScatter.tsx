import { TextSticker } from "@/components/paper/TextSticker";
import type { SkillSticker } from "@/content/skills";
import type { Edge } from "@/lib/pieceTrack";
import { Piece } from "./Piece";

export type PlacedSticker = SkillSticker & {
  x: number;
  y: number;
  rotate: number;
  // Where it sits on phones; null hides it there.
  mobile: { x: number; y: number } | null;
  // e.g. "md:max-xl:hidden" to skip widths where the desktop spot is too tight.
  className?: string;
};

// A handful of text stickers stuck onto a chapter's mat, entering just after the chapter's paper.
export function StickerScatter({ stickers, from = "top", enterAt = 0.13 }: { stickers: PlacedSticker[]; from?: Edge; enterAt?: number }) {
  return stickers.map((s, i) => (
    <Piece
      key={s.label}
      x={s.x}
      y={s.y}
      rotate={s.rotate}
      from={from}
      enterAt={enterAt + i * 0.012}
      mobile={s.mobile ? { ...s.mobile, rotate: s.rotate, scale: 0.85 } : undefined}
      hideOnMobile={s.mobile === null}
      className={s.className}
    >
      <TextSticker label={s.label} tone={s.tone} shape={s.shape} />
    </Piece>
  ));
}

// Pairs a list of stickers with their spots, in order.
export function place(stickers: SkillSticker[], spots: Omit<PlacedSticker, keyof SkillSticker>[]): PlacedSticker[] {
  return stickers.slice(0, spots.length).map((s, i) => ({ ...s, ...spots[i] }));
}
