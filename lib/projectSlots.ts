export type Slot = { x: number; y: number; rotate: number; size: "lg" | "md" };

export const MAX_PROJECTS = 6;

// Desktop positions (percent of stage) per project count. Slot 0 holds the featured project.
const LAYOUTS: Record<number, Slot[]> = {
  1: [{ x: 34, y: 22, rotate: -2, size: "lg" }],
  2: [
    { x: 12, y: 20, rotate: -3, size: "lg" },
    { x: 56, y: 30, rotate: 4, size: "md" },
  ],
  3: [
    { x: 10, y: 18, rotate: -3, size: "lg" },
    { x: 52, y: 14, rotate: 4, size: "md" },
    { x: 58, y: 54, rotate: -2, size: "md" },
  ],
  4: [
    { x: 8, y: 18, rotate: -3, size: "lg" },
    { x: 44, y: 12, rotate: 3, size: "md" },
    { x: 70, y: 30, rotate: -4, size: "md" },
    { x: 46, y: 56, rotate: 2, size: "md" },
  ],
  5: [
    { x: 6, y: 18, rotate: -3, size: "lg" },
    { x: 40, y: 10, rotate: 3, size: "md" },
    { x: 68, y: 16, rotate: -4, size: "md" },
    { x: 40, y: 54, rotate: 2, size: "md" },
    { x: 70, y: 58, rotate: -3, size: "md" },
  ],
  6: [
    { x: 4, y: 16, rotate: -3, size: "lg" },
    { x: 36, y: 8, rotate: 3, size: "md" },
    { x: 64, y: 10, rotate: -4, size: "md" },
    { x: 34, y: 52, rotate: 2, size: "md" },
    { x: 56, y: 56, rotate: -3, size: "md" },
    { x: 76, y: 50, rotate: 5, size: "md" },
  ],
};

export function projectSlots(count: number): Slot[] {
  const n = Math.min(Math.max(Math.floor(count), 0), MAX_PROJECTS);
  return n === 0 ? [] : LAYOUTS[n];
}

export type MobileSlot = { x: number; y: number; rotate: number; scale: number };

// Mobile positions per project count: a two-column grid, shrunk for 5–6 so every row fits.
const m = (x: number, y: number, scale = 1): MobileSlot => ({ x, y, rotate: x < 50 ? -3 : 3, scale });
const MOBILE_LAYOUTS: Record<number, MobileSlot[]> = {
  1: [m(20, 16)],
  2: [m(4, 14), m(50, 18)],
  3: [m(4, 14), m(50, 18), m(4, 46)],
  4: [m(4, 14), m(50, 18), m(4, 46), m(50, 50)],
  5: [m(4, 12, 0.8), m(52, 14, 0.8), m(4, 38, 0.8), m(52, 40, 0.8), m(4, 64, 0.8)],
  6: [m(4, 12, 0.8), m(52, 14, 0.8), m(4, 38, 0.8), m(52, 40, 0.8), m(4, 64, 0.8), m(52, 66, 0.8)],
};

export function projectSlotsMobile(count: number): MobileSlot[] {
  const n = Math.min(Math.max(Math.floor(count), 0), MAX_PROJECTS);
  return n === 0 ? [] : MOBILE_LAYOUTS[n];
}

// Where the featured project's sticky note goes for each count: overlapping only the featured
// card, never a neighbour.
const NOTE_SLOTS: Record<number, { desktop: { x: number; y: number }; mobile: { x: number; y: number; scale: number } }> = {
  1: { desktop: { x: 56, y: 40 }, mobile: { x: 52, y: 48, scale: 0.75 } },
  2: { desktop: { x: 34, y: 40 }, mobile: { x: 30, y: 50, scale: 0.75 } },
  3: { desktop: { x: 32, y: 38 }, mobile: { x: 52, y: 50, scale: 0.75 } },
  4: { desktop: { x: 30, y: 38 }, mobile: { x: 28, y: 80, scale: 0.6 } },
  5: { desktop: { x: 22, y: 44 }, mobile: { x: 52, y: 68, scale: 0.6 } },
  6: { desktop: { x: 16, y: 42 }, mobile: { x: 30, y: 89, scale: 0.55 } },
};

export function noteSlot(count: number) {
  const n = Math.min(Math.max(Math.floor(count), 1), MAX_PROJECTS);
  return NOTE_SLOTS[n];
}

export function featuredFirst<T extends { featured?: boolean }>(items: T[]): T[] {
  return [...items.filter((i) => i.featured), ...items.filter((i) => !i.featured)];
}
