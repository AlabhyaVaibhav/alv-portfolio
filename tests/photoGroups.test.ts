import { test } from "node:test";
import assert from "node:assert/strict";
import { groupPhotos, printRatio, PRINT_RATIO, MAX_ROW } from "../lib/photoGroups.ts";
import { photography, PHOTO_GROUPS } from "../content/photography.ts";

const photos = [
  { id: "1", group: "a", src: "x" },
  { id: "2", group: "b", src: "x", pick: true },
  { id: "3", group: "a", src: "x", pick: true },
  { id: "4", group: "a" },
  { id: "5", group: "a", src: "x" },
  { id: "6", group: "b", src: "x" },
];

test("splits photos into groups in the given order, keeping only ones with a src", () => {
  const groups = groupPhotos(photos, ["b", "a"], 4);
  assert.deepEqual(groups.map((g) => g.id), ["b", "a"]);
  assert.deepEqual(groups[1].all.map((p) => p.id), ["3", "1", "5"]);
});

test("picks come first, and only perGroup photos are shown on the mat", () => {
  const [a] = groupPhotos(photos, ["a"], 2);
  assert.deepEqual(a.shown.map((p) => p.id), ["3", "1"]);
  assert.equal(a.all.length, 3, "the rest stay browsable");
});

test("a group with no photos comes back empty rather than missing", () => {
  const [c] = groupPhotos(photos, ["c"], 4);
  assert.deepEqual(c, { id: "c", all: [], shown: [] });
});

test("every real photo lands in exactly one group, and each group fills its 2x2", () => {
  const groups = groupPhotos(photography, PHOTO_GROUPS.map((g) => g.id), 4);
  assert.equal(groups.reduce((n, g) => n + g.all.length, 0), photography.length);
  for (const g of groups) assert.equal(g.shown.length, 4, `${g.id} shows ${g.shown.length}`);
});

test("printRatio keeps a photo's own shape but reins in panoramas and very tall shots", () => {
  assert.equal(printRatio(1.25), 1.25);
  assert.equal(printRatio(2.95), PRINT_RATIO.max);
  assert.equal(printRatio(0.4), PRINT_RATIO.min);
});

test("real picks fit their rows: two per desktop row, three in the mobile row", () => {
  const groups = groupPhotos(photography, PHOTO_GROUPS.map((g) => g.id), 4);
  const width = (slots: typeof photography) => slots.reduce((n, s) => n + printRatio(s.ratio), 0);
  for (const g of groups) {
    assert.ok(width(g.shown.slice(0, 2)) <= MAX_ROW.desktop, `${g.id} desktop row 1`);
    assert.ok(width(g.shown.slice(2, 4)) <= MAX_ROW.desktop, `${g.id} desktop row 2`);
    assert.ok(width(g.shown.slice(0, 3)) <= MAX_ROW.mobile, `${g.id} mobile row`);
  }
});
