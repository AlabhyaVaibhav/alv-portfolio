import { site } from "@/content/site";
import { Squiggle } from "./Squiggle";
import { Tape } from "./Tape";

const MAILTO = `mailto:${site.email}?subject=${encodeURIComponent("Photo commission")}`;

// A short, wide card taped across the top of the camera chapter, telling visitors they can book a
// shoot. The link opens an email.
export function CommissionCard() {
  return (
    <div className="drop-object relative w-[88vw] bg-paper px-4 py-2.5 text-ink md:w-auto md:px-5">
      <Tape className="-top-2 left-8 -rotate-3" />
      <Tape className="-top-2 right-8 rotate-3" />
      <div className="flex flex-wrap items-baseline gap-x-3">
        <p className="font-mono text-[9px] font-bold uppercase tracking-[0.18em] text-resume-red md:text-[10px]">Commissions open</p>
        <p className="font-display text-[21px] italic leading-tight md:text-[24px]">Book me for a shoot</p>
      </div>
      <div className="mt-1 flex flex-wrap items-baseline gap-x-4 gap-y-1">
        <ul className="flex flex-wrap gap-x-4 font-hand text-[18px] leading-tight md:text-[20px]">
          {site.commissions.map((c) => (
            <li key={c} className="flex items-baseline gap-1.5">
              <span aria-hidden className="text-resume-red">✶</span>
              {c}
            </li>
          ))}
        </ul>
        <a href={MAILTO} className="group relative font-mono text-[11px] font-bold uppercase tracking-[0.12em] md:text-xs">
          Say hello →
          <Squiggle />
        </a>
      </div>
    </div>
  );
}
