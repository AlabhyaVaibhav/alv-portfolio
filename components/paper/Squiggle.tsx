import { squigglePath } from "@/lib/pen";

const PATH = squigglePath(120, 8);

type SquiggleProps = {
  // Always drawn (e.g. the current chapter), rather than only on hover or focus.
  drawn?: boolean;
  className?: string;
};

// A marker squiggle under a link. The parent needs `group relative`; the squiggle draws itself left
// to right on the parent's hover or keyboard focus. Revealed with a clip rather than a dash offset,
// because the path is stretched to the link's width and stretched dashes repeat.
export function Squiggle({ drawn = false, className = "" }: SquiggleProps) {
  return (
    <svg
      aria-hidden
      viewBox="0 0 120 8"
      preserveAspectRatio="none"
      className={`pointer-events-none absolute -bottom-2 left-0 h-2 w-full overflow-visible text-[#e0623a] transition-[clip-path] duration-500 ease-out motion-reduce:transition-none ${
        drawn
          ? "[clip-path:inset(-4px_0_-4px_0)]"
          : "[clip-path:inset(-4px_100%_-4px_0)] group-hover:[clip-path:inset(-4px_0_-4px_0)] group-focus-visible:[clip-path:inset(-4px_0_-4px_0)]"
      } ${className}`}
    >
      <path d={PATH} fill="none" stroke="currentColor" strokeWidth={2.2} strokeLinecap="round" vectorEffect="non-scaling-stroke" />
    </svg>
  );
}
