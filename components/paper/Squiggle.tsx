import { squigglePath } from "@/lib/pen";

const PATH = squigglePath(120, 8);

type SquiggleProps = {
  // Always drawn (e.g. the current chapter), rather than only on hover or focus.
  drawn?: boolean;
  className?: string;
};

// A marker squiggle under a link. The parent needs `group relative`; the squiggle draws itself on
// the parent's hover or keyboard focus.
export function Squiggle({ drawn = false, className = "" }: SquiggleProps) {
  return (
    <svg
      aria-hidden
      viewBox="0 0 120 8"
      preserveAspectRatio="none"
      className={`pointer-events-none absolute -bottom-2 left-0 h-2 w-full overflow-visible text-[#e0623a] ${className}`}
    >
      <path
        d={PATH}
        pathLength={1}
        fill="none"
        stroke="currentColor"
        strokeWidth={2.2}
        strokeLinecap="round"
        vectorEffect="non-scaling-stroke"
        className={`[stroke-dasharray:1] transition-[stroke-dashoffset] duration-500 ease-out motion-reduce:transition-none ${
          drawn ? "[stroke-dashoffset:0]" : "[stroke-dashoffset:1] group-hover:[stroke-dashoffset:0] group-focus-visible:[stroke-dashoffset:0]"
        }`}
      />
    </svg>
  );
}
