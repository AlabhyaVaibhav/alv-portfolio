import { test } from "node:test";
import assert from "node:assert/strict";
import { groupPhotos } from "../lib/photoGroups.ts";
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
