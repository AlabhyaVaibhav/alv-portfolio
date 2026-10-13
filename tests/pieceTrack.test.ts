import { test } from "node:test";
import assert from "node:assert/strict";
import { pieceTrack, EXIT_START } from "../lib/pieceTrack.ts";

const r = (ns: number[]) => ns.map((n) => Math.round(n * 1000) / 1000);
const increasing = (ns: number[]) => ns.every((n, i) => i === 0 || n > ns[i - 1]);

test("enters from the left, holds, exits left", () => {
  const t = pieceTrack({ from: "left", enterAt: 0.2, rotate: 4, enter: true, exit: true });
  assert.deepEqual(r(t.input), [0, 0.2, 0.35, 0.8, 1]);
  assert.deepEqual(t.x, [-110, -110, 0, 0, -120]);
  assert.deepEqual(t.y, [0, 0, 0, 0, 8]);
  assert.deepEqual(t.rotate, [-14, -14, 4, 4, -21]);
});

test("enters from the right with positive spin", () => {
  const t = pieceTrack({ from: "right", enterAt: 0.1, rotate: 0, enter: true, exit: true });
  assert.equal(t.x[0], 110);
  assert.equal(t.rotate[0], 18);
});

test("enters from top and bottom on the y axis", () => {
  assert.equal(pieceTrack({ from: "top", enterAt: 0.1, rotate: 0, enter: true, exit: false }).y[0], -110);
  assert.equal(pieceTrack({ from: "bottom", enterAt: 0.1, rotate: 0, enter: true, exit: false }).y[0], 110);
});

test("no enter and no exit stays at rest", () => {
  const t = pieceTrack({ from: "left", enterAt: 0.2, rotate: -3, enter: false, exit: false });
  assert.deepEqual(t.input, [0, 1]);
  assert.deepEqual(t.x, [0, 0]);
  assert.deepEqual(t.rotate, [-3, -3]);
});

test("first-chapter piece (no enter) still exits", () => {
  const t = pieceTrack({ from: "left", enterAt: 0.2, rotate: 0, enter: false, exit: true });
  assert.deepEqual(t.input, [0, EXIT_START, 1]);
  assert.deepEqual(t.x, [0, 0, -120]);
});

test("enterAt 0 does not duplicate the first keyframe", () => {
  const t = pieceTrack({ from: "bottom", enterAt: 0, rotate: 0, enter: true, exit: true });
  assert.ok(increasing(t.input));
  assert.equal(t.input[0], 0);
});

test("late or negative enterAt is clamped so the piece rests before exit", () => {
  for (const enterAt of [-1, 0.7, 0.95, 5]) {
    const t = pieceTrack({ from: "left", enterAt, rotate: 2, enter: true, exit: true });
    assert.ok(increasing(t.input), `input not increasing for ${enterAt}`);
    assert.equal(t.input[0], 0);
    assert.equal(t.input[t.input.length - 1], 1);
    const restIndex = t.x.indexOf(0);
    assert.ok(restIndex > 0 && t.input[restIndex] <= EXIT_START + 1e-9, `no rest before exit for ${enterAt}`);
  }
});
