import type { CSSProperties } from "react";
import Image from "next/image";
import { OBJECTS, type ObjectName } from "@/content/objects";

type DeskObjectProps = {
  name: ObjectName;
  className?: string;
};

// A cut-out object lying on the mat, drawn at real-world size: its width is its length in cm times
// the page's --cm scale (see globals.css). Decorative: hidden from assistive tech, never catches clicks.
export function DeskObject({ name, className = "" }: DeskObjectProps) {
  const { size, cm } = OBJECTS[name];
  return (
    <Image
      src={`/objects/${name}.webp`}
      alt=""
      aria-hidden
      width={size[0]}
      height={size[1]}
      draggable={false}
      style={{ width: `calc(var(--cm) * ${cm})` } as CSSProperties}
      className={`pointer-events-none h-auto max-w-none select-none [filter:drop-shadow(0_2px_2px_rgba(0,0,0,0.25))_drop-shadow(0_10px_14px_rgba(0,0,0,0.28))] max-md:[filter:drop-shadow(0_4px_4px_rgba(0,0,0,0.3))] ${className}`}
    />
  );
}
