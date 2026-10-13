import { test } from "node:test";
import assert from "node:assert/strict";
import { withSrc } from "../lib/collections.ts";

test("keeps only items with a src, up to the limit, in order", () => {
  const items = [{ id: 1 }, { id: 2, src: "a" }, { id: 3, src: "" }, { id: 4, src: "b" }, { id: 5, src: "c" }];
  assert.deepEqual(withSrc(items, 2).map((i) => i.id), [2, 4]);
});

test("returns fewer when not enough have a src", () => {
  assert.deepEqual(withSrc([{ id: 1 }], 8), []);
});
