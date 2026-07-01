import { ScrollReveal } from "@/components/ui/ScrollReveal";
import { site } from "@/content/site";

export function About() {
  return (
    <section id="about" className="bg-paper px-6 py-32">
      <div className="mx-auto max-w-2xl">
        <ScrollReveal>
          <h2 className="font-serif text-3xl text-ink sm:text-4xl">About</h2>
        </ScrollReveal>
        <ScrollReveal delay={0.15}>
          <p className="mt-6 text-lg leading-relaxed text-ink/80">
            {site.about}
          </p>
        </ScrollReveal>
      </div>
    </section>
  );
}
