import { test } from "node:test";
import assert from "node:assert/strict";
import { featuredFirst } from "../lib/projectOrder.ts";

test("featuredFirst moves featured items to the front and keeps order otherwise", () => {
  const items = [{ n: "a" }, { n: "b", featured: true }, { n: "c" }];
  assert.deepEqual(featuredFirst(items).map((i) => i.n), ["b", "a", "c"]);
  assert.deepEqual(items.map((i) => i.n), ["a", "b", "c"], "input not mutated");
});
