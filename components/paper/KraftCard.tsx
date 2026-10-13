import type { ReactNode } from "react";
import { Tape } from "./Tape";

type KraftCardProps = {
  title: string;
  tag?: string;
  metric?: string;
  children?: ReactNode;
  tape?: boolean;
  size?: "md" | "lg";
  href?: string;
  className?: string;
};

const WIDTH = {
  md: "w-[42vw] md:w-[min(22vw,330px)]",
  lg: "w-[42vw] md:w-[min(30vw,420px)]",
};

export function KraftCard({ title, tag, metric, children, tape = true, size = "md", href, className = "" }: KraftCardProps) {
  const body = (
    <div className={`paper-kraft relative p-3 text-kraft-ink md:p-4 ${WIDTH[size]}`}>
      {tag && (
        <span className="absolute right-2 top-2 -rotate-3 border border-kraft-ink/60 px-1.5 py-0.5 font-mono text-[8px] uppercase tracking-[0.14em] md:right-3 md:top-3 md:text-[10px]">
          {tag}
        </span>
      )}
      <h3 className={`font-display italic leading-tight ${tag ? "pr-14" : ""} ${size === "lg" ? "text-2xl md:text-4xl" : "text-[22px] md:text-[30px]"}`}>
        {title}
      </h3>
      {metric && <p className="mt-1 font-mono text-[10px] font-bold uppercase tracking-[0.08em] md:text-[12px]">{metric}</p>}
      {children && <div className="mt-2 font-mono text-[11px] leading-relaxed md:text-[13px]">{children}</div>}
    </div>
  );

  return (
    <div className={`drop-object relative ${className}`}>
      {href ? (
        <a href={href} target="_blank" rel="noreferrer" className="block transition-transform hover:-translate-y-0.5">
          {body}
        </a>
      ) : (
        body
      )}
      {tape && (
        <>
          <Tape className="-left-4 -top-1 -rotate-[30deg]" />
          <Tape className="-right-4 -top-1 rotate-[25deg]" />
        </>
      )}
    </div>
  );
}
