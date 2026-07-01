import { ScrollReveal } from "@/components/ui/ScrollReveal";
import { site } from "@/content/site";

export function Twine() {
  return (
    <section id="twine" className="bg-ink px-6 py-32 text-paper">
      <div className="mx-auto max-w-2xl text-center">
        <ScrollReveal>
          <span className="text-sm uppercase tracking-widest text-paper/50">
            {site.twine.status}
          </span>
        </ScrollReveal>
        <ScrollReveal delay={0.1}>
          <h2 className="mt-4 font-serif text-3xl sm:text-4xl">
            {site.twine.tagline}
          </h2>
        </ScrollReveal>
        <ScrollReveal delay={0.2}>
          <p className="mt-6 text-lg leading-relaxed text-paper/80">
            {site.twine.body}
          </p>
        </ScrollReveal>
      </div>
    </section>
  );
}
