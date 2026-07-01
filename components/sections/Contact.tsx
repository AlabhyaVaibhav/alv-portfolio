import { ScrollReveal } from "@/components/ui/ScrollReveal";
import { site } from "@/content/site";

export function Contact() {
  return (
    <section id="contact" className="bg-paper px-6 py-32">
      <div className="mx-auto max-w-2xl text-center">
        <ScrollReveal>
          <h2 className="font-serif text-3xl text-ink sm:text-4xl">
            Get in touch
          </h2>
        </ScrollReveal>
        <ScrollReveal delay={0.1}>
          <p className="mt-4 text-ink/70">{site.closingNote}</p>
        </ScrollReveal>
        <ScrollReveal delay={0.2}>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-6 text-ink">
            <a
              href={`mailto:${site.email}`}
              className="underline underline-offset-4 hover:text-accent"
            >
              {site.email}
            </a>
            <a
              href={site.linkedinUrl}
              target="_blank"
              rel="noreferrer"
              className="underline underline-offset-4 hover:text-accent"
            >
              LinkedIn
            </a>
            <a
              href={site.resumeHref}
              download
              className="underline underline-offset-4 hover:text-accent"
            >
              Download résumé
            </a>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}
