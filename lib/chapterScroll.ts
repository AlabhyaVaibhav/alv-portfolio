// Chapter progress follows Framer Motion's useScroll offset ["start end", "end end"]:
//   p = (scrollY + vh - top) / height
// so consecutive chapters' progress ranges are contiguous.

export const HOLD_PROGRESS = 0.6;

export function holdScrollY(top: number, height: number, vh: number, p: number = HOLD_PROGRESS): number {
  return Math.max(0, top - vh + p * height);
}

export function activeChapterIndex(
  chapters: { top: number; height: number }[],
  scrollY: number,
  vh: number,
): number {
  let active = 0;
  chapters.forEach((c, i) => {
    if ((scrollY + vh - c.top) / c.height > 0) active = i;
  });
  return active;
}
