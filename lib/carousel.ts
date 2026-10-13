type ScrollBox = { scrollLeft: number; scrollWidth: number; clientWidth: number };

// Whether a horizontal scroller can go back or forward. Allows a pixel of slack for sub-pixel scroll positions.
export function carouselEdges({ scrollLeft, scrollWidth, clientWidth }: ScrollBox) {
  return { atStart: scrollLeft <= 1, atEnd: scrollLeft + clientWidth >= scrollWidth - 1 };
}
