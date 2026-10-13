"use client";

import Image from "next/image";
import { useEffect, useSyncExternalStore } from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, motion } from "framer-motion";
import { aspectClass, type PhotoSlot } from "@/content/photography";

const subscribeNever = () => () => {};

type LightboxProps = {
  slots: PhotoSlot[];
  activeIndex: number | null;
  onClose: () => void;
  onNavigate: (index: number) => void;
};

export function Lightbox({ slots, activeIndex, onClose, onNavigate }: LightboxProps) {
  const slot = activeIndex !== null ? slots[activeIndex] : null;

  useEffect(() => {
    if (!slot) return;
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [slot, onClose]);

  const isClient = useSyncExternalStore(subscribeNever, () => true, () => false);
  if (!isClient) return null;

  // Portaled to <body>: chapter stages are fixed, pointer-events-none stacking contexts.
  return createPortal(
    <AnimatePresence>
      {slot && activeIndex !== null && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center bg-ink/90 p-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        >
          <motion.div
            className="relative max-h-[80vh] w-full max-w-2xl"
            initial={{ scale: 0.96, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.96, opacity: 0 }}
            transition={{ duration: 0.25 }}
            onClick={(event) => event.stopPropagation()}
          >
            {slot.src ? (
              <Image
                src={slot.src}
                alt={slot.alt}
                width={1200}
                height={1500}
                className={`w-full rounded-sm object-contain ${aspectClass[slot.aspect]}`}
              />
            ) : (
              <div
                className={`flex w-full items-center justify-center rounded-sm bg-paper/10 text-paper/60 ${aspectClass[slot.aspect]}`}
              >
                {slot.alt}
              </div>
            )}
            <button
              type="button"
              onClick={onClose}
              className="absolute -top-10 right-0 font-mono text-sm uppercase tracking-widest text-paper/80"
            >
              Close
            </button>
            <div className="absolute -bottom-10 flex w-full justify-between font-mono text-sm uppercase tracking-widest text-paper/80">
              <button
                type="button"
                onClick={() =>
                  onNavigate((activeIndex - 1 + slots.length) % slots.length)
                }
              >
                Prev
              </button>
              <button
                type="button"
                onClick={() => onNavigate((activeIndex + 1) % slots.length)}
              >
                Next
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body,
  );
}
