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

export function projectSlotMobile(index: number): { x: number; y: number; rotate: number } {
  const right = index % 2 === 1;
  const row = Math.floor(index / 2);
  return { x: right ? 50 : 4, y: 14 + row * 28 + (right ? 4 : 0), rotate: right ? 3 : -3 };
}

export function featuredFirst<T extends { featured?: boolean }>(items: T[]): T[] {
  return [...items.filter((i) => i.featured), ...items.filter((i) => !i.featured)];
}
