import { test } from "node:test";
import assert from "node:assert/strict";
import { projectSlots, projectSlotMobile, featuredFirst, MAX_PROJECTS } from "../lib/projectSlots.ts";

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

test("mobile slots form a two-column grid", () => {
  assert.deepEqual(
    [0, 1, 2, 3].map((i) => [projectSlotMobile(i).x, projectSlotMobile(i).y]),
    [[4, 14], [50, 18], [4, 42], [50, 46]],
  );
});

test("featuredFirst moves featured items to the front and keeps order otherwise", () => {
  const items = [{ n: "a" }, { n: "b", featured: true }, { n: "c" }];
  assert.deepEqual(featuredFirst(items).map((i) => i.n), ["b", "a", "c"]);
  assert.deepEqual(items.map((i) => i.n), ["a", "b", "c"], "input not mutated");
});
