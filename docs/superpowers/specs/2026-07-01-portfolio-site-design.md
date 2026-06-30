# Personal Portfolio Site — Design Spec

Date: 2026-07-01
Owner: Alabhya Vaibhav

## Purpose

A personal-brand, creative-showcase website. Equal billing for three identities: Product Manager (career/resume story), photographer, and startup builder (Twine) — with design and filmmaking surfaced as personality, not separate portfolio sections (no work to show there yet). Not primarily a job-hunting tool, though resume/contact info is available.

## Source content

- Resume: `Resume_Alabhya_Vaibhav_PM.pdf` (career history: CommerceIQ, Soroco, Quikr, McKinsey internship)
- Twine pitch (provided by user in brainstorming session, condensed for site use — see Content section below)
- Photography: real photos to be added later by the user into `public/photography/`

## Repository & deployment

- Repo: `git@github.com:AlabhyaVaibhav/alabhyavaibhav.github.io.git` (GitHub user page — serves at `https://alabhyavaibhav.github.io/`, no subpath/basePath needed)
- The repo previously contained GitHub's default Jekyll Pages scaffold (unused `README.md`, `_config.yml`, banner images, old resume files) — removed per user decision; history preserved via merge rather than force-push.
- Deployment: GitHub Actions workflow (`.github/workflows/deploy.yml`) builds the Next.js static export and publishes via `actions/upload-pages-artifact` + `actions/deploy-pages` on every push to `main`. Repo's Pages source must be switched to "GitHub Actions" in repo settings (one-time manual step, instructions to be given after first push).
- `next.config.js`: `output: 'export'`, `images: { unoptimized: true }` (GitHub Pages has no image-optimization server; Next `<Image>` still handles lazy-loading and layout sizing).

## Tech stack

- Next.js (App Router) + TypeScript + Tailwind CSS + Framer Motion
- `next/font` for typography (warm editorial serif for headlines, e.g. Fraunces; clean sans for body, e.g. Inter or Geist)
- No backend, no CMS, no database — fully static

## Visual direction

- Warm off-white / paper-like background (~`#F5F1E8`), near-black/dark-brown ink text, one muted accent color (terracotta or deep green range) for links/highlights — exact hex finalized during implementation in one central Tailwind config
- Artistic, modern, minimal — generous whitespace, editorial typography, subtle paper-grain texture
- Single scrolling page with section-specific scroll/parallax animations (not one uniform animation style)

## Site structure (single page, sectioned)

1. **Hero** — name + short identity line (PM · Photographer · Builder, or similar). Parallax background depth on scroll, scroll-cue affordance.
2. **About** — professional summary + personal interests blended into one voice (not split into two blocks). Paper-texture background, headline fade/slide on scroll entry.
3. **Work** — vertical timeline: CommerceIQ (Product Manager, Platform → Sr. Product Analyst → Product Analyst) → Soroco → Quikr → McKinsey. Each role's bullets reveal via staggered fade/slide as the section scrolls into view, not all at once.
4. **Photography** — masonry/grid gallery. Built with styled placeholder boxes (correct aspect ratios, subtle texture) until real images are dropped into `public/photography/`. Scale/parallax on scroll or hover, lightbox on click. Swapping in real photos requires no code changes if filenames follow the documented convention (see Content data below).
5. **Twine** — visually distinct section (different background tone) signaling "this is a product, not a resume bullet." Tagline + condensed pitch + status. Condensed copy (final, to use verbatim or near-verbatim):
   - Tagline: *"A companion that draws out the stories your photos have been holding."*
   - Body (condensed): *"Twine is a story-sharing app built around a companion that asks the questions that bring back a moment — who was there, what led to it, why it mattered — then turns the story into a keepsake worth sharing: a comic strip, a junk journal, a Polaroid, and more."*
   - Status: *"Launching now."*
6. **Contact** — email, LinkedIn, resume PDF download. Quiet closing note, not a hard sell.

Each section's animation has a distinct personality: Hero = parallax depth, Work = staggered timeline reveal, Photography = grid scale-in, Twine = tonal cross-fade transition.

## Content data structure

- `content/work.ts` — array of role objects (`company`, `title`, `dates`, `bullets[]`), sourced from resume
- `content/site.ts` — name, tagline, social links (email, LinkedIn), Twine copy, resume file path
- Photography filename convention: documented in a short comment in the photography component (e.g. `public/photography/01-title.jpg`), so dropping in new files later requires no code edits
- `public/resume.pdf` — user will provide the latest resume file to use (currently `Resume_Alabhya_Vaibhav_PM.pdf` in the project root is the candidate)

## Out of scope (v1)

- Dedicated filmmaking/design portfolio section (stated interest only for now — folded into About copy, not a separate section)
- Full Twine narrative/manifesto (lives on a future dedicated Twine site, not here)
- Contact form / form backend (Formspree, Resend, etc.) — direct links only
- Multi-page routing — everything is one scrolling page
- Automated test suite — verification is manual: dev server check per section, animation behavior, and a clean static export build before considering the work done

## Verification plan

- Run `next dev`, visually confirm each section renders, animations trigger on scroll, no console errors
- Run the static export build (`next build`) and confirm it completes cleanly with no SSR-only APIs leaking in
- Confirm resume PDF downloads correctly and email/LinkedIn links are correct
