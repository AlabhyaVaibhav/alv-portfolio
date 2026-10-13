import { test } from "node:test";
import assert from "node:assert/strict";
import { activeChapterIndex, holdScrollY, HOLD_PROGRESS } from "../lib/chapterScroll.ts";

// progress p = (scrollY + vh - top) / height, matching useScroll offset ["start end", "end end"]
const vh = 800;
const H = 2000; // 250vh
const chapters = [0, 1, 2].map((i) => ({ top: i * H, height: H }));

test("holdScrollY lands at the hold progress", () => {
  const y = holdScrollY(H, H, vh);
  assert.equal((y + vh - H) / H, HOLD_PROGRESS);
});

test("holdScrollY never returns a negative scroll", () => {
  assert.equal(holdScrollY(0, H, vh, 0), 0);
});

test("first chapter is active at the top of the page", () => {
  assert.equal(activeChapterIndex(chapters, 0, vh), 0);
});

test("next chapter becomes active once its progress starts", () => {
  assert.equal(activeChapterIndex(chapters, H - vh, vh), 0);
  assert.equal(activeChapterIndex(chapters, H - vh + 1, vh), 1);
  assert.equal(activeChapterIndex(chapters, 2 * H, vh), 2);
});

test("empty list returns 0", () => {
  assert.equal(activeChapterIndex([], 500, vh), 0);
});
