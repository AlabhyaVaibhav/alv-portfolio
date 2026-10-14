import Image from "next/image";

// Lifts and tilts a touch on hover, like a sticker coming unstuck.
export const STICKER_LIFT = "transition-transform duration-300 hover:-translate-y-0.5 hover:-rotate-2";
const SHADOW = "[filter:drop-shadow(0_1px_1px_rgba(0,0,0,0.25))_drop-shadow(0_6px_10px_rgba(0,0,0,0.3))]";

type ImageStickerProps = {
  src: string;
  alt: string;
  width: number;
  height: number;
  // Width classes, e.g. "w-[22vw] md:w-[min(8vw,125px)]".
  className: string;
};

// A die-cut sticker from an image that already carries its white kiss-cut border and transparent surround.
export function ImageSticker({ src, alt, width, height, className }: ImageStickerProps) {
  return (
    <div className={STICKER_LIFT}>
      <Image src={src} alt={alt} width={width} height={height} draggable={false} className={`h-auto select-none ${SHADOW} ${className}`} />
    </div>
  );
}
