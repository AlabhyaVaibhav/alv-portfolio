import { test } from "node:test";
import assert from "node:assert/strict";
import { projectSlots, projectSlotsMobile, noteSlot, featuredFirst, MAX_PROJECTS } from "../lib/projectSlots.ts";

test("returns one slot per project up to the max", () => {
  for (let n = 0; n <= 9; n++) {
    assert.equal(projectSlots(n).length, Math.min(n, MAX_PROJECTS), `count ${n}`);
  }
});

test("first slot is large, the rest medium", () => {
  for (let n = 1; n <= MAX_PROJECTS; n++) {
    const slots = projectSlots(n);
    assert.equal(slots[0].size, "lg");
    assert.ok(slots.slice(1).every((s) => s.size === "md"));
  }
});

test("slots stay inside the stage (md cards are 20vw wide, lg 30vw)", () => {
  for (let n = 1; n <= MAX_PROJECTS; n++) {
    for (const s of projectSlots(n)) {
      const width = s.size === "lg" ? 30 : 20;
      assert.ok(s.x >= 0 && s.x + width <= 98, `x ${s.x} overflows for count ${n}`);
      assert.ok(s.y >= 8 && s.y <= 60, `y ${s.y} out of range for count ${n}`);
    }
  }
});

type Rect = { x: number; y: number; w: number; h: number };
const overlaps = (a: Rect, b: Rect) => a.x < b.x + b.w && b.x < a.x + a.w && a.y < b.y + b.h && b.y < a.y + a.h;

// Approximate footprints in % of the stage. Desktop measured at 1280x720; mobile at 390x760
// (42vw cards measured up to ~26vh tall with a long blurb; 38vw sticky notes are square).
const desktopCard = (s: { x: number; y: number; size: "lg" | "md" }): Rect =>
  s.size === "lg" ? { x: s.x, y: s.y, w: 30, h: 24 } : { x: s.x, y: s.y, w: 20, h: 22 };
const DESKTOP_NOTE = { w: 13.3, h: 23.6 };
const mobileCard = (s: { x: number; y: number; scale: number }): Rect => ({ x: s.x, y: s.y, w: 42 * s.scale, h: 27 * s.scale });
const mobileNote = (n: { x: number; y: number; scale: number }): Rect => ({ x: n.x, y: n.y, w: 38 * n.scale, h: 19.5 * n.scale });

test("mobile slots: one per project up to the max, never overlapping, all on screen", () => {
  for (let n = 0; n <= 8; n++) {
    const cards = projectSlotsMobile(n).map(mobileCard);
    assert.equal(cards.length, Math.min(n, MAX_PROJECTS), `count ${n}`);
    cards.forEach((c, i) => {
      assert.ok(c.x >= 0 && c.x + c.w <= 100 && c.y + c.h <= 100, `card ${i} off screen for count ${n}`);
      cards.slice(i + 1).forEach((d, j) => assert.ok(!overlaps(c, d), `cards ${i},${i + j + 1} overlap for count ${n}`));
    });
  }
});

test("the featured note never covers another project's card, on desktop or mobile", () => {
  for (let n = 1; n <= MAX_PROJECTS; n++) {
    const note = noteSlot(n);
    const d: Rect = { ...note.desktop, ...DESKTOP_NOTE };
    const m = mobileNote(note.mobile);
    assert.ok(d.x + d.w <= 100 && d.y + d.h <= 100, `desktop note off stage for count ${n}`);
    assert.ok(m.x + m.w <= 100 && m.y + m.h <= 100, `mobile note off screen for count ${n}`);
    projectSlots(n).slice(1).forEach((s, i) => assert.ok(!overlaps(d, desktopCard(s)), `desktop note covers card ${i + 1} for count ${n}`));
    projectSlotsMobile(n).slice(1).forEach((s, i) => assert.ok(!overlaps(m, mobileCard(s)), `mobile note covers card ${i + 1} for count ${n}`));
  }
});

test("featuredFirst moves featured items to the front and keeps order otherwise", () => {
  const items = [{ n: "a" }, { n: "b", featured: true }, { n: "c" }];
  assert.deepEqual(featuredFirst(items).map((i) => i.n), ["b", "a", "c"]);
  assert.deepEqual(items.map((i) => i.n), ["a", "b", "c"], "input not mutated");
});
