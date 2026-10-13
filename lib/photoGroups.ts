type Groupable<G> = { group: G; src?: string; pick?: boolean };

export type PhotoGroup<G, T> = { id: G; all: T[]; shown: T[] };

// Splits photos into piles in `order`. Picks lead each pile; the first `perGroup` go on the mat and
// the whole pile stays browsable in the lightbox.
export function groupPhotos<G, T extends Groupable<G>>(photos: T[], order: readonly G[], perGroup: number): PhotoGroup<G, T>[] {
  return order.map((id) => {
    const inGroup = photos.filter((p) => p.group === id && Boolean(p.src));
    const all = [...inGroup.filter((p) => p.pick), ...inGroup.filter((p) => !p.pick)];
    return { id, all, shown: all.slice(0, perGroup) };
  });
}

// Prints keep their photo's width:height, within these bounds, so a panorama doesn't swallow a row.
export const PRINT_RATIO = { min: 0.56, max: 1.8 };

export function printRatio(ratio: number): number {
  return Math.min(Math.max(ratio, PRINT_RATIO.min), PRINT_RATIO.max);
}

// The most combined width (in print heights) a row can hold: two prints per row on desktop, three on mobile.
export const MAX_ROW = { desktop: 2.7, mobile: 4.4 };
