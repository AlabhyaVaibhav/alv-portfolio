import { test } from "node:test";
import assert from "node:assert/strict";
import { carouselEdges } from "../lib/carousel.ts";

test("at rest on the left, only forward is possible", () => {
  assert.deepEqual(carouselEdges({ scrollLeft: 0, scrollWidth: 1500, clientWidth: 1000 }), { atStart: true, atEnd: false });
});

test("scrolled to the far right, only back is possible", () => {
  assert.deepEqual(carouselEdges({ scrollLeft: 500, scrollWidth: 1500, clientWidth: 1000 }), { atStart: false, atEnd: true });
});

test("sub-pixel scroll positions still count as the ends", () => {
  assert.deepEqual(carouselEdges({ scrollLeft: 0.6, scrollWidth: 1500, clientWidth: 1000 }).atStart, true);
  assert.deepEqual(carouselEdges({ scrollLeft: 499.4, scrollWidth: 1500, clientWidth: 1000 }).atEnd, true);
});

test("cards that all fit leave nowhere to go", () => {
  assert.deepEqual(carouselEdges({ scrollLeft: 0, scrollWidth: 900, clientWidth: 1000 }), { atStart: true, atEnd: true });
});
