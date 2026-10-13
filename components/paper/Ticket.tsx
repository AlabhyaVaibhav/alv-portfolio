import type { ReactNode } from "react";

type TicketProps = {
  label: string;
  children: ReactNode;
  href?: string;
  download?: boolean;
  className?: string;
};

export function Ticket({ label, children, href, download, className = "" }: TicketProps) {
  const body = (
    <div className="flex bg-[#e9e1cc] font-mono text-ink">
      <div className="rotate-180 border-l-2 border-dashed border-ink/30 px-2 py-3 text-[9px] uppercase tracking-[0.18em] [writing-mode:vertical-rl]">
        {label}
      </div>
      <div className="px-4 py-3 text-[11px] uppercase leading-relaxed tracking-[0.06em] md:text-[12px]">{children}</div>
    </div>
  );
  return (
    <div className={`drop-object ${className}`}>
      {href ? (
        <a href={href} download={download} target={download ? undefined : "_blank"} rel="noreferrer" className="block transition-transform hover:-translate-y-0.5">
          {body}
        </a>
      ) : (
        body
      )}
    </div>
  );
}
