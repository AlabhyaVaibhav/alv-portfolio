import Image from "next/image";
import type { Project } from "@/content/projects";

export function ProjectCard({ project }: { project: Project }) {
  const { name, kind, blurb, link, image, note } = project;

  return (
    <article
      data-card
      className="flex w-[74vw] shrink-0 snap-start flex-col last:snap-end rounded-[18px] bg-paper p-3 shadow-[0_1px_2px_rgba(30,40,20,0.06),0_10px_28px_rgba(30,40,20,0.10)] md:w-[min(34vw,480px)] md:rounded-[22px] md:p-5"
    >
      <div className="relative aspect-[16/10] max-h-[30vh] w-full overflow-hidden rounded-[12px] bg-[#ecebe6] md:rounded-[14px]">
        {image ? (
          <Image src={image} alt={`${name} screenshot`} fill sizes="(min-width: 768px) 480px, 74vw" className="object-cover" />
        ) : (
          <span
            role="img"
            aria-label={`${name} screenshot coming soon`}
            className="absolute inset-0 flex items-center justify-center bg-[repeating-linear-gradient(45deg,#e6e4dc_0_8px,#efede6_8px_16px)] font-mono text-[10px] uppercase tracking-[0.14em] text-ink/45"
          >
            screenshot soon
          </span>
        )}
        <span className="absolute right-2.5 top-2.5 rounded-full bg-paper px-3 py-1 font-mono text-[9px] uppercase tracking-[0.14em] text-ink shadow-sm md:right-3 md:top-3 md:text-[10px]">
          {kind === "client" ? "Client" : "Internal"}
        </span>
        {note && (
          <span className="absolute bottom-3 left-2 -rotate-6 bg-sticky-yellow px-2.5 py-1 font-hand text-xl leading-none text-ink shadow-sm md:text-2xl">
            {note}
          </span>
        )}
      </div>
      <h3 className="mt-4 font-display text-3xl italic leading-tight text-ink md:mt-5 md:text-4xl">{name}</h3>
      <p className="mt-2 font-mono text-[11px] leading-relaxed text-ink/80 md:text-[12.5px]">{blurb}</p>
      {link ? (
        <a
          href={link}
          target="_blank"
          rel="noreferrer"
          className="mt-auto self-start pt-4 font-mono text-[11px] uppercase tracking-[0.12em] text-ink underline-offset-4 hover:underline md:pt-5 md:text-xs"
        >
          Read more →
        </a>
      ) : (
        // TODO(copy)
        <span className="mt-auto pt-4 font-mono text-[11px] uppercase tracking-[0.12em] text-ink/40 md:pt-5 md:text-xs">
          Write-up soon
        </span>
      )}
    </article>
  );
}
