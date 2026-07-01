"use client";

import { useState } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { photography, aspectClass } from "@/content/photography";
import { Lightbox } from "@/components/photography/Lightbox";

export function Photography() {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  return (
    <section id="photography" className="bg-paper px-6 py-32">
      <div className="mx-auto max-w-5xl">
        <h2 className="font-serif text-3xl text-ink sm:text-4xl">
          Photography
        </h2>
        <div className="mt-12 columns-1 gap-4 sm:columns-2 lg:columns-3">
          {photography.map((slot, index) => (
            <motion.button
              key={slot.id}
              type="button"
              onClick={() => setActiveIndex(index)}
              className={`mb-4 block w-full overflow-hidden rounded-sm bg-ink/5 ${aspectClass[slot.aspect]}`}
              initial={{ opacity: 0, scale: 0.96 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.5, delay: (index % 3) * 0.08 }}
              whileHover={{ scale: 1.02 }}
            >
              {slot.src ? (
                <Image
                  src={slot.src}
                  alt={slot.alt}
                  width={800}
                  height={1000}
                  className="h-full w-full object-cover"
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center text-xs uppercase tracking-widest text-ink/30">
                  {slot.alt}
                </div>
              )}
            </motion.button>
          ))}
        </div>
      </div>
      <Lightbox
        slots={photography}
        activeIndex={activeIndex}
        onClose={() => setActiveIndex(null)}
        onNavigate={setActiveIndex}
      />
    </section>
  );
}
