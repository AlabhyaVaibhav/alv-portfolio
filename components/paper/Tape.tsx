export function Tape({ className = "" }: { className?: string }) {
  return (
    <span
      aria-hidden
      className={`absolute z-[1] h-[18px] w-[56px] bg-[rgba(240,228,190,0.75)] ${className}`}
    />
  );
}
