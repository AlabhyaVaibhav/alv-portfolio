import type { ReactNode } from "react";

type TornStripProps = {
  children: ReactNode;
  pins?: boolean;
  className?: string;
};

function Pin({ className }: { className: string }) {
  return (
    <span
      aria-hidden
      className={`absolute top-2 z-[1] h-[18px] w-[18px] rounded-full bg-[radial-gradient(circle_at_35%_35%,#9fe08f,#2c9b3c_55%,#17642a)] shadow-[2px_4px_4px_rgba(0,0,0,0.4)] ${className}`}
    />
  );
}

export function TornStrip({ children, pins = true, className = "" }: TornStripProps) {
  return (
    <div className={`drop-object relative ${className}`}>
      <div className="paper-torn bg-paper px-8 pb-4 pt-5 font-mono text-[11px] uppercase leading-relaxed tracking-[0.05em] text-ink md:text-[12px]">
        {children}
      </div>
      {pins && (
        <>
          <Pin className="left-2" />
          <Pin className="right-2" />
        </>
      )}
    </div>
  );
}
