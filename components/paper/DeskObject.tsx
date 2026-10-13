import Image from "next/image";
import { OBJECT_SIZES, type ObjectName } from "@/content/objects";

type DeskObjectProps = {
  name: ObjectName;
  // Width classes, e.g. "w-[30vw] md:w-[min(14vw,220px)]". Height follows the image.
  className?: string;
};

// A cut-out object lying on the mat. Decorative: hidden from assistive tech and never catches clicks.
export function DeskObject({ name, className = "" }: DeskObjectProps) {
  const [width, height] = OBJECT_SIZES[name];
  return (
    <Image
      src={`/objects/${name}.webp`}
      alt=""
      aria-hidden
      width={width}
      height={height}
      draggable={false}
      className={`pointer-events-none h-auto max-w-none select-none [filter:drop-shadow(0_2px_2px_rgba(0,0,0,0.25))_drop-shadow(0_10px_14px_rgba(0,0,0,0.28))] ${className}`}
    />
  );
}
