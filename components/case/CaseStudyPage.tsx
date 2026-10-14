import Image from "next/image";
import Link from "next/link";
import { Tape } from "@/components/paper/Tape";
import type { CaseCard, CaseFact, CasePage, Project } from "@/content/projects";
import { PaperArrival } from "./PaperArrival";
import { site } from "@/content/site";
import { projectSlug } from "@/lib/projectPages";

type CaseStudyPageProps = {
  project: Project & { page: CasePage };
  previous: Project | null;
  next: Project | null;
};

const KIND_LABEL: Record<Project["kind"], string> = { client: "Client", internal: "Side project", writing: "Article" };

// A full case study, laid out as one big sheet of paper on the mat: details down the left, the
// story down the right. Reading text is set in Instrument Sans; headings in the display serif.
export function CaseStudyPage({ project, previous, next }: CaseStudyPageProps) {
  const { page } = project;

  return (
    <div className="relative z-[1] px-3 pb-16 pt-4 md:px-8 md:pt-6">
      <PaperArrival />
      <nav aria-label="Case study" className="mx-auto flex max-w-[1180px] items-center justify-between gap-3">
        <Link
          href="/#projects"
          className="drop-object bg-paper px-3 py-1.5 font-mono text-[11px] uppercase tracking-[0.14em] text-ink transition-transform hover:-translate-y-0.5"
        >
          ← back to the desk
        </Link>
        <a
          href={site.resumeHref}
          download
          className="drop-object bg-sticky-yellow px-3 py-1.5 font-mono text-[11px] font-bold uppercase tracking-[0.14em] text-ink transition-transform hover:-translate-y-0.5"
        >
          Resume ↓
        </a>
      </nav>

      <article className="drop-object relative mx-auto mt-5 max-w-[1180px] rounded-[20px] bg-paper px-5 py-8 font-body text-ink md:mt-7 md:rounded-[28px] md:px-12 md:py-14">
        <Tape className="-top-2 left-12 -rotate-6" />
        <Tape className="-top-2 right-12 rotate-6" />

        <div className="md:grid md:grid-cols-[280px_1fr] md:gap-14 lg:grid-cols-[320px_1fr] lg:gap-20">
          <aside className="max-md:hidden">
            <div className="sticky top-8">
              <Details project={project} />
            </div>
          </aside>

          <div className="min-w-0">
            <Hero src={page.hero} bg={project.imageBg} name={project.name} />
            <p className="mt-8 font-mono text-[11px] uppercase tracking-[0.18em] text-ink/60 md:mt-12 md:text-[12px]">{page.eyebrow}</p>
            <h1 className="mt-2 font-display text-[46px] leading-[0.95] tracking-[-0.01em] md:text-[76px]">{project.name}</h1>
            <p className="mt-4 max-w-[60ch] text-[18px] leading-relaxed text-ink/75 md:text-[21px]">{page.dek}</p>

            <div className="mt-8 md:hidden">
              <Details project={project} />
            </div>

            {page.sections.map((section) => (
              <section key={section.title} className="mt-14 md:mt-20">
                <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-ink/60 md:text-[12px]">{section.eyebrow}</p>
                <h2 className="mt-2 font-display text-[34px] leading-tight md:text-[48px]">{section.title}</h2>
                {section.body?.map((paragraph) => (
                  <p key={paragraph.slice(0, 32)} className="mt-4 max-w-[65ch] text-[17px] leading-relaxed text-ink/75 md:text-[19px]">
                    {paragraph}
                  </p>
                ))}
                {section.steps && (
                  <ol className="mt-7 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
                    {section.steps.map((step, i) => (
                      <li key={step.title} className="rounded-[18px] bg-[#f3f0e6] p-5 md:p-6">
                        <span className="font-hand text-[26px] leading-none text-[#c2502c]">{String(i + 1).padStart(2, "0")}</span>
                        <h3 className="mt-2 font-display text-[26px] leading-tight">{step.title}</h3>
                        <p className="mt-2 text-[16px] leading-relaxed text-ink/70">{step.text}</p>
                      </li>
                    ))}
                  </ol>
                )}
                {section.cards && (
                  <div className="mt-7 grid gap-4 md:grid-cols-2">
                    {section.cards.map((card) => (
                      <Card key={card.title} card={card} />
                    ))}
                  </div>
                )}
              </section>
            ))}

            {page.outcome && (
              <section className="mt-14 border-t border-ink/10 pt-10 md:mt-20 md:pt-14">
                <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-ink/60 md:text-[12px]">Outcome</p>
                <h2 className="mt-2 font-display text-[34px] leading-tight md:text-[48px]">{page.outcome.title}</h2>
                <p className="mt-4 max-w-[65ch] text-[17px] leading-relaxed text-ink/75 md:text-[19px]">{page.outcome.text}</p>
              </section>
            )}

            {page.links && (
              <div className="mt-8 flex flex-wrap gap-3">
                {page.links.map((link) => (
                  <a
                    key={link.href}
                    href={link.href}
                    target="_blank"
                    rel="noreferrer"
                    className="rounded-full bg-ink px-5 py-2.5 font-mono text-[12px] uppercase tracking-[0.12em] text-paper transition-transform hover:-translate-y-0.5"
                  >
                    {link.label} ↗
                  </a>
                ))}
              </div>
            )}
          </div>
        </div>

        {(previous || next) && (
          <nav aria-label="More case studies" className="mt-16 grid gap-3 border-t border-ink/10 pt-8 sm:grid-cols-2 md:mt-24">
            {previous && <Neighbour project={previous} direction="previous" />}
            {next && <Neighbour project={next} direction="next" />}
          </nav>
        )}
      </article>
    </div>
  );
}

function Details({ project }: { project: Project & { page: CasePage } }) {
  const { page } = project;
  return (
    <div>
      <ul className="flex flex-wrap gap-2">
        {[KIND_LABEL[project.kind], ...page.tags].map((tag) => (
          <li key={tag} className="rounded-[8px] bg-ink/[0.06] px-3 py-1.5 font-mono text-[11px] uppercase tracking-[0.1em] text-ink/75">
            {tag}
          </li>
        ))}
      </ul>
      <dl className="mt-5 space-y-6 rounded-[18px] border border-ink/12 p-6">
        {page.facts.map((fact) => (
          <Fact key={fact.label} fact={fact} />
        ))}
      </dl>
    </div>
  );
}

function Fact({ fact }: { fact: CaseFact }) {
  const values = Array.isArray(fact.value) ? fact.value : [fact.value];
  return (
    <div>
      <dt className="font-mono text-[11px] font-bold uppercase tracking-[0.16em] text-ink/60">{fact.label}</dt>
      {values.map((value) => (
        <dd key={value} className="mt-2 flex items-center gap-2 text-[16px] text-ink/80">
          {fact.live && <span aria-hidden className="h-2 w-2 rounded-full bg-[#5f8a6a]" />}
          {value}
        </dd>
      ))}
    </div>
  );
}

function Hero({ src, bg, name }: { src?: string; bg?: string; name: string }) {
  return (
    <div className="relative aspect-[16/10] w-full overflow-hidden rounded-[16px] bg-[#ecebe6] md:rounded-[22px]">
      {src ? (
        <Image
          src={src}
          alt={`${name} cover`}
          fill
          sizes="(min-width: 768px) 800px, 100vw"
          className={bg ? "object-contain" : "object-cover"}
          style={bg ? { backgroundColor: bg } : undefined}
          priority
        />
      ) : (
        <span
          role="img"
          aria-label={`${name} screenshot coming soon`}
          className="absolute inset-0 flex items-center justify-center bg-[repeating-linear-gradient(45deg,#e6e4dc_0_10px,#efede6_10px_20px)] font-mono text-[11px] uppercase tracking-[0.16em] text-ink/45"
        >
          screenshot soon
        </span>
      )}
    </div>
  );
}

const CARD_STYLE = {
  learning: { label: "Learning", circle: "bg-[#c9dcf5]", path: "M9 18h6M10 21h4M12 3a6 6 0 0 0-3.5 10.9c.6.5 1 1.2 1 2V17h5v-1.1c0-.8.4-1.5 1-2A6 6 0 0 0 12 3z" },
  hiccup: { label: "Hiccup", circle: "bg-[#f1d3df]", path: "M3 7l6 6 4-4 8 8M21 11v6h-6" },
};

function Card({ card }: { card: CaseCard }) {
  const style = CARD_STYLE[card.kind];
  return (
    <div className="rounded-[20px] border border-ink/10 bg-[#f6f4ee] p-6 md:p-8">
      <span className={`flex h-12 w-12 items-center justify-center rounded-full ${style.circle}`}>
        <svg aria-hidden viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
          <path d={style.path} />
        </svg>
      </span>
      <p className="mt-5 font-mono text-[11px] uppercase tracking-[0.18em] text-ink/60">{style.label}</p>
      <h3 className="mt-1 font-display text-[28px] leading-tight">{card.title}</h3>
      <p className="mt-3 text-[16px] leading-relaxed text-ink/70">{card.text}</p>
    </div>
  );
}

function Neighbour({ project, direction }: { project: Project; direction: "previous" | "next" }) {
  return (
    <Link
      href={`/projects/${projectSlug(project.name)}`}
      className={`group rounded-[18px] border border-ink/10 p-5 transition-colors hover:bg-ink/[0.03] ${direction === "next" ? "sm:text-right" : ""}`}
    >
      <p className="font-mono text-[11px] uppercase tracking-[0.16em] text-ink/55">{direction === "next" ? "Next case study →" : "← Previous case study"}</p>
      <p className="mt-1 font-display text-[28px] leading-tight">{project.name}</p>
    </Link>
  );
}
