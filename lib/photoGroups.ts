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
