import Image from "next/image";

type StickerProps = {
  src: string;
  alt: string;
  width: number;
  height: number;
  className?: string;
};

// A die-cut sticker: the image carries its own white border and transparent surround, so the
// shadow follows the cut line rather than a rectangle.
export function Sticker({ src, alt, width, height, className = "" }: StickerProps) {
  return (
    <Image
      src={src}
      alt={alt}
      width={width}
      height={height}
      className={`h-auto [filter:drop-shadow(0_2px_1px_rgba(0,0,0,0.22))_drop-shadow(0_10px_18px_rgba(0,0,0,0.28))] ${className}`}
    />
  );
}
