# Cutting-Mat Portfolio Redesign — Design Spec

Date: 2026-10-13
Owner: Alabhya Vaibhav
Supersedes the visual direction and page structure of `2026-07-01-portfolio-site-design.md` (repo, deployment, and content sources from that spec still apply).

## Purpose

Show two sides of Alabhya with equal weight: the **builder** (PM career, shipping products, client and internal side projects) and the person **off the clock** (photography, life with their cat Bailey — play, walks, drives). A visitor should spend a minute playing with the page and leave knowing both sides. It must not read like a stock PM resume site.

## Core concept

The whole site is a **green self-healing cutting mat** that stays fixed in the viewport. The page is a sequence of **interleaved chapters** (build ↔ life). As the visitor scrolls, each chapter's spread of paper objects **slides onto the mat, holds, then is swept off** as the next chapter slides on. Scrolling back up reverses this exactly (scroll-scrubbed, not time-triggered).

## Decisions (from brainstorming)

| Topic | Decision |
|---|---|
| Two-sides structure | Interleaved chapters on one continuous mat |
| Mat | Classic green cutting mat (ref: Levin A3 mat) |
| Objects | Paper & stationery, built in code; no illustration set needed |
| Motion | Pinned mat, chapters swap; pieces slide on from edges within a chapter |
| Type | Instrument Serif (italic, display), JetBrains Mono (body/labels, uppercase), Caveat (marker notes) |
| Readability | Only the display headline and white-marker notes sit directly on the grid. All body copy, labels, and cards sit on paper |
| Paper by role | **White torn strips with green push pins** for reading copy; **kraft cards with washi tape** for work/project items |
| Tech | Rework the existing Next.js project with Framer Motion (already a dependency); no new animation libraries |
| Copy | Build with current/placeholder copy; user edits content afterwards |

## Visual system

- **Mat**: fill `#1f5a4b`; major grid every 100px at `rgba(240,236,220,.5)`, minor grid every 20px at `rgba(240,236,220,.16)`; ruler ticks + mm numbers along top and left edges in mono; two faint protractor arcs. Rendered with CSS gradients + one inline SVG for ruler/arcs. Existing `bg-grain` noise overlay is kept and tuned for a dark surface.
- **Ink on mat**: cream `#f3efe2` (headline, marker notes, arrows).
- **White paper**: `#fbfaf6`, torn edges via `clip-path` polygon, green radial-gradient push pins.
- **Kraft paper**: `#c9a477` with two layered speckle radial-gradients, ink `#2b1f14`, translucent washi tape strips.
- **Sticky notes**: yellow `#f6d77a`, pink `#f2b8a2`. **Polaroids**: `#fbfaf6` frame, thicker bottom margin.
- **Shadows**: every object casts `drop-shadow(0 10px 12px rgba(0,0,0,.35))` so it reads as lying on the mat.
- **Sticker**: the charcoal dot portrait (`~/Documents/assets/dot-portrait/alabhya-bailey-dots-charcoal-512.png`, copied to `public/sticker/alabhya-bailey.png`) as a rounded-rectangle sticker with a 7px white border. (The transparent version was dropped: a dot-matrix silhouette cannot carry a cutout outline, and the art is designed for a dark background.) `source-photo.png` is never copied or published.

## Architecture

Kept: Next.js static export, GitHub Pages workflow, `content/site.ts`, `content/work.ts`, `content/photography.ts`, `components/photography/Lightbox.tsx` (restyled), `public/photography/*`, `public/resume.pdf`.

Removed: `components/sections/*` (Hero, About, Work, Photography, Twine, Contact), `components/ui/ScrollReveal.tsx`, warm-paper theme tokens, Fraunces/Inter fonts.

New units (one file each, each with one job):

- `components/mat/Mat.tsx` — fixed full-viewport mat background. No props.
- `components/mat/Chapter.tsx` — a tall section (default `250vh`) containing a `sticky top-0 h-screen` stage. Computes scroll progress 0→1 with `useScroll({ target, offset: ["start start", "end end"] })` and provides it via React context. Props: `id`, `label`, `side: "build" | "life" | "both"`, `children`. Registers itself for chapter navigation.
- `components/mat/Piece.tsx` — positions and animates one object inside a chapter stage. Props: `x`, `y` (percent of stage), `rotate`, `from: "left" | "right" | "top" | "bottom"`, `enterAt` (0–1, default staggered 0.05–0.25), optional `mobile: { x, y, rotate, scale }`. Reads chapter progress from context and maps it with `useTransform`:
  - `[enterAt, enterAt + 0.15]` → slide from off-stage on `from` edge (with extra rotation) to rest;
  - hold at rest until `0.8`;
  - `[0.8, 1]` → swept off toward the left with added rotation.
  - The first chapter's pieces start at rest (no enter); the last chapter's pieces never exit.
- Paper primitives in `components/paper/` (pure presentation, no motion): `TornStrip` (pins on/off), `KraftCard` (tape on/off, optional `tag`), `Polaroid` (`src?`, `caption?`, `onClick?`; renders a textured empty slot when `src` missing), `StickyNote` (`color`), `Ticket`, `MarkerNote` (Caveat text + optional SVG arrow with direction), `Sticker` (image with white cutout border).
- `components/mat/ChapterLabel.tsx` — mono label on a small paper tab, e.g. `CH. 03 · SIDE PROJECTS`.
- `components/mat/ChapterNav.tsx` — fixed corner tab showing current `CH. 0X`; click opens a mono index of chapters; selecting one scrolls to that chapter's start.
- `components/chapters/*.tsx` — one composition per chapter (below). Chapters only arrange primitives inside `Piece`s and read from `content/*`.

New content files:

- `content/projects.ts` — `type Project = { name: string; kind: "client" | "internal"; blurb: string; link?: string; image?: string; featured?: boolean }`; initial entries: Twine (internal, featured, existing tagline/body/status), Fuzzy Trip (client, placeholder blurb), How Your City Moves (internal, placeholder blurb). Placeholders are marked with `// TODO(copy)` comments.
- `content/bailey.ts` — photo slots `{ id, caption, src? }` × 4, same drop-in convention as `photography.ts`.
- `content/site.ts` — add `coverLine` and `baileyNote`; remove the old long `about` paragraph and the `twine` block (moved to `projects.ts`).

## Chapters

All chapters are one pinned spread; content is condensed to fit one viewport.

- **00 · Cover (both)** — "Alabhya Vaibhav" in huge Instrument Serif italic on the mat; pinned white strip with `coverLine`; dot-portrait sticker; marker note "← that's Bailey"; marker "scroll ↓".
- **01 · Day job (build)** — four kraft cards (Ally; reporting platform −79% manual effort / ~$500K saved; RBAC +10% QoQ adoption; product discovery, 4 features) each with title, one headline metric, one-line description, derived from `work.ts` via a new optional `highlights` field on the CommerceIQ company entry; a white timeline strip Quikr → Soroco → CommerceIQ with McKinsey as footnote; a `Ticket` "resume.pdf" linking to `/resume.pdf`.
- **02 · Behind the camera (life)** — 8 polaroids (first 8 of `photography.ts` with `src`); click opens the Lightbox over the full set of 25; marker note "click to look closer".
- **03 · Side projects (build)** — one kraft card per project with stamped `CLIENT` / `INTERNAL` tag; featured project (Twine) is larger with a "launching now" sticky note. Layout is a predefined slot table for 2–6 projects; projects beyond 6 are ignored with a dev-only console warning.
- **04 · Off the clock with Bailey (life)** — 4 Bailey polaroids (empty slots until `src` is added) with marker captions; ticket "BLR → somewhere · 1 cat"; pink sticky note with `baileyNote`.
- **05 · Say hi (both)** — business card (email, LinkedIn), luggage-tag link to resume, pinned strip with `closingNote`.

## Mobile & reduced motion

- **Mobile (<768px)**: same pinned mechanic. Each `Piece` uses its `mobile` overrides (positions re-flowed into a loose vertical stack, scale ~0.8). Chapters with many pieces (02 photography, 03 projects) show fewer items on mobile (6 polaroids, projects at smaller scale). Mat grid sizes stay the same in px.
- **`prefers-reduced-motion: reduce`**: no scroll-scrubbing. `Chapter` renders as a normal-height section (`min-h-screen`, not sticky) and every `Piece` renders at rest. The mat stays fixed.
- **Accessibility**: real text (not images) for all copy; polaroids are `<button>`s with alt text; links are real `<a>`s; `ChapterNav` is keyboard-operable; Lightbox keeps its existing keyboard handling.

## Error handling / edge cases

- Missing photo `src` → `Polaroid` shows an empty textured slot, never a broken image.
- Project count outside 2–6 → render what fits, dev warning.
- Fonts load via `next/font` (self-hosted at build), so there is no runtime font dependency.

## Out of scope

- Final copy (user edits after build).
- Illustration or photo-cutout object sets beyond the dot-portrait sticker.
- Dedicated case-study pages per project; multi-page routing.
- Automated test suite (consistent with the original spec).

## Verification

- `npm run build` completes cleanly (static export).
- `npm run lint` passes.
- Manual pass in the browser at desktop (1440px) and mobile (390px) widths: every chapter's pieces slide on, hold, and sweep off; scrolling back up reverses; no console errors; Lightbox opens from chapter 02 and pages through all photos; chapter nav jumps correctly; resume, email, LinkedIn links work.
- Reduced-motion check via DevTools emulation: all content visible at rest, no pinning.
