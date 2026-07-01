"use client";

import { motion } from "framer-motion";
import { ScrollReveal } from "@/components/ui/ScrollReveal";
import { workHistory } from "@/content/work";

export function Work() {
  return (
    <section id="work" className="bg-paper px-6 py-32">
      <div className="mx-auto max-w-3xl">
        <ScrollReveal>
          <h2 className="font-serif text-3xl text-ink sm:text-4xl">Work</h2>
        </ScrollReveal>
        <div className="mt-16 space-y-20 border-l border-ink/15 pl-8">
          {workHistory.map((company) => (
            <div key={company.name}>
              <ScrollReveal>
                <h3 className="font-serif text-2xl text-ink">
                  {company.name}
                  <span className="ml-2 text-base font-normal text-ink/50">
                    {company.location}
                  </span>
                </h3>
              </ScrollReveal>
              <div className="mt-8 space-y-10">
                {company.positions.map((position) => (
                  <div key={position.title}>
                    <ScrollReveal delay={0.05}>
                      <div className="flex flex-wrap items-baseline justify-between gap-2">
                        <h4 className="text-lg font-medium text-ink">
                          {position.title}
                        </h4>
                        <span className="text-sm text-ink/50">
                          {position.dates}
                        </span>
                      </div>
                    </ScrollReveal>
                    <ul className="mt-3 space-y-2">
                      {position.bullets.map((bullet, index) => (
                        <motion.li
                          key={bullet}
                          className="text-ink/75"
                          initial={{ opacity: 0, y: 32 }}
                          whileInView={{ opacity: 1, y: 0 }}
                          viewport={{ once: true, amount: 0.3 }}
                          transition={{
                            duration: 0.6,
                            delay: 0.08 * (index + 1),
                            ease: "easeOut",
                          }}
                        >
                          {bullet}
                        </motion.li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
