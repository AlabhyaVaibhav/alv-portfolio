import Image from "next/image";

type StickerProps = {
  src: string;
  alt: string;
  width: number;
  height: number;
  className?: string;
};

export function Sticker({ src, alt, width, height, className = "" }: StickerProps) {
  return (
    <div className={`drop-object ${className}`}>
      <Image
        src={src}
        alt={alt}
        width={width}
        height={height}
        className="w-[48vw] rounded-[28px] border-[7px] border-paper md:w-[min(24vw,340px)]"
      />
    </div>
  );
}
