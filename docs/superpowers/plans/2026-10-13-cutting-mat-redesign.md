# Cutting-Mat Portfolio Redesign Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Rebuild the portfolio as a fixed green cutting mat on which six interleaved build/life chapters of paper objects slide on, hold, and get swept off as the visitor scrolls.

**Architecture:** Next.js static export (existing). A fixed `<Mat>` background; each `<Chapter>` is a 250vh scroll spacer whose stage is `position: fixed`, exposing scroll progress (Framer Motion `useScroll`, offset `["start end", "end end"]`) through context. `<Piece>` maps that progress to translate/rotate keyframes computed by a pure function (`lib/pieceTrack.ts`). Chapters compose presentational paper primitives inside `Piece`s and read copy from `content/*`.

**Tech Stack:** Next.js 16 (App Router, `output: "export"`), React 19, TypeScript, Tailwind CSS v4, Framer Motion 12, `next/font/google`. Unit tests: Node 26's built-in test runner with native TypeScript stripping (`node --test`), no new dependencies.

**Spec:** `docs/superpowers/specs/2026-10-13-cutting-mat-redesign-design.md`

## Global Constraints

- No new runtime or dev dependencies. Animation is Framer Motion only.
- Mat fill `#1f5a4b`; major grid 100px at `rgba(240,236,220,.5)`; minor grid 20px at `rgba(240,236,220,.16)`; cream ink `#f3efe2`.
- White paper `#fbfaf6`; kraft `#c9a477` with ink `#2b1f14`; sticky yellow `#f6d77a`, pink `#f2b8a2`; object shadow `drop-shadow(0 10px 12px rgba(0,0,0,.35))`.
- Fonts: Instrument Serif (italic display), JetBrains Mono (body/labels), Caveat (marker notes), all via `next/font/google`.
- Only the display headline and marker notes sit directly on the grid; all other copy sits on paper (white torn strip with green pins for reading copy; kraft card with washi tape for work/project items).
- `~/Documents/assets/dot-portrait/source-photo.png` is private: never copy, reference, or publish it.
- Chapter section height `250vh`; piece enter span `0.15` of progress; exit starts at `0.8`; first chapter never enters, last chapter never exits.
- Mobile breakpoint: `max-width: 767px`.
- `prefers-reduced-motion: reduce` → no pinning, no scroll-scrubbing, every piece at rest.
- Copy is provisional; placeholders are marked `// TODO(copy)` in `content/*`.
- Commits go to local `main` only. **Never push** (pushing to `main` deploys to GitHub Pages).
- Every commit message ends with a blank line and `Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>` (omitted from the commit commands below for brevity).
- `lib/*.ts` files must be importable by `node --test`: no `@/` imports, no enums/namespaces/parameter properties, `import type` for types.

## Review Focus

1. **Resizing across 768px** — placements must switch between desktop and mobile coordinates without a reload; a piece must never be stuck at the old breakpoint's rotation. (Task 5 Step 7 checks this.)
2. **Reduced motion on a phone** — still-mode chapters must not overlap each other; every piece readable. (Task 9 Step 4.)
3. **Lightbox while pinned** — opening the lightbox from chapter 02 must cover everything (nav tab, grain) and stay clickable even though stages are `pointer-events: none`. (Task 6 Step 6.)
4. **Chapter nav jumps** — selecting a chapter lands with its pieces at rest, not mid-slide; in reduced motion it lands at the section top. (`holdScrollY` tests in Task 1; manual check in Task 8.)
5. **Project count outside 2–6** — 0, 1, 7+ projects must render without crashing or overflowing; 7+ shows 6. (`projectSlots` tests in Task 1.)

---

## File structure

```
app/
  globals.css                 REWRITE  theme tokens, mat, paper utilities, grain
  layout.tsx                  REWRITE  fonts, <Mat/>, body classes
  page.tsx                    REWRITE  chapter assembly + <ChapterNav/>
lib/
  pieceTrack.ts               NEW      pure: progress → x/y/rotate keyframes
  projectSlots.ts             NEW      pure: project layout slots + featured ordering
  chapterScroll.ts            NEW      pure: active chapter + jump target
  collections.ts              NEW      pure: withSrc()
tests/
  pieceTrack.test.ts, projectSlots.test.ts, chapterScroll.test.ts, collections.test.ts
content/
  chapters.ts                 NEW      chapter metadata (id, number, title, side)
  projects.ts                 NEW
  bailey.ts                   NEW
  site.ts                     MODIFY   coverLine, baileyNote; drop about/twine/tagline
  work.ts                     MODIFY   years, isInternship, highlights
  photography.ts              MODIFY   54 real photo slots
components/
  mat/Mat.tsx                 NEW      fixed background
  mat/chapterContext.ts       NEW      chapter progress context + useChapter()
  mat/Chapter.tsx             NEW      scroll spacer + fixed stage
  mat/Piece.tsx               NEW      animated placement
  mat/useIsMobile.ts          NEW
  mat/ChapterLabel.tsx        NEW
  mat/ChapterNav.tsx          NEW
  paper/{Tape,TornStrip,KraftCard,Polaroid,StickyNote,Ticket,MarkerNote,Sticker}.tsx  NEW
  chapters/{Cover,DayJob,Camera,SideProjects,Bailey,SayHi}.tsx                      NEW
  photography/Lightbox.tsx    MODIFY   portal to body
  sections/*, ui/ScrollReveal.tsx  DELETE
public/
  photography/01.jpg … 54.jpg COMMIT   (currently untracked)
  sticker/alabhya-bailey.png  NEW      copy of charcoal-512 dot portrait
```

The repo-root `photography/` folder (raw originals, untracked) is not touched by this plan.

---

### Task 1: Pure motion/layout logic with tests

**Files:**
- Modify: `package.json` (add `test` script), `tsconfig.json` (allow `.ts` import extensions)
- Create: `lib/pieceTrack.ts`, `lib/projectSlots.ts`, `lib/chapterScroll.ts`, `lib/collections.ts`
- Test: `tests/pieceTrack.test.ts`, `tests/projectSlots.test.ts`, `tests/chapterScroll.test.ts`, `tests/collections.test.ts`

**Interfaces:**
- Produces:
  - `type Edge = "left" | "right" | "top" | "bottom"`
  - `pieceTrack(i: { from: Edge; enterAt: number; rotate: number; enter: boolean; exit: boolean }): { input: number[]; x: number[]; y: number[]; rotate: number[] }` — `x` in vw, `y` in vh, `rotate` in deg; `input` strictly increasing from 0 to 1. Constants `ENTER_SPAN = 0.15`, `EXIT_START = 0.8`.
  - `type Slot = { x: number; y: number; rotate: number; size: "lg" | "md" }`; `projectSlots(count: number): Slot[]`; `projectSlotMobile(index: number): { x: number; y: number; rotate: number }`; `featuredFirst<T extends { featured?: boolean }>(items: T[]): T[]`; `MAX_PROJECTS = 6`.
  - `HOLD_PROGRESS = 0.6`; `holdScrollY(top: number, height: number, vh: number, p?: number): number`; `activeChapterIndex(chapters: { top: number; height: number }[], scrollY: number, vh: number): number`.
  - `withSrc<T extends { src?: string }>(items: T[], limit: number): T[]`.

- [ ] **Step 1: Enable the test runner**

In `package.json` `scripts`, add after `"lint": "eslint"`:

```json
    "lint": "eslint",
    "test": "node --test 'tests/*.test.ts'"
```

In `tsconfig.json` `compilerOptions`, add after `"noEmit": true,`:

```json
    "allowImportingTsExtensions": true,
```

- [ ] **Step 2: Write the failing tests**

`tests/pieceTrack.test.ts`:

```ts
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
```

`tests/projectSlots.test.ts`:

```ts
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
```

`tests/chapterScroll.test.ts`:

```ts
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
```

`tests/collections.test.ts`:

```ts
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
```

- [ ] **Step 3: Run tests to verify they fail**

Run: `npm test`
Expected: FAIL — `Cannot find module '…/lib/pieceTrack.ts'` (and the same for the other three).

- [ ] **Step 4: Implement `lib/pieceTrack.ts`**

```ts
export type Edge = "left" | "right" | "top" | "bottom";

export type PieceTrackInput = {
  from: Edge;
  enterAt: number;
  rotate: number;
  enter: boolean;
  exit: boolean;
};

export type PieceTrack = {
  input: number[];
  x: number[];
  y: number[];
  rotate: number[];
};

export const ENTER_SPAN = 0.15;
export const EXIT_START = 0.8;

const OFF_STAGE = 110;
const ENTRY_OFFSET: Record<Edge, { x: number; y: number }> = {
  left: { x: -OFF_STAGE, y: 0 },
  right: { x: OFF_STAGE, y: 0 },
  top: { x: 0, y: -OFF_STAGE },
  bottom: { x: 0, y: OFF_STAGE },
};

// Keyframes for one piece across its chapter's scroll progress (0→1):
// slide on from `from`, hold at rest, then get swept off to the left.
export function pieceTrack({ from, enterAt, rotate, enter, exit }: PieceTrackInput): PieceTrack {
  const track: PieceTrack = { input: [], x: [], y: [], rotate: [] };
  const push = (t: number, x: number, y: number, r: number) => {
    const last = track.input[track.input.length - 1];
    if (last !== undefined && t <= last) return;
    track.input.push(t);
    track.x.push(x);
    track.y.push(y);
    track.rotate.push(r);
  };

  if (enter) {
    const start = Math.min(Math.max(enterAt, 0), EXIT_START - ENTER_SPAN);
    const off = ENTRY_OFFSET[from];
    const spin = from === "left" || from === "top" ? -18 : 18;
    push(0, off.x, off.y, rotate + spin);
    push(start, off.x, off.y, rotate + spin);
    push(start + ENTER_SPAN, 0, 0, rotate);
  } else {
    push(0, 0, 0, rotate);
  }

  if (exit) {
    push(EXIT_START, 0, 0, rotate);
    push(1, -120, 8, rotate - 25);
  } else {
    push(1, 0, 0, rotate);
  }
  return track;
}
```

- [ ] **Step 5: Implement `lib/projectSlots.ts`**

```ts
export type Slot = { x: number; y: number; rotate: number; size: "lg" | "md" };

export const MAX_PROJECTS = 6;

// Desktop positions (percent of stage) per project count. Slot 0 holds the featured project.
const LAYOUTS: Record<number, Slot[]> = {
  1: [{ x: 34, y: 22, rotate: -2, size: "lg" }],
  2: [
    { x: 12, y: 20, rotate: -3, size: "lg" },
    { x: 56, y: 30, rotate: 4, size: "md" },
  ],
  3: [
    { x: 10, y: 18, rotate: -3, size: "lg" },
    { x: 52, y: 14, rotate: 4, size: "md" },
    { x: 58, y: 54, rotate: -2, size: "md" },
  ],
  4: [
    { x: 8, y: 18, rotate: -3, size: "lg" },
    { x: 44, y: 12, rotate: 3, size: "md" },
    { x: 70, y: 30, rotate: -4, size: "md" },
    { x: 46, y: 56, rotate: 2, size: "md" },
  ],
  5: [
    { x: 6, y: 18, rotate: -3, size: "lg" },
    { x: 40, y: 10, rotate: 3, size: "md" },
    { x: 68, y: 16, rotate: -4, size: "md" },
    { x: 40, y: 54, rotate: 2, size: "md" },
    { x: 70, y: 58, rotate: -3, size: "md" },
  ],
  6: [
    { x: 4, y: 16, rotate: -3, size: "lg" },
    { x: 36, y: 8, rotate: 3, size: "md" },
    { x: 64, y: 10, rotate: -4, size: "md" },
    { x: 34, y: 52, rotate: 2, size: "md" },
    { x: 56, y: 56, rotate: -3, size: "md" },
    { x: 76, y: 50, rotate: 5, size: "md" },
  ],
};

export function projectSlots(count: number): Slot[] {
  const n = Math.min(Math.max(Math.floor(count), 0), MAX_PROJECTS);
  return n === 0 ? [] : LAYOUTS[n];
}

export function projectSlotMobile(index: number): { x: number; y: number; rotate: number } {
  const right = index % 2 === 1;
  const row = Math.floor(index / 2);
  return { x: right ? 50 : 4, y: 14 + row * 28 + (right ? 4 : 0), rotate: right ? 3 : -3 };
}

export function featuredFirst<T extends { featured?: boolean }>(items: T[]): T[] {
  return [...items.filter((i) => i.featured), ...items.filter((i) => !i.featured)];
}
```

- [ ] **Step 6: Implement `lib/chapterScroll.ts`**

```ts
// Chapter progress follows Framer Motion's useScroll offset ["start end", "end end"]:
//   p = (scrollY + vh - top) / height
// so consecutive chapters' progress ranges are contiguous.

export const HOLD_PROGRESS = 0.6;

export function holdScrollY(top: number, height: number, vh: number, p: number = HOLD_PROGRESS): number {
  return Math.max(0, top - vh + p * height);
}

export function activeChapterIndex(
  chapters: { top: number; height: number }[],
  scrollY: number,
  vh: number,
): number {
  let active = 0;
  chapters.forEach((c, i) => {
    if ((scrollY + vh - c.top) / c.height > 0) active = i;
  });
  return active;
}
```

- [ ] **Step 7: Implement `lib/collections.ts`**

```ts
export function withSrc<T extends { src?: string }>(items: T[], limit: number): T[] {
  return items.filter((i) => Boolean(i.src)).slice(0, limit);
}
```

- [ ] **Step 8: Run tests to verify they pass**

Run: `npm test`
Expected: all tests pass, `fail 0`.

- [ ] **Step 9: Commit**

```bash
git add package.json tsconfig.json lib tests
git commit -m "Add pure piece-track, project-slot, and chapter-scroll logic with tests"
```

---

### Task 2: Theme, fonts, the Mat, and removal of the old sections

**Files:**
- Rewrite: `app/globals.css`, `app/layout.tsx`, `app/page.tsx`
- Create: `components/mat/Mat.tsx`
- Modify: `components/photography/Lightbox.tsx` (portal to `document.body`)
- Delete: `components/sections/` (all six files), `components/ui/ScrollReveal.tsx`

**Interfaces:**
- Produces: Tailwind tokens `mat`, `cream`, `paper`, `ink`, `kraft`, `kraft-ink`, `sticky-yellow`, `sticky-pink`; font utilities `font-display`, `font-mono`, `font-hand`; CSS classes `.mat`, `.drop-object`, `.paper-torn`, `.paper-kraft`, `.bg-grain`. `export function Mat(): JSX.Element`. `Lightbox` keeps its props (`slots`, `activeIndex`, `onClose`, `onNavigate`).

- [ ] **Step 1: Rewrite `app/globals.css`**

```css
@import "tailwindcss";

@theme inline {
  --color-mat: #1f5a4b;
  --color-cream: #f3efe2;
  --color-paper: #fbfaf6;
  --color-ink: #2b2620;
  --color-kraft: #c9a477;
  --color-kraft-ink: #2b1f14;
  --color-sticky-yellow: #f6d77a;
  --color-sticky-pink: #f2b8a2;
  --font-display: var(--font-instrument-serif);
  --font-mono: var(--font-jetbrains-mono);
  --font-hand: var(--font-caveat);
}

/* Background lives on <html> only: a body background would paint over the fixed mat. */
html {
  background: #1f5a4b;
  color: #f3efe2;
}

body {
  overflow-x: clip;
}

.mat {
  background-color: var(--color-mat);
  background-image:
    linear-gradient(rgba(240, 236, 220, 0.5) 1px, transparent 1px),
    linear-gradient(90deg, rgba(240, 236, 220, 0.5) 1px, transparent 1px),
    linear-gradient(rgba(240, 236, 220, 0.16) 1px, transparent 1px),
    linear-gradient(90deg, rgba(240, 236, 220, 0.16) 1px, transparent 1px);
  background-size: 100px 100px, 100px 100px, 20px 20px, 20px 20px;
}

.drop-object {
  filter: drop-shadow(0 10px 12px rgba(0, 0, 0, 0.35));
}

.paper-torn {
  clip-path: polygon(
    0% 6%, 4% 0%, 9% 4%, 15% 1%, 22% 5%, 30% 0%, 37% 3%, 45% 1%, 52% 5%, 60% 0%, 68% 4%, 75% 1%, 83% 5%, 90% 0%, 96% 3%, 100% 1%,
    99% 30%, 100% 60%, 98% 100%, 92% 96%, 85% 100%, 77% 95%, 70% 99%, 62% 95%, 55% 100%, 47% 96%, 40% 100%, 32% 95%, 25% 99%,
    17% 95%, 10% 100%, 4% 96%, 0% 99%, 1% 60%, 0% 30%
  );
}

.paper-kraft {
  background-color: var(--color-kraft);
  background-image:
    radial-gradient(rgba(90, 60, 30, 0.18) 1px, transparent 1.5px),
    radial-gradient(rgba(255, 240, 210, 0.25) 1px, transparent 1.5px);
  background-size: 7px 7px, 11px 11px;
}

.bg-grain {
  position: relative;
}

.bg-grain::before {
  content: "";
  position: fixed;
  inset: 0;
  z-index: 10;
  pointer-events: none;
  opacity: 0.08;
  mix-blend-mode: overlay;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='200'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E");
}
```

- [ ] **Step 2: Create `components/mat/Mat.tsx`**

```tsx
// Fixed cutting-mat background: grid (CSS), ruler numbers along the top and left edges, protractor arcs.
const RULER_MARKS = Array.from({ length: 30 }, (_, i) => i);

export function Mat() {
  return (
    <div aria-hidden className="mat pointer-events-none fixed inset-0 z-0 overflow-hidden">
      <div className="absolute left-0 top-0 flex font-mono text-[9px] text-cream/70">
        {RULER_MARKS.map((i) => (
          <span key={i} className="w-[100px] shrink-0 pl-1 pt-0.5">
            {i * 10}
          </span>
        ))}
      </div>
      <div className="absolute left-0 top-0 flex flex-col font-mono text-[9px] text-cream/70">
        {RULER_MARKS.slice(1).map((i) => (
          <span key={i} className="flex h-[100px] shrink-0 items-start pl-1 pt-[88px]">
            {i * 10}
          </span>
        ))}
      </div>
      <div className="absolute -bottom-[35vmax] -right-[20vmax] h-[70vmax] w-[70vmax] rounded-full border border-cream/30" />
      <div className="absolute -bottom-[22vmax] -right-[8vmax] h-[46vmax] w-[46vmax] rounded-full border border-cream/25" />
      <div className="absolute bottom-0 left-[8%] h-px w-[140vmax] origin-left -rotate-[24deg] bg-cream/20" />
    </div>
  );
}
```

- [ ] **Step 3: Rewrite `app/layout.tsx`**

```tsx
import type { Metadata } from "next";
import { Caveat, Instrument_Serif, JetBrains_Mono } from "next/font/google";
import { Mat } from "@/components/mat/Mat";
import "./globals.css";

const display = Instrument_Serif({
  variable: "--font-instrument-serif",
  subsets: ["latin"],
  weight: "400",
  style: ["normal", "italic"],
});

const mono = JetBrains_Mono({
  variable: "--font-jetbrains-mono",
  subsets: ["latin"],
});

const hand = Caveat({
  variable: "--font-caveat",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Alabhya Vaibhav",
  description: "Product manager, photographer, side-project builder, and Bailey's driver.",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${display.variable} ${mono.variable} ${hand.variable}`}>
      <body className="bg-grain font-mono text-cream antialiased">
        <Mat />
        {children}
      </body>
    </html>
  );
}
```

- [ ] **Step 4: Rewrite `app/page.tsx` (temporary, chapters land in later tasks)**

```tsx
export default function Home() {
  return <main className="relative z-[1] min-h-[200vh]" />;
}
```

- [ ] **Step 5: Delete the old sections**

```bash
git rm -q components/sections/About.tsx components/sections/Contact.tsx components/sections/Hero.tsx \
  components/sections/Photography.tsx components/sections/Twine.tsx components/sections/Work.tsx \
  components/ui/ScrollReveal.tsx
```

- [ ] **Step 6: Portal the Lightbox to `document.body`**

Stages are `position: fixed` (each its own stacking context, `pointer-events: none`), so a Lightbox rendered inside one would sit under the grain and nav. In `components/photography/Lightbox.tsx`:

Replace the imports block:

```tsx
"use client";

import Image from "next/image";
import { useEffect, useSyncExternalStore } from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, motion } from "framer-motion";
import { aspectClass, type PhotoSlot } from "@/content/photography";

const subscribeNever = () => () => {};
```

Inside `Lightbox`, after the `useEffect(...)` block, add:

```tsx
  const isClient = useSyncExternalStore(subscribeNever, () => true, () => false);
  if (!isClient) return null;
```

Change `return (` + `<AnimatePresence>` … `</AnimatePresence>` + `);` to:

```tsx
  return createPortal(
    <AnimatePresence>
      {/* …existing children unchanged… */}
    </AnimatePresence>,
    document.body,
  );
```

and add `font-mono` to the two button-row class strings (`"absolute -top-10 right-0 font-mono text-sm uppercase tracking-widest text-paper/80"` and `"absolute -bottom-10 flex w-full justify-between font-mono text-sm uppercase tracking-widest text-paper/80"`).

- [ ] **Step 7: Verify build, lint, tests**

Run: `npm run lint && npm test && npm run build`
Expected: lint clean, tests pass, build ends with `Export successful` (or the route table) and no type errors.

- [ ] **Step 8: Visual check**

Run `npm run dev`, open `http://localhost:3000`. Expected: full-viewport green mat with cream 100px/20px grid, ruler numbers on top and left edges, two arcs bottom-right, faint grain. Scrolling (page is 200vh) does not move the mat.

- [ ] **Step 9: Commit**

```bash
git add -A app components
git commit -m "Replace warm-paper theme with the cutting-mat background and new fonts"
```

---

### Task 3: Content data

**Files:**
- Create: `content/chapters.ts`, `content/projects.ts`, `content/bailey.ts`
- Modify: `content/site.ts`, `content/work.ts`, `content/photography.ts`
- Commit: `public/photography/01.jpg` … `54.jpg` (already on disk, untracked)
- Create: `public/sticker/alabhya-bailey.png`

**Interfaces:**
- Produces:
  - `type ChapterMeta = { id: string; number: number; title: string; side: "build" | "life" | "both" }`; `chapters: ChapterMeta[]` (6 entries, numbers 0–5).
  - `type Project = { name: string; kind: "client" | "internal"; blurb: string; link?: string; featured?: boolean; note?: string }`; `projects: Project[]`.
  - `type BaileySlot = { id: string; caption: string; alt: string; src?: string }`; `bailey: BaileySlot[]` (4).
  - `site: { name; coverLine; email; linkedinUrl; resumeHref; baileyNote; closingNote }` (all `string`).
  - `type Highlight = { title: string; metric: string; line: string }`; `Company` gains `years: string`, `isInternship?: boolean`, `highlights?: Highlight[]`.
  - `photography: PhotoSlot[]` — 54 entries, each with `src`.

- [ ] **Step 1: Create `content/chapters.ts`**

```ts
export type ChapterMeta = {
  id: string;
  number: number;
  title: string;
  side: "build" | "life" | "both";
};

export const chapters: ChapterMeta[] = [
  { id: "cover", number: 0, title: "Cover", side: "both" },
  { id: "day-job", number: 1, title: "Day job", side: "build" },
  { id: "camera", number: 2, title: "Behind the camera", side: "life" },
  { id: "projects", number: 3, title: "Side projects", side: "build" },
  { id: "bailey", number: 4, title: "Off the clock with Bailey", side: "life" },
  { id: "say-hi", number: 5, title: "Say hi", side: "both" },
];
```

- [ ] **Step 2: Create `content/projects.ts`**

```ts
export type Project = {
  name: string;
  kind: "client" | "internal";
  blurb: string;
  link?: string;
  featured?: boolean;
  // Short handwritten sticky note attached to the card.
  note?: string;
};

// Add, remove, or reorder freely: the Side projects chapter lays out 1–6 projects
// automatically (featured first). Anything past 6 is not shown.
export const projects: Project[] = [
  {
    name: "Twine",
    kind: "internal",
    featured: true,
    blurb:
      "A companion that draws out the stories your photos have been holding, then turns them into keepsakes worth sharing: a comic strip, a junk journal, a Polaroid.",
    note: "launching now",
  },
  {
    name: "Fuzzy Trip",
    kind: "client",
    // TODO(copy): one line on what Fuzzy Trip is and what was built for it.
    blurb: "Client project. One line on what it is and what I built goes here.",
  },
  {
    name: "How Your City Moves",
    kind: "internal",
    // TODO(copy): confirm this one-liner.
    blurb: "A dot-matrix look at how people move through Bangalore.",
    link: "https://how-your-city-moves.vercel.app/",
  },
];
```

- [ ] **Step 3: Create `content/bailey.ts`**

```ts
export type BaileySlot = {
  id: string;
  caption: string;
  alt: string;
  // Drop the photo in public/bailey/ and set src to "/bailey/<file>.jpg". No code changes needed.
  src?: string;
};

// TODO(copy): captions are placeholders.
export const bailey: BaileySlot[] = [
  { id: "walk", caption: "walk o'clock", alt: "Bailey out on a walk" },
  { id: "copilot", caption: "co-pilot", alt: "Bailey riding along on a drive" },
  { id: "play", caption: "zoomies", alt: "Bailey mid-play" },
  { id: "nap", caption: "post-zoomies", alt: "Bailey napping" },
];
```

- [ ] **Step 4: Rewrite `content/site.ts`**

```ts
export type SiteContent = {
  name: string;
  coverLine: string;
  email: string;
  linkedinUrl: string;
  resumeHref: string;
  baileyNote: string;
  closingNote: string;
};

export const site: SiteContent = {
  name: "Alabhya Vaibhav",
  // TODO(copy)
  coverLine:
    "Product manager by day. Photographer, side-project builder and Bailey's driver the rest of the time.",
  email: "alabhya.vaibhav1997@gmail.com",
  linkedinUrl: "https://www.linkedin.com/in/alabhya-vaibhav/",
  resumeHref: "/resume.pdf",
  // TODO(copy): written in Bailey's voice.
  baileyNote: "Human works too much. I supervise. — B",
  closingNote:
    "Always happy to talk product, photography, or what I'm building next.",
};
```

- [ ] **Step 5: Extend `content/work.ts`**

Replace the `Company` type with:

```ts
export type Highlight = {
  title: string;
  metric: string;
  line: string;
};

export type Company = {
  name: string;
  location: string;
  years: string;
  isInternship?: boolean;
  // Condensed cards for the Day job chapter.
  highlights?: Highlight[];
  positions: Position[];
};
```

Then in `workHistory`, add to each company object directly after its `location` line:

- CommerceIQ:
  ```ts
    years: "2021–now",
    highlights: [
      { title: "Ally · AI Insights", metric: "New ARR + GDR", line: "Omni-channel AI recommendations surfaced inside the platform." },
      { title: "Reporting platform", metric: "−79% manual work · ~$500K/yr", line: "Automated cross-product decks so CSMs could focus on customers." },
      { title: "RBAC & user mgmt", metric: "+10% adoption QoQ", line: "Modular roles that pulled the product suite onto one platform." },
      { title: "Product discovery", metric: "4 features shipped", line: "Customer discovery plus adoption tracking to steer the roadmap." },
    ],
  ```
- Soroco: `years: "2020–21",`
- Quikr: `years: "2018–20",`
- McKinsey & Company: `years: "2018",` and `isInternship: true,`

- [ ] **Step 6: Rewrite `content/photography.ts` with all 54 photos**

Aspect classes come from the files' pixel sizes (ratio > 1.15 landscape, < 0.87 portrait).

```ts
export type PhotoSlot = {
  id: string;
  alt: string;
  aspect: "portrait" | "square" | "landscape";
  // "/photography/<id>.jpg" (file lives in public/photography/).
  src?: string;
};

export const aspectClass: Record<PhotoSlot["aspect"], string> = {
  portrait: "aspect-[3/4]",
  square: "aspect-square",
  landscape: "aspect-[4/3]",
};

const L = "landscape" as const;
const P = "portrait" as const;

// One entry per file 01.jpg … 54.jpg, in order. To add a photo, drop NN.jpg in
// public/photography/ and append its aspect here.
const aspects: PhotoSlot["aspect"][] = [
  L, P, L, P, P, P, P, L, L, P, // 01–10
  P, P, L, P, L, L, P, L, L, L, // 11–20
  L, L, L, L, L, L, L, L, L, L, // 21–30
  L, L, L, L, L, L, L, L, L, L, // 31–40
  P, L, P, P, L, L, P, P, P, P, // 41–50
  P, P, P, L,                   // 51–54
];

// TODO(copy): replace generic alt text with real descriptions.
export const photography: PhotoSlot[] = aspects.map((aspect, i) => {
  const id = String(i + 1).padStart(2, "0");
  return { id, alt: `Photograph ${id}`, aspect, src: `/photography/${id}.jpg` };
});
```

- [ ] **Step 7: Add the sticker asset**

```bash
mkdir -p public/sticker
cp ~/Documents/assets/dot-portrait/alabhya-bailey-dots-charcoal-512.png public/sticker/alabhya-bailey.png
```

(512×495 px. Use the charcoal version: the README says the art needs a dark background. Never copy `source-photo.png`.)

- [ ] **Step 8: Verify**

Run: `ls public/photography/*.jpg | wc -l` → `54`.
Run: `npm run lint && npm test && npm run build` → all pass.

- [ ] **Step 9: Commit**

```bash
git add content public/photography public/sticker
git commit -m "Add chapter, project, and Bailey content; wire all 54 photos"
```

---

### Task 4: Paper primitives

**Files:**
- Create: `components/paper/Tape.tsx`, `TornStrip.tsx`, `KraftCard.tsx`, `Polaroid.tsx`, `StickyNote.tsx`, `Ticket.tsx`, `MarkerNote.tsx`, `Sticker.tsx`

**Interfaces:**
- Consumes: CSS classes and tokens from Task 2.
- Produces (all named exports, presentational, no motion):
  - `Tape({ className }: { className?: string })`
  - `TornStrip({ children, pins = true, className }: { children: ReactNode; pins?: boolean; className?: string })`
  - `KraftCard({ title, tag, metric, children, tape = true, size = "md", href, className }: { title: string; tag?: string; metric?: string; children?: ReactNode; tape?: boolean; size?: "md" | "lg"; href?: string; className?: string })`
  - `Polaroid({ src, alt, caption, onClick, size = "md", className }: { src?: string; alt: string; caption?: string; onClick?: () => void; size?: "sm" | "md"; className?: string })`
  - `StickyNote({ children, color = "yellow", className }: { children: ReactNode; color?: "yellow" | "pink"; className?: string })`
  - `Ticket({ label, children, href, download, className }: { label: string; children: ReactNode; href?: string; download?: boolean; className?: string })`
  - `MarkerNote({ children, arrow = "none", className }: { children: ReactNode; arrow?: "left" | "right" | "up" | "down" | "none"; className?: string })`
  - `Sticker({ src, alt, width, height, className }: { src: string; alt: string; width: number; height: number; className?: string })`

- [ ] **Step 1: `components/paper/Tape.tsx`**

```tsx
export function Tape({ className = "" }: { className?: string }) {
  return (
    <span
      aria-hidden
      className={`absolute z-[1] h-[18px] w-[56px] bg-[rgba(240,228,190,0.75)] ${className}`}
    />
  );
}
```

- [ ] **Step 2: `components/paper/TornStrip.tsx`**

```tsx
import type { ReactNode } from "react";

type TornStripProps = {
  children: ReactNode;
  pins?: boolean;
  className?: string;
};

function Pin({ className }: { className: string }) {
  return (
    <span
      aria-hidden
      className={`absolute top-2 z-[1] h-[18px] w-[18px] rounded-full bg-[radial-gradient(circle_at_35%_35%,#9fe08f,#2c9b3c_55%,#17642a)] shadow-[2px_4px_4px_rgba(0,0,0,0.4)] ${className}`}
    />
  );
}

export function TornStrip({ children, pins = true, className = "" }: TornStripProps) {
  return (
    <div className={`drop-object relative ${className}`}>
      <div className="paper-torn bg-paper px-8 pb-4 pt-5 font-mono text-[11px] uppercase leading-relaxed tracking-[0.05em] text-ink md:text-[12px]">
        {children}
      </div>
      {pins && (
        <>
          <Pin className="left-2" />
          <Pin className="right-2" />
        </>
      )}
    </div>
  );
}
```

- [ ] **Step 3: `components/paper/KraftCard.tsx`**

```tsx
import type { ReactNode } from "react";
import { Tape } from "./Tape";

type KraftCardProps = {
  title: string;
  tag?: string;
  metric?: string;
  children?: ReactNode;
  tape?: boolean;
  size?: "md" | "lg";
  href?: string;
  className?: string;
};

const WIDTH = {
  md: "w-[42vw] md:w-[min(20vw,280px)]",
  lg: "w-[42vw] md:w-[min(30vw,420px)]",
};

export function KraftCard({ title, tag, metric, children, tape = true, size = "md", href, className = "" }: KraftCardProps) {
  const body = (
    <div className={`paper-kraft relative p-3 text-kraft-ink md:p-4 ${WIDTH[size]}`}>
      {tag && (
        <span className="absolute right-2 top-2 -rotate-3 border border-kraft-ink/60 px-1.5 py-0.5 font-mono text-[8px] uppercase tracking-[0.14em] md:right-3 md:top-3 md:text-[9px]">
          {tag}
        </span>
      )}
      <h3 className={`font-display italic leading-tight ${tag ? "pr-14" : ""} ${size === "lg" ? "text-2xl md:text-4xl" : "text-xl md:text-2xl"}`}>
        {title}
      </h3>
      {metric && <p className="mt-1 font-mono text-[10px] uppercase tracking-[0.08em] md:text-[11px]">{metric}</p>}
      {children && <div className="mt-2 font-mono text-[10.5px] leading-relaxed md:text-[11.5px]">{children}</div>}
    </div>
  );

  return (
    <div className={`drop-object relative ${className}`}>
      {href ? (
        <a href={href} target="_blank" rel="noreferrer" className="block transition-transform hover:-translate-y-0.5">
          {body}
        </a>
      ) : (
        body
      )}
      {tape && (
        <>
          <Tape className="-left-4 -top-1 -rotate-[30deg]" />
          <Tape className="-right-4 -top-1 rotate-[25deg]" />
        </>
      )}
    </div>
  );
}
```

- [ ] **Step 4: `components/paper/Polaroid.tsx`**

```tsx
import Image from "next/image";

type PolaroidProps = {
  src?: string;
  alt: string;
  caption?: string;
  onClick?: () => void;
  size?: "sm" | "md";
  className?: string;
};

const WIDTH = {
  sm: "w-[38vw] md:w-[min(13vw,190px)]",
  md: "w-[40vw] md:w-[min(16vw,230px)]",
};

export function Polaroid({ src, alt, caption, onClick, size = "md", className = "" }: PolaroidProps) {
  const frame = (
    <div className={`relative bg-paper p-2 pb-10 ${WIDTH[size]}`}>
      <div className="relative aspect-square w-full overflow-hidden bg-[#3b3a36]">
        {src ? (
          <Image src={src} alt={alt} fill sizes="230px" className="object-cover" />
        ) : (
          <span
            role="img"
            aria-label={alt}
            className="absolute inset-0 flex items-center justify-center bg-[repeating-linear-gradient(45deg,#4a4842_0_6px,#3b3a36_6px_12px)] font-mono text-[10px] uppercase tracking-[0.12em] text-cream/70"
          >
            photo soon
          </span>
        )}
      </div>
      {caption && (
        <p className="absolute bottom-1.5 left-0 right-0 text-center font-hand text-xl leading-none text-ink">{caption}</p>
      )}
    </div>
  );

  return (
    <div className={`drop-object ${className}`}>
      {onClick ? (
        <button
          type="button"
          onClick={onClick}
          aria-label={`Open ${alt}`}
          className="block cursor-zoom-in transition-transform hover:-translate-y-1"
        >
          {frame}
        </button>
      ) : (
        frame
      )}
    </div>
  );
}
```

- [ ] **Step 5: `components/paper/StickyNote.tsx`**

```tsx
import type { ReactNode } from "react";

type StickyNoteProps = {
  children: ReactNode;
  color?: "yellow" | "pink";
  className?: string;
};

export function StickyNote({ children, color = "yellow", className = "" }: StickyNoteProps) {
  const bg = color === "pink" ? "bg-sticky-pink" : "bg-sticky-yellow";
  return (
    <div className={`drop-object ${className}`}>
      <div className={`aspect-square w-[38vw] p-3 font-hand text-2xl leading-tight text-ink md:w-[170px] md:p-4 ${bg}`}>
        {children}
      </div>
    </div>
  );
}
```

- [ ] **Step 6: `components/paper/Ticket.tsx`**

```tsx
import type { ReactNode } from "react";

type TicketProps = {
  label: string;
  children: ReactNode;
  href?: string;
  download?: boolean;
  className?: string;
};

export function Ticket({ label, children, href, download, className = "" }: TicketProps) {
  const body = (
    <div className="flex bg-[#e9e1cc] font-mono text-ink">
      <div className="rotate-180 border-l-2 border-dashed border-ink/30 px-2 py-3 text-[9px] uppercase tracking-[0.18em] [writing-mode:vertical-rl]">
        {label}
      </div>
      <div className="px-4 py-3 text-[11px] uppercase leading-relaxed tracking-[0.06em] md:text-[12px]">{children}</div>
    </div>
  );
  return (
    <div className={`drop-object ${className}`}>
      {href ? (
        <a href={href} download={download} target={download ? undefined : "_blank"} rel="noreferrer" className="block transition-transform hover:-translate-y-0.5">
          {body}
        </a>
      ) : (
        body
      )}
    </div>
  );
}
```

- [ ] **Step 7: `components/paper/MarkerNote.tsx`**

```tsx
import type { ReactNode } from "react";

type Arrow = "left" | "right" | "up" | "down" | "none";

type MarkerNoteProps = {
  children: ReactNode;
  arrow?: Arrow;
  className?: string;
};

const ARROW_TRANSFORM: Record<Exclude<Arrow, "none">, string> = {
  right: "",
  left: "-scale-x-100",
  down: "rotate-90",
  up: "-rotate-90",
};

function HandArrow({ direction }: { direction: Exclude<Arrow, "none"> }) {
  return (
    <svg aria-hidden width="56" height="28" viewBox="0 0 56 28" className={`shrink-0 ${ARROW_TRANSFORM[direction]}`}>
      <path d="M2 20 C 16 4, 34 4, 50 14" stroke="currentColor" strokeWidth="2.2" fill="none" strokeLinecap="round" />
      <path d="M42 8 L51 14 L42 20" stroke="currentColor" strokeWidth="2.2" fill="none" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function MarkerNote({ children, arrow = "none", className = "" }: MarkerNoteProps) {
  return (
    <div className={`flex items-center gap-2 font-hand text-2xl leading-none text-cream md:text-[28px] ${className}`}>
      {arrow === "left" && <HandArrow direction="left" />}
      {arrow === "up" && <HandArrow direction="up" />}
      <span>{children}</span>
      {arrow === "right" && <HandArrow direction="right" />}
      {arrow === "down" && <HandArrow direction="down" />}
    </div>
  );
}
```

- [ ] **Step 8: `components/paper/Sticker.tsx`**

```tsx
import Image from "next/image";

type StickerProps = {
  src: string;
  alt: string;
  width: number;
  height: number;
  className?: string;
};

export function Sticker({ src, alt, width, height, className = "" }: StickerProps) {
  return (
    <div className={`drop-object ${className}`}>
      <Image
        src={src}
        alt={alt}
        width={width}
        height={height}
        className="w-[48vw] rounded-[28px] border-[7px] border-paper md:w-[min(24vw,340px)]"
      />
    </div>
  );
}
```

- [ ] **Step 9: Visual check on a scratch page**

Temporarily replace `app/page.tsx` with a static gallery of every primitive:

```tsx
import { KraftCard } from "@/components/paper/KraftCard";
import { MarkerNote } from "@/components/paper/MarkerNote";
import { Polaroid } from "@/components/paper/Polaroid";
import { StickyNote } from "@/components/paper/StickyNote";
import { Sticker } from "@/components/paper/Sticker";
import { Ticket } from "@/components/paper/Ticket";
import { TornStrip } from "@/components/paper/TornStrip";

export default function Home() {
  return (
    <main className="relative z-[1] flex flex-wrap items-start gap-12 p-12">
      <TornStrip><p className="max-w-[360px]">Product manager by day. Photographer the rest of the time.</p></TornStrip>
      <KraftCard title="Ally · AI Insights" metric="New ARR + GDR" tag="client">One-line description here.</KraftCard>
      <KraftCard title="Twine" size="lg" tag="internal">Big featured card.</KraftCard>
      <Polaroid src="/photography/02.jpg" alt="Photograph 02" caption="hello" />
      <Polaroid alt="Empty slot" caption="photo soon" size="sm" />
      <StickyNote>walk bailey 6pm</StickyNote>
      <StickyNote color="pink">Human works too much.</StickyNote>
      <Ticket label="resume" href="/resume.pdf" download>resume.pdf<br />one page</Ticket>
      <MarkerNote arrow="left">that&apos;s Bailey</MarkerNote>
      <MarkerNote arrow="down">scroll</MarkerNote>
      <Sticker src="/sticker/alabhya-bailey.png" alt="Dot portrait of Alabhya with Bailey" width={512} height={495} />
    </main>
  );
}
```

Run `npm run dev`, open `http://localhost:3000`. Expected: torn white strip with two green pins and readable dark mono text; kraft cards with speckle, two tape strips, stamped tag; polaroid with photo and handwritten caption; empty polaroid with striped "photo soon" slot; yellow and pink stickies; ticket with dashed perforation; cream marker notes with arrows pointing the right way; sticker with rounded white border. Every object casts a shadow on the mat.

- [ ] **Step 10: Restore the placeholder page and verify**

Restore `app/page.tsx` to the Task 2 placeholder:

```tsx
export default function Home() {
  return <main className="relative z-[1] min-h-[200vh]" />;
}
```

Run: `npm run lint && npm run build` → pass.

- [ ] **Step 11: Commit**

```bash
git add components/paper app/page.tsx
git commit -m "Add paper and stationery primitives"
```

---

### Task 5: Chapter engine and the Cover chapter

**Files:**
- Create: `components/mat/useIsMobile.ts`, `components/mat/chapterContext.ts`, `components/mat/Chapter.tsx`, `components/mat/Piece.tsx`, `components/mat/ChapterLabel.tsx`, `components/chapters/Cover.tsx`
- Modify: `app/page.tsx`

**Interfaces:**
- Consumes: `pieceTrack`, `Edge` (Task 1); `chapters`, `ChapterMeta`, `site` (Task 3); `TornStrip`, `Sticker`, `MarkerNote` (Task 4).
- Produces:
  - `useIsMobile(): boolean`
  - `Chapter({ meta, children }: { meta: ChapterMeta; children: ReactNode })` — renders `<section id={meta.id} data-chapter={meta.number}>`.
  - `useChapter(): ChapterContextValue` from `components/mat/chapterContext.ts`, where `ChapterContextValue = { progress: MotionValue<number>; isFirst: boolean; isLast: boolean; still: boolean }`
  - `Piece(props: { x: number; y: number; rotate?: number; scale?: number; from?: Edge; enterAt?: number; mobile?: { x: number; y: number; rotate?: number; scale?: number }; hideOnMobile?: boolean; className?: string; children: ReactNode })`
  - `ChapterLabel({ meta }: { meta: ChapterMeta })`
  - `Cover()`

- [ ] **Step 1: `components/mat/useIsMobile.ts`**

```ts
"use client";

import { useSyncExternalStore } from "react";

const QUERY = "(max-width: 767px)";

function subscribe(onChange: () => void) {
  const mql = window.matchMedia(QUERY);
  mql.addEventListener("change", onChange);
  return () => mql.removeEventListener("change", onChange);
}

export function useIsMobile(): boolean {
  return useSyncExternalStore(subscribe, () => window.matchMedia(QUERY).matches, () => false);
}
```

- [ ] **Step 2: `components/mat/ChapterLabel.tsx`**

```tsx
import type { ChapterMeta } from "@/content/chapters";

const SIDE_LABEL = { build: "Build", life: "Life", both: null } as const;

export function ChapterLabel({ meta }: { meta: ChapterMeta }) {
  const side = SIDE_LABEL[meta.side];
  return (
    <div className="drop-object">
      <p className="bg-paper px-3 py-1.5 font-mono text-[10px] uppercase tracking-[0.14em] text-ink md:text-[11px]">
        Ch. {String(meta.number).padStart(2, "0")}
        {side && <> · {side}</>} · {meta.title}
      </p>
    </div>
  );
}
```

- [ ] **Step 3: `components/mat/chapterContext.ts` and `components/mat/Chapter.tsx`**

The context lives in its own module so `Chapter` (which renders a `Piece` for its label) and `Piece` (which reads the context) don't import each other.

`components/mat/chapterContext.ts`:

```ts
"use client";

import { createContext, useContext } from "react";
import type { MotionValue } from "framer-motion";

export type ChapterContextValue = {
  progress: MotionValue<number>;
  isFirst: boolean;
  isLast: boolean;
  // Reduced motion: no pinning, every piece at rest.
  still: boolean;
};

export const ChapterContext = createContext<ChapterContextValue | null>(null);

export function useChapter(): ChapterContextValue {
  const ctx = useContext(ChapterContext);
  if (!ctx) throw new Error("Piece must be rendered inside a Chapter");
  return ctx;
}
```

`components/mat/Chapter.tsx`:

```tsx
"use client";

import { useRef, type ReactNode } from "react";
import { useReducedMotion, useScroll } from "framer-motion";
import { chapters, type ChapterMeta } from "@/content/chapters";
import { ChapterContext, type ChapterContextValue } from "./chapterContext";
import { ChapterLabel } from "./ChapterLabel";
import { Piece } from "./Piece";

type ChapterProps = {
  meta: ChapterMeta;
  children: ReactNode;
};

// A 250vh scroll spacer whose stage is fixed over the mat. Progress runs 0→1 from the moment the
// section's top enters the viewport bottom until its bottom reaches the viewport bottom, so
// consecutive chapters hand over with no empty scroll in between.
export function Chapter({ meta, children }: ChapterProps) {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end end"] });
  const still = useReducedMotion() ?? false;
  const value: ChapterContextValue = {
    progress: scrollYProgress,
    isFirst: meta.number === chapters[0].number,
    isLast: meta.number === chapters[chapters.length - 1].number,
    still,
  };

  return (
    <ChapterContext.Provider value={value}>
      <section
        ref={ref}
        id={meta.id}
        data-chapter={meta.number}
        aria-label={meta.title}
        className={still ? "relative min-h-[110vh] md:min-h-screen" : "relative h-[250vh]"}
      >
        <div className={still ? "relative min-h-[110vh] md:min-h-screen" : "pointer-events-none fixed inset-0"}>
          <Piece x={3} y={4} rotate={-2} from="left" enterAt={0.1} mobile={{ x: 4, y: 3 }}>
            <ChapterLabel meta={meta} />
          </Piece>
          {children}
        </div>
      </section>
    </ChapterContext.Provider>
  );
}
```

- [ ] **Step 4: `components/mat/Piece.tsx`**

```tsx
"use client";

import type { ReactNode } from "react";
import { motion, useTransform } from "framer-motion";
import { pieceTrack, type Edge } from "@/lib/pieceTrack";
import { useChapter } from "./chapterContext";
import { useIsMobile } from "./useIsMobile";

type Placement = { x: number; y: number; rotate?: number; scale?: number };

type PieceProps = Placement & {
  from?: Edge;
  enterAt?: number;
  mobile?: Placement;
  hideOnMobile?: boolean;
  className?: string;
  children: ReactNode;
};

// Places one object on the chapter stage at (x%, y%) and drives it from the chapter's scroll progress.
export function Piece({
  x,
  y,
  rotate = 0,
  scale = 1,
  from = "bottom",
  enterAt = 0.2,
  mobile,
  hideOnMobile = false,
  className = "",
  children,
}: PieceProps) {
  const { progress, isFirst, isLast, still } = useChapter();
  const isMobile = useIsMobile();
  const place =
    isMobile && mobile
      ? { x: mobile.x, y: mobile.y, rotate: mobile.rotate ?? rotate, scale: mobile.scale ?? scale }
      : { x, y, rotate, scale };

  const track = pieceTrack({ from, enterAt, rotate: place.rotate, enter: !isFirst, exit: !isLast });
  const tx = useTransform(progress, track.input, track.x.map((v) => `${v}vw`));
  const ty = useTransform(progress, track.input, track.y.map((v) => `${v}vh`));
  const tr = useTransform(progress, track.input, track.rotate);

  if (isMobile && hideOnMobile) return null;

  return (
    <motion.div
      // Remount when the breakpoint flips so the transforms pick up the new placement.
      key={isMobile ? "mobile" : "desktop"}
      className={`pointer-events-auto absolute ${className}`}
      style={{
        left: `${place.x}%`,
        top: `${place.y}%`,
        scale: place.scale,
        ...(still ? { rotate: place.rotate } : { x: tx, y: ty, rotate: tr }),
      }}
    >
      {children}
    </motion.div>
  );
}
```

Note: `key` on the returned element inside the component does not remount the hooks; it remounts the `motion.div`, which re-subscribes to the current `tx/ty/tr` MotionValues. `useTransform` recomputes its mapping each render from the new `track`, so the remount guarantees the DOM reflects it immediately.

- [ ] **Step 5: `components/chapters/Cover.tsx`**

```tsx
import { Chapter } from "@/components/mat/Chapter";
import { Piece } from "@/components/mat/Piece";
import { MarkerNote } from "@/components/paper/MarkerNote";
import { Sticker } from "@/components/paper/Sticker";
import { TornStrip } from "@/components/paper/TornStrip";
import { chapters } from "@/content/chapters";
import { site } from "@/content/site";

export function Cover() {
  return (
    <Chapter meta={chapters[0]}>
      <Piece x={5} y={13} mobile={{ x: 5, y: 10 }}>
        <h1 className="font-display text-[19vw] italic leading-[0.88] text-cream [text-shadow:0_2px_12px_rgba(0,0,0,0.25)] md:text-[9vw]">
          Alabhya
          <br />
          Vaibhav
        </h1>
      </Piece>
      <Piece x={6} y={60} rotate={-1.5} mobile={{ x: 4, y: 40 }}>
        <TornStrip>
          <p className="max-w-[min(78vw,430px)]">{site.coverLine}</p>
        </TornStrip>
      </Piece>
      <Piece x={62} y={14} rotate={4} mobile={{ x: 40, y: 58, rotate: 5 }}>
        <Sticker src="/sticker/alabhya-bailey.png" alt="Dot-matrix portrait of Alabhya holding Bailey the cat" width={512} height={495} />
      </Piece>
      <Piece x={63} y={70} rotate={-4} mobile={{ x: 4, y: 66, rotate: -3 }}>
        <MarkerNote arrow="up">that&apos;s me &amp; Bailey</MarkerNote>
      </Piece>
      <Piece x={6} y={86} hideOnMobile>
        <MarkerNote arrow="down">scroll</MarkerNote>
      </Piece>
    </Chapter>
  );
}
```

- [ ] **Step 6: Mount the cover plus a spacer to test the exit**

`app/page.tsx`:

```tsx
import { Cover } from "@/components/chapters/Cover";

export default function Home() {
  return (
    <main className="relative z-[1]">
      <Cover />
      <div className="h-screen" />
    </main>
  );
}
```

- [ ] **Step 7: Verify in the browser**

Run: `npm run lint && npm test && npm run build` → pass. Then `npm run dev`, open `http://localhost:3000`:

- On load, the name, strip, sticker, marker notes, and `CH. 00 · COVER` label are at rest (cover pieces never enter).
- Scrolling down, once the cover reaches its last 20% of progress, every piece sweeps off to the left with extra rotation; scrolling back up brings them back exactly.
- DevTools device toolbar at 390×844: pieces use the mobile placements; the "scroll" note is hidden.
- **Review Focus 1:** with the window at 1200px wide, drag it narrower than 768px and back without reloading. Pieces jump to the other placement each time and their rotations match the new placement.
- No console errors or hydration warnings.

- [ ] **Step 8: Commit**

```bash
git add components/mat components/chapters app/page.tsx
git commit -m "Add the chapter engine (Chapter, Piece) and the Cover chapter"
```

---

### Task 6: Day job and Behind the camera chapters

**Files:**
- Create: `components/chapters/DayJob.tsx`, `components/chapters/Camera.tsx`
- Modify: `app/page.tsx`

**Interfaces:**
- Consumes: `Chapter`, `Piece` (Task 5); `KraftCard`, `TornStrip`, `Ticket`, `Polaroid`, `MarkerNote` (Task 4); `workHistory`, `photography`, `chapters`, `site` (Task 3); `withSrc` (Task 1); `Lightbox` (Task 2).
- Produces: `DayJob()`, `Camera()`.

- [ ] **Step 1: `components/chapters/DayJob.tsx`**

```tsx
import { Chapter } from "@/components/mat/Chapter";
import { Piece } from "@/components/mat/Piece";
import { KraftCard } from "@/components/paper/KraftCard";
import { Ticket } from "@/components/paper/Ticket";
import { TornStrip } from "@/components/paper/TornStrip";
import { chapters } from "@/content/chapters";
import { site } from "@/content/site";
import { workHistory } from "@/content/work";

const CARD_PLACES = [
  { x: 6, y: 28, rotate: -3, from: "left", mobile: { x: 4, y: 12 } },
  { x: 30, y: 24, rotate: 2, from: "top", mobile: { x: 50, y: 15 } },
  { x: 54, y: 30, rotate: -2, from: "right", mobile: { x: 4, y: 38 } },
  { x: 18, y: 62, rotate: 3, from: "bottom", mobile: { x: 50, y: 41 } },
] as const;

export function DayJob() {
  const current = workHistory[0];
  const timeline = [...workHistory].reverse().filter((c) => !c.isInternship);
  const internship = workHistory.find((c) => c.isInternship);

  return (
    <Chapter meta={chapters[1]}>
      <Piece x={6} y={11} from="left" enterAt={0.12} hideOnMobile>
        <h2 className="font-display text-6xl italic text-cream md:text-7xl">Building at {current.name}</h2>
      </Piece>
      {current.highlights?.map((h, i) => {
        const place = CARD_PLACES[i % CARD_PLACES.length];
        return (
          <Piece
            key={h.title}
            x={place.x}
            y={place.y}
            rotate={place.rotate}
            from={place.from}
            enterAt={0.14 + i * 0.03}
            mobile={{ ...place.mobile, rotate: place.rotate }}
          >
            <KraftCard title={h.title} metric={h.metric}>
              {h.line}
            </KraftCard>
          </Piece>
        );
      })}
      <Piece x={46} y={66} rotate={-1} from="right" enterAt={0.24} mobile={{ x: 4, y: 68, rotate: -1 }}>
        <TornStrip>
          <p>{timeline.map((c) => `${c.name} ${c.years}`).join(" → ")}</p>
          {internship && (
            <p className="mt-1 text-[10px] opacity-70">
              + {internship.name}, {internship.positions[0].title}, {internship.years}
            </p>
          )}
        </TornStrip>
      </Piece>
      <Piece x={79} y={28} rotate={6} from="right" enterAt={0.2} mobile={{ x: 56, y: 84, rotate: 4 }}>
        <Ticket label="resume" href={site.resumeHref} download>
          resume.pdf
          <br />
          the long version
        </Ticket>
      </Piece>
    </Chapter>
  );
}
```

- [ ] **Step 2: `components/chapters/Camera.tsx`**

```tsx
"use client";

import { useState } from "react";
import { Chapter } from "@/components/mat/Chapter";
import { Piece } from "@/components/mat/Piece";
import { Lightbox } from "@/components/photography/Lightbox";
import { MarkerNote } from "@/components/paper/MarkerNote";
import { Polaroid } from "@/components/paper/Polaroid";
import { chapters } from "@/content/chapters";
import { photography } from "@/content/photography";
import { withSrc } from "@/lib/collections";

const PLACES = [
  { x: 6, y: 14, rotate: -6, from: "left", mobile: { x: 6, y: 12 } },
  { x: 24, y: 32, rotate: 4, from: "bottom", mobile: { x: 52, y: 14 } },
  { x: 42, y: 12, rotate: -3, from: "top", mobile: { x: 6, y: 38 } },
  { x: 60, y: 28, rotate: 5, from: "right", mobile: { x: 52, y: 40 } },
  { x: 79, y: 12, rotate: -4, from: "right", mobile: { x: 6, y: 64 } },
  { x: 10, y: 58, rotate: 3, from: "left", mobile: { x: 52, y: 66 } },
  { x: 46, y: 58, rotate: -5, from: "bottom", mobile: null },
  { x: 74, y: 56, rotate: 4, from: "right", mobile: null },
] as const;

export function Camera() {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const shown = withSrc(photography, PLACES.length);

  return (
    <Chapter meta={chapters[2]}>
      {shown.map((slot, i) => {
        const place = PLACES[i];
        return (
          <Piece
            key={slot.id}
            x={place.x}
            y={place.y}
            rotate={place.rotate}
            from={place.from}
            enterAt={0.12 + i * 0.025}
            mobile={place.mobile ? { ...place.mobile, rotate: place.rotate } : undefined}
            hideOnMobile={place.mobile === null}
          >
            <Polaroid
              src={slot.src}
              alt={slot.alt}
              size="sm"
              onClick={() => setActiveIndex(photography.indexOf(slot))}
            />
          </Piece>
        );
      })}
      <Piece x={28} y={86} rotate={-2} from="bottom" enterAt={0.3} hideOnMobile>
        <MarkerNote arrow="up">click any of them to look closer ({photography.length} in the box)</MarkerNote>
      </Piece>
      <Lightbox
        slots={photography}
        activeIndex={activeIndex}
        onClose={() => setActiveIndex(null)}
        onNavigate={setActiveIndex}
      />
    </Chapter>
  );
}
```

- [ ] **Step 3: Mount them**

`app/page.tsx`:

```tsx
import { Camera } from "@/components/chapters/Camera";
import { Cover } from "@/components/chapters/Cover";
import { DayJob } from "@/components/chapters/DayJob";

export default function Home() {
  return (
    <main className="relative z-[1]">
      <Cover />
      <DayJob />
      <Camera />
    </main>
  );
}
```

- [ ] **Step 4: Verify build**

Run: `npm run lint && npm test && npm run build` → pass.

- [ ] **Step 5: Verify motion**

`npm run dev`. Scroll from the cover: cover pieces sweep off as Day job pieces slide in from their edges with staggered timing; Day job holds; then Camera polaroids slide in. Scroll back up: everything reverses. On the last chapter (Camera for now) pieces never exit.

- [ ] **Step 6: Verify the Lightbox (Review Focus 3)**

While Camera holds, click a polaroid. Expected: the lightbox covers the whole viewport above the chapter label and mat; Prev/Next page through all 54 starting from the clicked photo; Escape and clicking the backdrop close it. Clicking anything else while it is open does not reach the polaroids beneath.

- [ ] **Step 7: Commit**

```bash
git add components/chapters app/page.tsx
git commit -m "Add Day job and Behind the camera chapters"
```

---

### Task 7: Side projects, Bailey, and Say hi chapters

**Files:**
- Create: `components/chapters/SideProjects.tsx`, `components/chapters/Bailey.tsx`, `components/chapters/SayHi.tsx`
- Modify: `app/page.tsx`

**Interfaces:**
- Consumes: `projectSlots`, `projectSlotMobile`, `featuredFirst`, `MAX_PROJECTS` (Task 1); `projects`, `bailey`, `site`, `chapters` (Task 3); primitives (Task 4); `Chapter`, `Piece` (Task 5).
- Produces: `SideProjects()`, `Bailey()`, `SayHi()`.

- [ ] **Step 1: `components/chapters/SideProjects.tsx`**

```tsx
import { Chapter } from "@/components/mat/Chapter";
import { Piece } from "@/components/mat/Piece";
import { KraftCard } from "@/components/paper/KraftCard";
import { StickyNote } from "@/components/paper/StickyNote";
import { chapters } from "@/content/chapters";
import { projects } from "@/content/projects";
import { featuredFirst, MAX_PROJECTS, projectSlotMobile, projectSlots } from "@/lib/projectSlots";

const EDGES = ["left", "top", "right", "bottom"] as const;

export function SideProjects() {
  const ordered = featuredFirst(projects);
  if (process.env.NODE_ENV !== "production" && ordered.length > MAX_PROJECTS) {
    console.warn(`SideProjects shows ${MAX_PROJECTS} of ${ordered.length} projects.`);
  }
  const slots = projectSlots(ordered.length);

  return (
    <Chapter meta={chapters[3]}>
      {slots.map((slot, i) => {
        const project = ordered[i];
        const mobile = projectSlotMobile(i);
        return (
          <Piece
            key={project.name}
            x={slot.x}
            y={slot.y}
            rotate={slot.rotate}
            from={EDGES[i % EDGES.length]}
            enterAt={0.13 + i * 0.03}
            mobile={mobile}
          >
            <KraftCard
              title={project.name}
              tag={project.kind === "client" ? "Client" : "Internal"}
              size={slot.size}
              href={project.link}
            >
              {project.blurb}
            </KraftCard>
          </Piece>
        );
      })}
      {slots.map((slot, i) => {
        const note = ordered[i].note;
        if (!note) return null;
        const mobile = projectSlotMobile(i);
        const width = slot.size === "lg" ? 26 : 16;
        return (
          <Piece
            key={`${ordered[i].name}-note`}
            x={Math.min(slot.x + width, 84)}
            y={Math.max(slot.y - 8, 8)}
            rotate={7}
            from="top"
            enterAt={0.26}
            mobile={{ x: mobile.x + 22, y: Math.max(mobile.y - 6, 6), rotate: 7, scale: 0.6 }}
          >
            <StickyNote>{note}</StickyNote>
          </Piece>
        );
      })}
    </Chapter>
  );
}
```

- [ ] **Step 2: `components/chapters/Bailey.tsx`**

```tsx
import { Chapter } from "@/components/mat/Chapter";
import { Piece } from "@/components/mat/Piece";
import { MarkerNote } from "@/components/paper/MarkerNote";
import { Polaroid } from "@/components/paper/Polaroid";
import { StickyNote } from "@/components/paper/StickyNote";
import { Ticket } from "@/components/paper/Ticket";
import { bailey } from "@/content/bailey";
import { chapters } from "@/content/chapters";
import { site } from "@/content/site";

const PLACES = [
  { x: 8, y: 14, rotate: -5, from: "left", mobile: { x: 4, y: 11 } },
  { x: 28, y: 38, rotate: 4, from: "bottom", mobile: { x: 52, y: 14 } },
  { x: 50, y: 12, rotate: -2, from: "top", mobile: { x: 4, y: 42 } },
  { x: 70, y: 40, rotate: 5, from: "right", mobile: { x: 52, y: 45 } },
] as const;

export function Bailey() {
  return (
    <Chapter meta={chapters[4]}>
      {bailey.slice(0, PLACES.length).map((slot, i) => {
        const place = PLACES[i];
        return (
          <Piece
            key={slot.id}
            x={place.x}
            y={place.y}
            rotate={place.rotate}
            from={place.from}
            enterAt={0.12 + i * 0.03}
            mobile={{ ...place.mobile, rotate: place.rotate }}
          >
            <Polaroid src={slot.src} alt={slot.alt} caption={slot.caption} />
          </Piece>
        );
      })}
      <Piece x={71} y={13} rotate={-4} from="right" enterAt={0.22} hideOnMobile>
        <Ticket label="drive">
          BLR → somewhere
          <br />
          2 humans · 1 cat
        </Ticket>
      </Piece>
      <Piece x={8} y={66} rotate={-4} from="left" enterAt={0.25} mobile={{ x: 30, y: 74, rotate: -4, scale: 0.85 }}>
        <StickyNote color="pink">{site.baileyNote}</StickyNote>
      </Piece>
      <Piece x={48} y={80} rotate={-2} from="bottom" enterAt={0.28} hideOnMobile>
        <MarkerNote arrow="left">the other half of the job</MarkerNote>
      </Piece>
    </Chapter>
  );
}
```

- [ ] **Step 3: `components/chapters/SayHi.tsx`**

```tsx
import { Chapter } from "@/components/mat/Chapter";
import { Piece } from "@/components/mat/Piece";
import { TornStrip } from "@/components/paper/TornStrip";
import { chapters } from "@/content/chapters";
import { site } from "@/content/site";

export function SayHi() {
  return (
    <Chapter meta={chapters[5]}>
      <Piece x={6} y={12} from="left" enterAt={0.12} mobile={{ x: 5, y: 10 }}>
        <h2 className="font-display text-[22vw] italic leading-none text-cream md:text-[10vw]">Say hi.</h2>
      </Piece>
      <Piece x={8} y={44} rotate={-3} from="bottom" enterAt={0.16} mobile={{ x: 4, y: 32, rotate: -2 }}>
        <div className="drop-object">
          <div className="w-[88vw] bg-paper p-6 text-ink md:w-[380px]">
            <p className="font-display text-3xl italic">{site.name}</p>
            <p className="mt-1 font-mono text-[10px] uppercase tracking-[0.14em] text-ink/60">Product · Photography · Side projects</p>
            <div className="mt-5 space-y-1.5 font-mono text-[12px]">
              <a href={`mailto:${site.email}`} className="block underline decoration-ink/30 underline-offset-4 hover:decoration-ink">
                {site.email}
              </a>
              <a href={site.linkedinUrl} target="_blank" rel="noreferrer" className="block underline decoration-ink/30 underline-offset-4 hover:decoration-ink">
                LinkedIn
              </a>
            </div>
          </div>
        </div>
      </Piece>
      <Piece x={56} y={38} rotate={6} from="right" enterAt={0.2} mobile={{ x: 46, y: 60, rotate: 5 }}>
        <a href={site.resumeHref} download className="drop-object block transition-transform hover:-translate-y-1">
          <div className="paper-kraft relative w-[44vw] rounded-l-[48px] rounded-r-md py-6 pl-14 pr-6 text-kraft-ink md:w-[260px]">
            <span aria-hidden className="absolute left-5 top-1/2 h-5 w-5 -translate-y-1/2 rounded-full bg-mat ring-2 ring-kraft-ink/40" />
            <p className="font-mono text-[10px] uppercase tracking-[0.16em]">Resume</p>
            <p className="font-display text-2xl italic">resume.pdf</p>
          </div>
        </a>
      </Piece>
      <Piece x={40} y={74} rotate={-1} from="bottom" enterAt={0.24} mobile={{ x: 4, y: 82, rotate: -1 }}>
        <TornStrip>
          <p className="max-w-[min(80vw,440px)]">{site.closingNote}</p>
        </TornStrip>
      </Piece>
    </Chapter>
  );
}
```

- [ ] **Step 4: Assemble the full page**

`app/page.tsx`:

```tsx
import { Bailey } from "@/components/chapters/Bailey";
import { Camera } from "@/components/chapters/Camera";
import { Cover } from "@/components/chapters/Cover";
import { DayJob } from "@/components/chapters/DayJob";
import { SayHi } from "@/components/chapters/SayHi";
import { SideProjects } from "@/components/chapters/SideProjects";

export default function Home() {
  return (
    <main className="relative z-[1]">
      <Cover />
      <DayJob />
      <Camera />
      <SideProjects />
      <Bailey />
      <SayHi />
    </main>
  );
}
```

- [ ] **Step 5: Verify**

Run: `npm run lint && npm test && npm run build` → pass.
`npm run dev`, scroll the whole page: six chapters swap in order; Twine card is large with a yellow "launching now" sticky; Fuzzy Trip is stamped CLIENT, the others INTERNAL; How Your City Moves opens its site in a new tab; Bailey polaroids show striped "photo soon" slots with captions; Say hi pieces never exit at the bottom of the page. Email link opens a mail draft; LinkedIn opens in a new tab; resume tag downloads `resume.pdf`.

- [ ] **Step 6: Edge check for project counts (Review Focus 5)**

Temporarily change `projects` in `content/projects.ts` to `[]`, then to one entry, then to eight entries (duplicate entries with distinct `name`s). For each, reload: 0 → chapter shows only its label; 1 → one large card centred; 8 → six cards, the `npm run dev` terminal shows `SideProjects shows 6 of 8 projects.`; nothing overflows the right edge. Restore the file with `git checkout content/projects.ts`.

- [ ] **Step 7: Commit**

```bash
git add components/chapters app/page.tsx
git commit -m "Add Side projects, Bailey, and Say hi chapters"
```

---

### Task 8: Chapter navigation

**Files:**
- Create: `components/mat/ChapterNav.tsx`
- Modify: `app/page.tsx`

**Interfaces:**
- Consumes: `chapters` (Task 3); `activeChapterIndex`, `holdScrollY` (Task 1).
- Produces: `ChapterNav()`.

- [ ] **Step 1: `components/mat/ChapterNav.tsx`**

```tsx
"use client";

import { useEffect, useState, useSyncExternalStore } from "react";
import { useReducedMotion } from "framer-motion";
import { chapters } from "@/content/chapters";
import { activeChapterIndex, holdScrollY } from "@/lib/chapterScroll";

function subscribe(onChange: () => void) {
  window.addEventListener("scroll", onChange, { passive: true });
  window.addEventListener("resize", onChange);
  return () => {
    window.removeEventListener("scroll", onChange);
    window.removeEventListener("resize", onChange);
  };
}

function readActive(): number {
  const rects = chapters.map((c) => {
    const el = document.getElementById(c.id);
    return el ? { top: el.offsetTop, height: el.offsetHeight } : { top: Infinity, height: 1 };
  });
  return activeChapterIndex(rects, window.scrollY, window.innerHeight);
}

const pad = (n: number) => String(n).padStart(2, "0");

export function ChapterNav() {
  const active = useSyncExternalStore(subscribe, readActive, () => 0);
  const [open, setOpen] = useState(false);
  const reduce = useReducedMotion() ?? false;

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  const jump = (index: number) => {
    const el = document.getElementById(chapters[index].id);
    if (!el) return;
    const top =
      index === 0 ? 0 : reduce ? el.offsetTop : holdScrollY(el.offsetTop, el.offsetHeight, window.innerHeight);
    window.scrollTo({ top, behavior: reduce ? "auto" : "smooth" });
    setOpen(false);
  };

  return (
    <nav aria-label="Chapters" className="fixed right-3 top-3 z-40 md:right-5 md:top-5">
      <button
        type="button"
        aria-expanded={open}
        aria-controls="chapter-index"
        onClick={() => setOpen((o) => !o)}
        className="drop-object bg-paper px-3 py-1.5 font-mono text-[11px] uppercase tracking-[0.14em] text-ink"
      >
        Ch. {pad(chapters[active].number)} {open ? "▴" : "▾"}
      </button>
      {open && (
        <ol id="chapter-index" className="drop-object mt-2 w-[min(80vw,300px)] bg-paper py-2 font-mono text-[11px] uppercase tracking-[0.1em] text-ink">
          {chapters.map((c, i) => (
            <li key={c.id}>
              <button
                type="button"
                onClick={() => jump(i)}
                aria-current={i === active ? "step" : undefined}
                className={`block w-full px-4 py-1.5 text-left hover:bg-ink/5 ${i === active ? "font-bold" : ""}`}
              >
                {pad(c.number)} · {c.title}
              </button>
            </li>
          ))}
        </ol>
      )}
    </nav>
  );
}
```

- [ ] **Step 2: Mount it**

In `app/page.tsx`, add the import `import { ChapterNav } from "@/components/mat/ChapterNav";` and wrap the return:

```tsx
  return (
    <>
      <main className="relative z-[1]">
        <Cover />
        <DayJob />
        <Camera />
        <SideProjects />
        <Bailey />
        <SayHi />
      </main>
      <ChapterNav />
    </>
  );
```

- [ ] **Step 3: Verify (Review Focus 4)**

Run: `npm run lint && npm test && npm run build` → pass.
`npm run dev`: the tab reads `CH. 00` at the top and updates as each chapter takes over. Open it, pick each chapter in turn: the page scrolls there and the chapter's pieces are at rest (not mid-slide). Keyboard: Tab to the button, Enter opens, Tab through items, Enter jumps, Escape closes.

- [ ] **Step 4: Commit**

```bash
git add components/mat/ChapterNav.tsx app/page.tsx
git commit -m "Add chapter index navigation"
```

---

### Task 9: Responsive, reduced-motion, and final verification pass

**Files:**
- Modify (only if checks fail): placement numbers in `components/chapters/*.tsx`; `components/mat/Chapter.tsx` still-mode heights.
- Modify: `docs/superpowers/specs/2026-10-13-cutting-mat-redesign-design.md` (sticker note)

- [ ] **Step 1: Desktop pass at 1440×900**

`npm run dev`. Scroll top to bottom and back. For every chapter: no piece overlaps another piece's text, nothing is clipped at the right or bottom edge while holding, label legible. Fix any collision by editing that piece's `x`/`y` in its chapter file.

- [ ] **Step 2: Desktop pass at 1280×720**

Same checks at a short viewport (pieces are placed in % of height, cards sized in vw). Adjust `y` values if bottom-row pieces clip.

- [ ] **Step 3: Mobile pass at 390×844**

Same checks with DevTools device emulation. Adjust `mobile` placements as needed.

- [ ] **Step 4: Reduced motion (Review Focus 2)**

DevTools → Rendering → "Emulate CSS media feature prefers-reduced-motion: reduce", reload. Expected at 1440×900 and 390×844: chapters scroll as normal sections, every piece is at rest and visible, no chapter's pieces overlap the next chapter's. If a mobile chapter overflows into the next, raise that breakpoint's still-mode min-height in `Chapter.tsx` (both the `<section>` and stage class strings, e.g. `min-h-[130vh]`).

- [ ] **Step 5: Record the sticker deviation in the spec**

In the spec's Visual system section, replace the **Sticker cutout** bullet with:

```markdown
- **Sticker**: the charcoal dot portrait (`~/Documents/assets/dot-portrait/alabhya-bailey-dots-charcoal-512.png`, copied to `public/sticker/alabhya-bailey.png`) as a rounded-rectangle sticker with a 7px white border. (The transparent version was dropped: a dot-matrix silhouette cannot carry a cutout outline, and the art is designed for a dark background.) `source-photo.png` is never copied or published.
```

- [ ] **Step 6: Final checks**

Run: `npm run lint && npm test && npm run build`
Expected: lint clean, all tests pass, build exports `out/` with no errors.
Run: `ls out/photography | wc -l` → `54`; `ls out/sticker` → `alabhya-bailey.png`; `grep -r "source-photo" out/ app/ components/ content/ public/ || echo clean` → `clean`.
Console in dev: no errors or warnings across a full scroll.

- [ ] **Step 7: Commit**

```bash
git add -A components docs
git commit -m "Tune placements for desktop, mobile, and reduced motion"
```

Do not push. Hand back to the user to review the site locally before deploying.
