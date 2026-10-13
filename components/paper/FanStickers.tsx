import type { ReactNode } from "react";
import Image from "next/image";

// Fan stickers. The crest, the Hamilton sticker and the car are images Alabhya supplied, cut out with
// a white die-cut border (public/stickers/); the Old Trafford stub is drawn here. Each lifts slightly
// on hover like a sticker coming unstuck.
const LIFT = "transition-transform duration-300 hover:-translate-y-0.5 hover:-rotate-2";
const SHADOW = "[filter:drop-shadow(0_1px_1px_rgba(0,0,0,0.25))_drop-shadow(0_6px_10px_rgba(0,0,0,0.3))]";

function Shell({ label, children, round = false }: { label: string; children: ReactNode; round?: boolean }) {
  return (
    <div
      role="img"
      aria-label={label}
      className={`bg-white p-[5px] shadow-[0_1px_1px_rgba(0,0,0,0.25),0_6px_12px_rgba(0,0,0,0.3)] ${LIFT} ${round ? "rounded-full" : "rounded-[12px]"}`}
    >
      {children}
    </div>
  );
}

function ImageSticker({ src, alt, width, height, className }: { src: string; alt: string; width: number; height: number; className: string }) {
  return (
    <div className={LIFT}>
      <Image src={src} alt={alt} width={width} height={height} draggable={false} className={`h-auto select-none ${SHADOW} ${className}`} />
    </div>
  );
}

export function ManUtdSticker() {
  return (
    <ImageSticker
      src="/stickers/manchester-united.webp"
      alt="Manchester United crest sticker"
      width={593}
      height={600}
      className="w-[22vw] md:w-[min(8vw,125px)]"
    />
  );
}

// A stub from Old Trafford.
export function OldTraffordSticker() {
  return (
    <Shell label="Sticker: Old Trafford, Theatre of Dreams, been there">
      <div className="flex items-stretch rounded-[8px] bg-[#1a1a1a] text-white">
        <div className="flex flex-col justify-center px-3 py-2">
          <span className="font-mono text-[8px] uppercase tracking-[0.18em] text-[#fbe122] md:text-[9px]">Theatre of Dreams</span>
          <span className="font-display text-xl italic leading-tight md:text-2xl">Old Trafford</span>
        </div>
        <div className="flex items-center border-l-2 border-dashed border-white/40 bg-[#da291c] px-2.5 font-hand text-lg leading-none md:text-xl">
          been
          <br />
          there ✓
        </div>
      </div>
    </Shell>
  );
}

export function HamiltonSticker() {
  return (
    <ImageSticker
      src="/stickers/hamilton-ferrari.webp"
      alt="Sticker of Lewis Hamilton celebrating in Ferrari red, with his Ferrari car"
      width={516}
      height={600}
      className="w-[22vw] md:w-[min(9vw,140px)]"
    />
  );
}

export function M340iSticker() {
  return (
    <ImageSticker
      src="/stickers/bmw-m340i.webp"
      alt="BMW M340i sticker"
      width={600}
      height={256}
      className="w-[34vw] md:w-[min(12vw,185px)]"
    />
  );
}
