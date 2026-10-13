import { test } from "node:test";
import assert from "node:assert/strict";
import { crossoutPath, squigglePath } from "../lib/pen.ts";

const points = (d: string) => [...d.matchAll(/-?\d+(?:\.\d+)?/g)].map((m) => Number(m[0]));

test("a squiggle runs the full width and stays inside its height", () => {
  const d = squigglePath(120, 8);
  const nums = points(d);
  const xs = nums.filter((_, i) => i % 2 === 0);
  const ys = nums.filter((_, i) => i % 2 === 1);
  assert.match(d, /^M0 /);
  assert.equal(Math.max(...xs), 120);
  assert.ok(ys.every((y) => y >= 0 && y <= 8), `ys ${ys}`);
});

test("wider squiggles get more waves", () => {
  const waves = (d: string) => (d.match(/Q/g) ?? []).length;
  assert.ok(waves(squigglePath(300, 8)) > waves(squigglePath(80, 8)));
});

test("a crossout is a single stroke across the text that drifts a little, the same every time", () => {
  const d = crossoutPath(100, 20, "walk bailey");
  assert.equal(d, crossoutPath(100, 20, "walk bailey"), "deterministic, so server and client agree");
  assert.notEqual(d, crossoutPath(100, 20, "ship twine"), "each item gets its own wobble");
  const nums = points(d);
  assert.ok(nums[0] <= 4 && nums[nums.length - 2] >= 96, "spans the text");
  assert.ok(nums.filter((_, i) => i % 2 === 1).every((y) => y > 4 && y < 16), "stays near the middle");
});
