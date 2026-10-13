// A black bulldog/binder clip with silver wire handles, drawn flat. ~64x46.
export function BinderClip({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 64 46" aria-hidden className={className}>
      {/* wire handles */}
      <path d="M17 22 L12 3 Q12 1 14 1 L22 1 Q24 1 23.5 3 L21 22" fill="none" stroke="#c9ccd1" strokeWidth="2.4" strokeLinejoin="round" />
      <path d="M47 22 L52 3 Q52 1 50 1 L42 1 Q40 1 40.5 3 L43 22" fill="none" stroke="#c9ccd1" strokeWidth="2.4" strokeLinejoin="round" />
      {/* jaws */}
      <path d="M6 20 L58 20 L54 44 Q54 46 52 46 L12 46 Q10 46 10 44 Z" fill="#1d1d1f" />
      <path d="M6 20 L58 20 L57 24 L7 24 Z" fill="#3a3a3e" />
      <path d="M14 40 L50 40" stroke="#ffffff" strokeOpacity="0.08" strokeWidth="2" />
    </svg>
  );
}
