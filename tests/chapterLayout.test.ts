import { test } from "node:test";
import assert from "node:assert/strict";
import { SECTION_CLASS, STAGE_CLASS, stageInteractive } from "../lib/chapterLayout.ts";

// The static HTML is rendered without knowing the visitor's motion preference, so the
// reduced-motion layout must come from CSS (motion-reduce:) rather than a JS-chosen class.
// 160vh per chapter: enough scroll for pieces to land and be read, without six chapters
// adding up to a long slog (250vh each made the page ~15 screens).
test("section is a 160vh scroll spacer, dropped under reduced motion via CSS", () => {
  assert.match(SECTION_CLASS, /(^| )h-\[160vh\]( |$)/);
  assert.match(SECTION_CLASS, /motion-reduce:h-auto/);
  assert.match(SECTION_CLASS, /motion-reduce:min-h-/);
});

test("stage is fixed normally and in normal flow under reduced motion via CSS", () => {
  assert.match(STAGE_CLASS, /(^| )fixed( |$)/);
  assert.match(STAGE_CLASS, /motion-reduce:relative/);
  assert.match(STAGE_CLASS, /motion-reduce:min-h-/);
});

test("a stage is interactive only while its spread is on the mat", () => {
  assert.equal(stageInteractive(0, false, false), false, "before entry");
  assert.equal(stageInteractive(0.1, false, false), false, "still sliding on");
  assert.equal(stageInteractive(0.6, false, false), true, "holding");
  assert.equal(stageInteractive(0.9, false, false), false, "being swept off");
  assert.equal(stageInteractive(1, false, false), false, "gone");
});

test("first chapter is interactive from the top; last chapter stays interactive at the end", () => {
  assert.equal(stageInteractive(0.4, true, false), true);
  assert.equal(stageInteractive(0.9, true, false), false);
  assert.equal(stageInteractive(1, false, true), true);
  assert.equal(stageInteractive(0.1, false, true), false);
});
