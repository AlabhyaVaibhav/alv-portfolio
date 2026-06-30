# Personal Portfolio Site Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build and deploy a single-page, artistic/modern/minimal personal portfolio site for Alabhya Vaibhav covering Work history, Photography, the Twine startup, and contact info, deployed via GitHub Pages.

**Architecture:** Next.js (App Router) static-export site, content-as-data (`content/*.ts`), six section components composed in `app/page.tsx`, Framer Motion for per-section scroll animations, deployed via a GitHub Actions workflow to `alabhyavaibhav.github.io`.

**Tech Stack:** Next.js 16.2.9 (App Router, Turbopack), React 19.2.4, TypeScript, Tailwind CSS v4 (CSS-based `@theme` config, no `tailwind.config.ts`), Framer Motion ^12, npm.

Reference spec: `docs/superpowers/specs/2026-07-01-portfolio-site-design.md`

## Global Constraints

- Repo: `git@github.com:AlabhyaVaibhav/alabhyavaibhav.github.io.git`, already configured as `origin` on the local `main` branch (done during brainstorming — do not re-run `git remote add`).
- Deploys to the domain root (`https://alabhyavaibhav.github.io/`) — no `basePath`/`assetPrefix`.
- `next.config.ts` must set `output: "export"` and `images: { unoptimized: true }` — GitHub Pages has no image-optimization server.
- No App Router `src/` directory; import alias is `@/*` resolving to project root (set by scaffold).
- Tailwind v4: theme tokens (colors, fonts) live in `app/globals.css` under `@theme inline`, not in a `tailwind.config.ts` file — none should be created.
- Palette: background `--color-paper: #f5f1e8`, text `--color-ink: #2b2620`, accent `--color-accent: #b5654a`. Headline font token `--font-serif` (Fraunces), body font token `--font-sans` (Inter).
- Single scrolling page. Section order, fixed: Hero → About → Work → Photography → Twine → Contact. No nav menu, no multi-page routing, no contact form, no CMS/backend.
- Content lives in `content/site.ts`, `content/work.ts`, `content/photography.ts` — section components import from these, never hardcode copy inline.
- No automated test suite (per spec, explicitly out of scope). Verification is: TypeScript compiles cleanly, the dev server serves the expected markup (checked via `curl`+`grep`), and the production static export (`npm run build`) succeeds.
- Do not run `git push` at any point in this plan without explicit user confirmation — the repo is a live GitHub Pages site.

---

### Task 1: Scaffold the Next.js project

**Files:**
- Create: entire Next.js scaffold (`package.json`, `tsconfig.json`, `next.config.ts`, `eslint.config.mjs`, `app/layout.tsx`, `app/page.tsx`, `app/globals.css`, `.gitignore`, `public/favicon.ico`)
- Move: `Resume_Alabhya_Vaibhav_PM.pdf` → `public/resume.pdf`
- Delete: `AGENTS.md`, `CLAUDE.md`, `README.md`, `public/file.svg`, `public/globe.svg`, `public/next.svg`, `public/vercel.svg`, `public/window.svg` (scaffold defaults not used by this design)
- Modify: `next.config.ts`

**Interfaces:**
- Produces: a working Next.js + TypeScript + Tailwind v4 project at the repo root, `framer-motion` installed as a dependency, `public/resume.pdf` present, static export (`npm run build` → `out/`) working.

- [ ] **Step 1: Move the resume out of the way (create-next-app refuses to scaffold into a non-empty directory containing unrecognized files)**

```bash
cd /Users/alabhyavaibhav/Documents/alv-portfolio
mv Resume_Alabhya_Vaibhav_PM.pdf /tmp/Resume_Alabhya_Vaibhav_PM.pdf
```

- [ ] **Step 2: Scaffold Next.js non-interactively into the current (git-initialized) directory**

```bash
npx --yes create-next-app@latest . --typescript --tailwind --eslint --app --src-dir=false --import-alias "@/*" --use-npm --no-turbopack
```

Expected: ends with `Success! Created ...`. It will detect the existing `.git` repo and NOT re-initialize one (no "Initialized a git repository" line should appear — if it does appear, stop and report, do not proceed).

- [ ] **Step 3: Restore the resume into `public/`**

```bash
mkdir -p public
mv /tmp/Resume_Alabhya_Vaibhav_PM.pdf public/resume.pdf
```

- [ ] **Step 4: Remove scaffold cruft not used by this design**

```bash
rm -f AGENTS.md CLAUDE.md README.md public/file.svg public/globe.svg public/next.svg public/vercel.svg public/window.svg
```

- [ ] **Step 5: Configure static export in `next.config.ts`**

```ts
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "export",
  images: { unoptimized: true },
};

export default nextConfig;
```

- [ ] **Step 6: Install Framer Motion**

```bash
npm install framer-motion
```

- [ ] **Step 7: Verify the static export build succeeds**

```bash
npm run build && ls out/index.html
```

Expected: build ends with a `Route (app)` table and no errors; `out/index.html` exists.

- [ ] **Step 8: Commit**

```bash
git add -A
git commit -m "Scaffold Next.js portfolio project with static export config"
```

---

### Task 2: Global theme — fonts, color tokens, grain texture, metadata

**Files:**
- Modify: `app/layout.tsx`
- Modify: `app/globals.css`

**Interfaces:**
- Produces: Tailwind utility classes `bg-paper`, `text-ink`, `text-accent`, `font-serif`, `font-sans` usable in every later component; a `bg-grain` class applied to `<body>` giving a fixed full-viewport subtle noise overlay; page `<html>` carries CSS custom properties `--font-fraunces` and `--font-inter` (consumed via the `font-serif`/`font-sans` Tailwind tokens, not referenced directly elsewhere).

- [ ] **Step 1: Replace `app/layout.tsx`**

```tsx
import type { Metadata } from "next";
import { Fraunces, Inter } from "next/font/google";
import "./globals.css";

const fraunces = Fraunces({
  variable: "--font-fraunces",
  subsets: ["latin"],
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Alabhya Vaibhav",
  description: "Product Manager, photographer, and builder of Twine.",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${fraunces.variable} ${inter.variable}`}>
      <body className="bg-grain bg-paper font-sans text-ink antialiased">
        {children}
      </body>
    </html>
  );
}
```

- [ ] **Step 2: Replace `app/globals.css`**

```css
@import "tailwindcss";

:root {
  --background: #f5f1e8;
  --foreground: #2b2620;
}

@theme inline {
  --color-background: var(--background);
  --color-foreground: var(--foreground);
  --color-paper: #f5f1e8;
  --color-ink: #2b2620;
  --color-accent: #b5654a;
  --font-sans: var(--font-inter);
  --font-serif: var(--font-fraunces);
}

body {
  background: var(--background);
  color: var(--foreground);
}

.bg-grain {
  position: relative;
}

.bg-grain::before {
  content: "";
  position: fixed;
  inset: 0;
  z-index: 0;
  pointer-events: none;
  opacity: 0.035;
  mix-blend-mode: multiply;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='200'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E");
}

.bg-grain > * {
  position: relative;
  z-index: 1;
}
```

- [ ] **Step 3: Verify TypeScript and build still succeed**

```bash
npx tsc --noEmit && npm run build
```

Expected: both commands exit 0 with no errors.

- [ ] **Step 4: Commit**

```bash
git add -A
git commit -m "Add warm paper theme, editorial fonts, and grain texture"
```

---

### Task 3: Content data layer

**Files:**
- Create: `content/site.ts`
- Create: `content/work.ts`
- Create: `content/photography.ts`

**Interfaces:**
- Produces:
  - `content/site.ts` exports `type SiteContent` and `const site: SiteContent` with fields `name`, `tagline`, `email`, `linkedinUrl`, `resumeHref`, `about`, `twine: { tagline, body, status }`, `closingNote`.
  - `content/work.ts` exports `type Position = { title: string; dates: string; bullets: string[] }`, `type Company = { name: string; location: string; positions: Position[] }`, and `const workHistory: Company[]`.
  - `content/photography.ts` exports `type PhotoSlot = { id: string; alt: string; aspect: "portrait" | "square" | "landscape"; src?: string }` and `const photography: PhotoSlot[]` (9 slots, all without `src` for now — placeholders).

- [ ] **Step 1: Create `content/site.ts`**

```ts
export type SiteContent = {
  name: string;
  tagline: string;
  email: string;
  linkedinUrl: string;
  resumeHref: string;
  about: string;
  twine: {
    tagline: string;
    body: string;
    status: string;
  };
  closingNote: string;
};

export const site: SiteContent = {
  name: "Alabhya Vaibhav",
  tagline: "Product Manager · Photographer · Builder",
  email: "alabhya.vaibhav1997@gmail.com",
  linkedinUrl: "https://www.linkedin.com/in/alabhya-vaibhav/",
  resumeHref: "/resume.pdf",
  about:
    "I build products — mostly the kind powered by AI — that turn complexity into something a team can actually use. At CommerceIQ, that's meant shipping platforms that surface insights, automate reporting, and quietly save hundreds of analyst hours a year. Outside of work, I'm usually behind a camera, slow-travelling somewhere new, or sketching out the next version of Twine. I care about how things look as much as how they work — design and filmmaking pull at me for the same reason product does: there's always a better version of the story waiting to be told.",
  twine: {
    tagline:
      "A companion that draws out the stories your photos have been holding.",
    body:
      "Twine is a story-sharing app built around a companion that asks the questions that bring back a moment — who was there, what led to it, why it mattered — then turns the story into a keepsake worth sharing: a comic strip, a junk journal, a Polaroid, and more.",
    status: "Launching now.",
  },
  closingNote:
    "Always happy to talk product, photography, or what I'm building next.",
};
```

- [ ] **Step 2: Create `content/work.ts`**

```ts
export type Position = {
  title: string;
  dates: string;
  bullets: string[];
};

export type Company = {
  name: string;
  location: string;
  positions: Position[];
};

export const workHistory: Company[] = [
  {
    name: "CommerceIQ",
    location: "Bengaluru",
    positions: [
      {
        title: "Product Manager, Platform",
        dates: "Mar 2023 – Present",
        bullets: [
          "Led development of the Omni Channel AI Insights Platform (Ally), driving new ARR growth and strengthening GDR positioning by surfacing AI-driven recommendations",
          "Launched a cross-product reporting platform with automated decks, reducing manual reporting effort by 79% — leading to ~$500K annual savings and enabling CSMs to focus on strategic customer engagements",
          "Owned end-to-end transition from traditional user management to a modular RBAC and User Management system, improving UX & technology, enabling integration of product offerings into a unified platform, boosting adoption 10% QoQ",
          "Spearheaded product discovery with customers to find opportunities, launched 4 new features, and implemented adoption tracking to guide roadmap decisions",
        ],
      },
      {
        title: "Sr. Product Analyst, Professional Services",
        dates: "Oct 2022 – Mar 2023",
        bullets: [
          "Co-led development of a strategy and planning product that enabled product-led growth, improving prospect conversion rates by 3x",
          "Became SME in Amazon Marketing Cloud, leading strategic customer engagements, crucial for expanding the product suite",
        ],
      },
      {
        title: "Product Analyst, Data Platform",
        dates: "Jun 2021 – Oct 2022",
        bullets: [
          "Designed and delivered strategic reporting for a global beverage company's tentpole campaigns, securing $400K in net new ARR",
          "Owned concept-to-launch of a 1-Pager reporting product that standardised client reporting and saved ~5,000 analyst hours annually",
        ],
      },
    ],
  },
  {
    name: "Soroco",
    location: "Bengaluru",
    positions: [
      {
        title: "Business Analyst, Store Insights",
        dates: "Apr 2020 – Jun 2021",
        bullets: [
          "Developed an email clustering framework using LDA topic modelling to classify business-critical communications, enabling process mining and unlocking new automation opportunities",
          "Delivered customer-facing reports and automation strategies that identified efficiency improvements and informed clients' operational decision-making",
        ],
      },
    ],
  },
  {
    name: "Quikr",
    location: "Bengaluru",
    positions: [
      {
        title: "Full Stack Developer, Quikr Jobs",
        dates: "Oct 2018 – Apr 2020",
        bullets: [
          "Built a Progressive Web App to manage third-party associate operations end-to-end, improving operational workflows and driving a 15% revenue increase",
          "Developed a new online classified ad category that enabled recruiters to schedule and manage interviews seamlessly, enhancing the hiring experience for employers and candidates, unlocking additional ~$150K revenue annually",
        ],
      },
    ],
  },
  {
    name: "McKinsey & Company",
    location: "Gurgaon",
    positions: [
      {
        title: "IoT Research Intern, Labs",
        dates: "May 2018 – Aug 2018",
        bullets: [
          "Developed real-time facial recognition and sensor data processing infrastructure using AWS Kinesis, Lambda and DynamoDB, with rule-based notification engines",
        ],
      },
    ],
  },
];
```

- [ ] **Step 3: Create `content/photography.ts`**

```ts
export type PhotoSlot = {
  id: string;
  alt: string;
  aspect: "portrait" | "square" | "landscape";
  // Populate with "/photography/<filename>.jpg" (place the file in public/photography/)
  // once a real photo is ready — no component code changes needed.
  src?: string;
};

export const photography: PhotoSlot[] = [
  { id: "01", alt: "Photograph 01", aspect: "portrait" },
  { id: "02", alt: "Photograph 02", aspect: "square" },
  { id: "03", alt: "Photograph 03", aspect: "landscape" },
  { id: "04", alt: "Photograph 04", aspect: "portrait" },
  { id: "05", alt: "Photograph 05", aspect: "square" },
  { id: "06", alt: "Photograph 06", aspect: "landscape" },
  { id: "07", alt: "Photograph 07", aspect: "portrait" },
  { id: "08", alt: "Photograph 08", aspect: "square" },
  { id: "09", alt: "Photograph 09", aspect: "landscape" },
];
```

- [ ] **Step 4: Verify TypeScript compiles**

```bash
npx tsc --noEmit
```

Expected: exits 0, no errors.

- [ ] **Step 5: Commit**

```bash
git add -A
git commit -m "Add content data layer for site copy, work history, and photography"
```

---

### Task 4: Hero section

**Files:**
- Create: `components/sections/Hero.tsx`
- Modify: `app/page.tsx`

**Interfaces:**
- Consumes: `site` from `content/site.ts` (`site.name`, `site.tagline`).
- Produces: `export function Hero()` rendered inside `<section id="hero">`, importable as `import { Hero } from "@/components/sections/Hero"`.

- [ ] **Step 1: Create `components/sections/Hero.tsx`**

```tsx
"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { site } from "@/content/site";

export function Hero() {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });
  const y = useTransform(scrollYProgress, [0, 1], [0, 160]);
  const opacity = useTransform(scrollYProgress, [0, 1], [1, 0]);

  return (
    <section
      ref={ref}
      id="hero"
      className="relative flex h-screen items-center justify-center overflow-hidden bg-paper"
    >
      <motion.div style={{ y, opacity }} className="px-6 text-center">
        <h1 className="font-serif text-5xl text-ink sm:text-7xl">
          {site.name}
        </h1>
        <p className="mt-4 text-lg text-ink/70 sm:text-xl">{site.tagline}</p>
      </motion.div>
      <motion.div
        className="absolute bottom-10 text-sm tracking-widest text-ink/50"
        animate={{ y: [0, 8, 0] }}
        transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
      >
        SCROLL
      </motion.div>
    </section>
  );
}
```

- [ ] **Step 2: Wire it into `app/page.tsx`**

```tsx
import { Hero } from "@/components/sections/Hero";

export default function Home() {
  return (
    <main>
      <Hero />
    </main>
  );
}
```

- [ ] **Step 3: Verify via dev server**

```bash
npx next dev > /tmp/dev.log 2>&1 &
DEV_PID=$!
for i in $(seq 1 20); do
  curl -s http://localhost:3000 -o /tmp/devcheck.html
  grep -q "Alabhya Vaibhav" /tmp/devcheck.html && break
  sleep 1
done
grep -o "Product Manager · Photographer · Builder" /tmp/devcheck.html
kill $DEV_PID 2>/dev/null
```

Expected: prints `Product Manager · Photographer · Builder`.

- [ ] **Step 4: Verify TypeScript and build**

```bash
npx tsc --noEmit && npm run build
```

Expected: both exit 0.

- [ ] **Step 5: Commit**

```bash
git add -A
git commit -m "Add Hero section with scroll parallax"
```

---

### Task 5: ScrollReveal primitive + About section

**Files:**
- Create: `components/ui/ScrollReveal.tsx`
- Create: `components/sections/About.tsx`
- Modify: `app/page.tsx`

**Interfaces:**
- Consumes: `site.about` from `content/site.ts`.
- Produces:
  - `export function ScrollReveal({ children, direction, delay, className })` from `components/ui/ScrollReveal.tsx` — `direction?: "up" | "left" | "right"` (default `"up"`), `delay?: number` (default `0`), `className?: string`. Fades + slides children into view once, the first time they cross 30% into the viewport. Reused by Work, Twine, and Contact in later tasks.
  - `export function About()` rendered inside `<section id="about">`.

- [ ] **Step 1: Create `components/ui/ScrollReveal.tsx`**

```tsx
"use client";

import { motion } from "framer-motion";
import type { ReactNode } from "react";

type ScrollRevealProps = {
  children: ReactNode;
  direction?: "up" | "left" | "right";
  delay?: number;
  className?: string;
};

const offsets: Record<NonNullable<ScrollRevealProps["direction"]>, { x: number; y: number }> = {
  up: { x: 0, y: 32 },
  left: { x: -32, y: 0 },
  right: { x: 32, y: 0 },
};

export function ScrollReveal({
  children,
  direction = "up",
  delay = 0,
  className,
}: ScrollRevealProps) {
  const offset = offsets[direction];
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, x: offset.x, y: offset.y }}
      whileInView={{ opacity: 1, x: 0, y: 0 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration: 0.6, delay, ease: "easeOut" }}
    >
      {children}
    </motion.div>
  );
}
```

- [ ] **Step 2: Create `components/sections/About.tsx`**

```tsx
import { ScrollReveal } from "@/components/ui/ScrollReveal";
import { site } from "@/content/site";

export function About() {
  return (
    <section id="about" className="bg-paper px-6 py-32">
      <div className="mx-auto max-w-2xl">
        <ScrollReveal>
          <h2 className="font-serif text-3xl text-ink sm:text-4xl">About</h2>
        </ScrollReveal>
        <ScrollReveal delay={0.15}>
          <p className="mt-6 text-lg leading-relaxed text-ink/80">
            {site.about}
          </p>
        </ScrollReveal>
      </div>
    </section>
  );
}
```

- [ ] **Step 3: Wire it into `app/page.tsx`**

```tsx
import { Hero } from "@/components/sections/Hero";
import { About } from "@/components/sections/About";

export default function Home() {
  return (
    <main>
      <Hero />
      <About />
    </main>
  );
}
```

- [ ] **Step 4: Verify via dev server**

```bash
npx next dev > /tmp/dev.log 2>&1 &
DEV_PID=$!
for i in $(seq 1 20); do
  curl -s http://localhost:3000 -o /tmp/devcheck.html
  grep -q "Alabhya Vaibhav" /tmp/devcheck.html && break
  sleep 1
done
grep -o "I build products" /tmp/devcheck.html
kill $DEV_PID 2>/dev/null
```

Expected: prints `I build products`.

- [ ] **Step 5: Verify TypeScript and build**

```bash
npx tsc --noEmit && npm run build
```

Expected: both exit 0.

- [ ] **Step 6: Commit**

```bash
git add -A
git commit -m "Add ScrollReveal primitive and About section"
```

---

### Task 6: Work timeline section

**Files:**
- Create: `components/sections/Work.tsx`
- Modify: `app/page.tsx`

**Interfaces:**
- Consumes: `ScrollReveal` from `components/ui/ScrollReveal.tsx`; `workHistory` from `content/work.ts`.
- Produces: `export function Work()` rendered inside `<section id="work">`.

- [ ] **Step 1: Create `components/sections/Work.tsx`**

```tsx
import { ScrollReveal } from "@/components/ui/ScrollReveal";
import { workHistory } from "@/content/work";

export function Work() {
  return (
    <section id="work" className="bg-paper px-6 py-32">
      <div className="mx-auto max-w-3xl">
        <ScrollReveal>
          <h2 className="font-serif text-3xl text-ink sm:text-4xl">Work</h2>
        </ScrollReveal>
        <div className="mt-16 space-y-20 border-l border-ink/15 pl-8">
          {workHistory.map((company) => (
            <div key={company.name}>
              <ScrollReveal>
                <h3 className="font-serif text-2xl text-ink">
                  {company.name}
                  <span className="ml-2 text-base font-normal text-ink/50">
                    {company.location}
                  </span>
                </h3>
              </ScrollReveal>
              <div className="mt-8 space-y-10">
                {company.positions.map((position) => (
                  <div key={position.title}>
                    <ScrollReveal delay={0.05}>
                      <div className="flex flex-wrap items-baseline justify-between gap-2">
                        <h4 className="text-lg font-medium text-ink">
                          {position.title}
                        </h4>
                        <span className="text-sm text-ink/50">
                          {position.dates}
                        </span>
                      </div>
                    </ScrollReveal>
                    <ul className="mt-3 space-y-2">
                      {position.bullets.map((bullet, index) => (
                        <ScrollReveal key={bullet} delay={0.08 * (index + 1)}>
                          <li className="text-ink/75">{bullet}</li>
                        </ScrollReveal>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
```

- [ ] **Step 2: Wire it into `app/page.tsx`**

```tsx
import { Hero } from "@/components/sections/Hero";
import { About } from "@/components/sections/About";
import { Work } from "@/components/sections/Work";

export default function Home() {
  return (
    <main>
      <Hero />
      <About />
      <Work />
    </main>
  );
}
```

- [ ] **Step 3: Verify via dev server**

```bash
npx next dev > /tmp/dev.log 2>&1 &
DEV_PID=$!
for i in $(seq 1 20); do
  curl -s http://localhost:3000 -o /tmp/devcheck.html
  grep -q "Alabhya Vaibhav" /tmp/devcheck.html && break
  sleep 1
done
grep -o "Omni Channel AI Insights Platform" /tmp/devcheck.html
kill $DEV_PID 2>/dev/null
```

Expected: prints `Omni Channel AI Insights Platform`.

- [ ] **Step 4: Verify TypeScript and build**

```bash
npx tsc --noEmit && npm run build
```

Expected: both exit 0.

- [ ] **Step 5: Commit**

```bash
git add -A
git commit -m "Add Work timeline section"
```

---

### Task 7: Photography section + Lightbox

**Files:**
- Create: `components/photography/Lightbox.tsx`
- Create: `components/sections/Photography.tsx`
- Modify: `app/page.tsx`

**Interfaces:**
- Consumes: `photography` and `type PhotoSlot` from `content/photography.ts`.
- Produces:
  - `export function Lightbox({ slots, activeIndex, onClose, onNavigate }: { slots: PhotoSlot[]; activeIndex: number | null; onClose: () => void; onNavigate: (index: number) => void })` from `components/photography/Lightbox.tsx`.
  - `export function Photography()` rendered inside `<section id="photography">`.

- [ ] **Step 1: Create `components/photography/Lightbox.tsx`**

```tsx
"use client";

import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import type { PhotoSlot } from "@/content/photography";

type LightboxProps = {
  slots: PhotoSlot[];
  activeIndex: number | null;
  onClose: () => void;
  onNavigate: (index: number) => void;
};

export function Lightbox({ slots, activeIndex, onClose, onNavigate }: LightboxProps) {
  const slot = activeIndex !== null ? slots[activeIndex] : null;

  return (
    <AnimatePresence>
      {slot && activeIndex !== null && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center bg-ink/90 p-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        >
          <motion.div
            className="relative max-h-[80vh] w-full max-w-2xl"
            initial={{ scale: 0.96, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.96, opacity: 0 }}
            transition={{ duration: 0.25 }}
            onClick={(event) => event.stopPropagation()}
          >
            {slot.src ? (
              <Image
                src={slot.src}
                alt={slot.alt}
                width={1200}
                height={1500}
                className="h-full w-full rounded-sm object-contain"
              />
            ) : (
              <div className="flex aspect-[3/4] w-full items-center justify-center rounded-sm bg-paper/10 text-paper/60">
                {slot.alt}
              </div>
            )}
            <button
              type="button"
              onClick={onClose}
              className="absolute -top-10 right-0 text-sm uppercase tracking-widest text-paper/80"
            >
              Close
            </button>
            <div className="absolute -bottom-10 flex w-full justify-between text-sm uppercase tracking-widest text-paper/80">
              <button
                type="button"
                onClick={() =>
                  onNavigate((activeIndex - 1 + slots.length) % slots.length)
                }
              >
                Prev
              </button>
              <button
                type="button"
                onClick={() => onNavigate((activeIndex + 1) % slots.length)}
              >
                Next
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
```

- [ ] **Step 2: Create `components/sections/Photography.tsx`**

```tsx
"use client";

import { useState } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { photography } from "@/content/photography";
import { Lightbox } from "@/components/photography/Lightbox";

const aspectClass: Record<string, string> = {
  portrait: "aspect-[3/4]",
  square: "aspect-square",
  landscape: "aspect-[4/3]",
};

export function Photography() {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  return (
    <section id="photography" className="bg-paper px-6 py-32">
      <div className="mx-auto max-w-5xl">
        <h2 className="font-serif text-3xl text-ink sm:text-4xl">
          Photography
        </h2>
        <div className="mt-12 columns-1 gap-4 sm:columns-2 lg:columns-3">
          {photography.map((slot, index) => (
            <motion.button
              key={slot.id}
              type="button"
              onClick={() => setActiveIndex(index)}
              className={`mb-4 block w-full overflow-hidden rounded-sm bg-ink/5 ${aspectClass[slot.aspect]}`}
              initial={{ opacity: 0, scale: 0.96 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.5, delay: (index % 3) * 0.08 }}
              whileHover={{ scale: 1.02 }}
            >
              {slot.src ? (
                <Image
                  src={slot.src}
                  alt={slot.alt}
                  width={800}
                  height={1000}
                  className="h-full w-full object-cover"
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center text-xs uppercase tracking-widest text-ink/30">
                  {slot.alt}
                </div>
              )}
            </motion.button>
          ))}
        </div>
      </div>
      <Lightbox
        slots={photography}
        activeIndex={activeIndex}
        onClose={() => setActiveIndex(null)}
        onNavigate={setActiveIndex}
      />
    </section>
  );
}
```

- [ ] **Step 3: Wire it into `app/page.tsx`**

```tsx
import { Hero } from "@/components/sections/Hero";
import { About } from "@/components/sections/About";
import { Work } from "@/components/sections/Work";
import { Photography } from "@/components/sections/Photography";

export default function Home() {
  return (
    <main>
      <Hero />
      <About />
      <Work />
      <Photography />
    </main>
  );
}
```

- [ ] **Step 4: Verify via dev server**

```bash
npx next dev > /tmp/dev.log 2>&1 &
DEV_PID=$!
for i in $(seq 1 20); do
  curl -s http://localhost:3000 -o /tmp/devcheck.html
  grep -q "Alabhya Vaibhav" /tmp/devcheck.html && break
  sleep 1
done
grep -o "Photograph 01" /tmp/devcheck.html
kill $DEV_PID 2>/dev/null
```

Expected: prints `Photograph 01`.

- [ ] **Step 5: Verify TypeScript and build**

```bash
npx tsc --noEmit && npm run build
```

Expected: both exit 0.

- [ ] **Step 6: Commit**

```bash
git add -A
git commit -m "Add Photography grid section with lightbox"
```

---

### Task 8: Twine section

**Files:**
- Create: `components/sections/Twine.tsx`
- Modify: `app/page.tsx`

**Interfaces:**
- Consumes: `ScrollReveal` from `components/ui/ScrollReveal.tsx`; `site.twine` from `content/site.ts`.
- Produces: `export function Twine()` rendered inside `<section id="twine">`.

- [ ] **Step 1: Create `components/sections/Twine.tsx`**

```tsx
import { ScrollReveal } from "@/components/ui/ScrollReveal";
import { site } from "@/content/site";

export function Twine() {
  return (
    <section id="twine" className="bg-ink px-6 py-32 text-paper">
      <div className="mx-auto max-w-2xl text-center">
        <ScrollReveal>
          <span className="text-sm uppercase tracking-widest text-paper/50">
            {site.twine.status}
          </span>
        </ScrollReveal>
        <ScrollReveal delay={0.1}>
          <h2 className="mt-4 font-serif text-3xl sm:text-4xl">
            {site.twine.tagline}
          </h2>
        </ScrollReveal>
        <ScrollReveal delay={0.2}>
          <p className="mt-6 text-lg leading-relaxed text-paper/80">
            {site.twine.body}
          </p>
        </ScrollReveal>
      </div>
    </section>
  );
}
```

- [ ] **Step 2: Wire it into `app/page.tsx`**

```tsx
import { Hero } from "@/components/sections/Hero";
import { About } from "@/components/sections/About";
import { Work } from "@/components/sections/Work";
import { Photography } from "@/components/sections/Photography";
import { Twine } from "@/components/sections/Twine";

export default function Home() {
  return (
    <main>
      <Hero />
      <About />
      <Work />
      <Photography />
      <Twine />
    </main>
  );
}
```

- [ ] **Step 3: Verify via dev server**

```bash
npx next dev > /tmp/dev.log 2>&1 &
DEV_PID=$!
for i in $(seq 1 20); do
  curl -s http://localhost:3000 -o /tmp/devcheck.html
  grep -q "Alabhya Vaibhav" /tmp/devcheck.html && break
  sleep 1
done
grep -o "A companion that draws out the stories your photos have been holding." /tmp/devcheck.html
kill $DEV_PID 2>/dev/null
```

Expected: prints the Twine tagline line.

- [ ] **Step 4: Verify TypeScript and build**

```bash
npx tsc --noEmit && npm run build
```

Expected: both exit 0.

- [ ] **Step 5: Commit**

```bash
git add -A
git commit -m "Add Twine section"
```

---

### Task 9: Contact section

**Files:**
- Create: `components/sections/Contact.tsx`
- Modify: `app/page.tsx`

**Interfaces:**
- Consumes: `ScrollReveal` from `components/ui/ScrollReveal.tsx`; `site.email`, `site.linkedinUrl`, `site.resumeHref`, `site.closingNote` from `content/site.ts`; `public/resume.pdf` (placed in Task 1).
- Produces: `export function Contact()` rendered inside `<section id="contact">`. This completes `app/page.tsx`'s final section order.

- [ ] **Step 1: Create `components/sections/Contact.tsx`**

```tsx
import { ScrollReveal } from "@/components/ui/ScrollReveal";
import { site } from "@/content/site";

export function Contact() {
  return (
    <section id="contact" className="bg-paper px-6 py-32">
      <div className="mx-auto max-w-2xl text-center">
        <ScrollReveal>
          <h2 className="font-serif text-3xl text-ink sm:text-4xl">
            Get in touch
          </h2>
        </ScrollReveal>
        <ScrollReveal delay={0.1}>
          <p className="mt-4 text-ink/70">{site.closingNote}</p>
        </ScrollReveal>
        <ScrollReveal delay={0.2}>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-6 text-ink">
            <a
              href={`mailto:${site.email}`}
              className="underline underline-offset-4 hover:text-accent"
            >
              {site.email}
            </a>
            <a
              href={site.linkedinUrl}
              target="_blank"
              rel="noreferrer"
              className="underline underline-offset-4 hover:text-accent"
            >
              LinkedIn
            </a>
            <a
              href={site.resumeHref}
              download
              className="underline underline-offset-4 hover:text-accent"
            >
              Download résumé
            </a>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}
```

- [ ] **Step 2: Wire it into `app/page.tsx` (final section order)**

```tsx
import { Hero } from "@/components/sections/Hero";
import { About } from "@/components/sections/About";
import { Work } from "@/components/sections/Work";
import { Photography } from "@/components/sections/Photography";
import { Twine } from "@/components/sections/Twine";
import { Contact } from "@/components/sections/Contact";

export default function Home() {
  return (
    <main>
      <Hero />
      <About />
      <Work />
      <Photography />
      <Twine />
      <Contact />
    </main>
  );
}
```

- [ ] **Step 3: Verify via dev server, including the resume download link**

```bash
npx next dev > /tmp/dev.log 2>&1 &
DEV_PID=$!
for i in $(seq 1 20); do
  curl -s http://localhost:3000 -o /tmp/devcheck.html
  grep -q "Alabhya Vaibhav" /tmp/devcheck.html && break
  sleep 1
done
grep -o "alabhya.vaibhav1997@gmail.com" /tmp/devcheck.html
curl -s -o /dev/null -w "%{http_code}\n" http://localhost:3000/resume.pdf
kill $DEV_PID 2>/dev/null
```

Expected: prints `alabhya.vaibhav1997@gmail.com` and then `200`.

- [ ] **Step 4: Verify TypeScript and build**

```bash
npx tsc --noEmit && npm run build
```

Expected: both exit 0.

- [ ] **Step 5: Commit**

```bash
git add -A
git commit -m "Add Contact section, completing the page assembly"
```

---

### Task 10: GitHub Actions deployment workflow + final verification

**Files:**
- Create: `.github/workflows/deploy.yml`

**Interfaces:**
- Produces: a GitHub Actions workflow that builds the static export and publishes it to GitHub Pages on every push to `main`.

- [ ] **Step 1: Create `.github/workflows/deploy.yml`**

```yaml
name: Deploy to GitHub Pages

on:
  push:
    branches: [main]
  workflow_dispatch:

permissions:
  contents: read
  pages: write
  id-token: write

concurrency:
  group: pages
  cancel-in-progress: true

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: npm
      - run: npm ci
      - run: npm run build
      - uses: actions/upload-pages-artifact@v3
        with:
          path: ./out

  deploy:
    needs: build
    runs-on: ubuntu-latest
    environment:
      name: github-pages
      url: ${{ steps.deployment.outputs.page_url }}
    steps:
      - id: deployment
        uses: actions/deploy-pages@v4
```

- [ ] **Step 2: Run the full local verification suite**

```bash
npx tsc --noEmit
npm run lint
npm run build
ls out/index.html out/resume.pdf
```

Expected: all four commands succeed; `tsc` and `lint` report no errors; `out/index.html` and `out/resume.pdf` both exist.

- [ ] **Step 3: Full-page dev server smoke check — every section present in one pass**

```bash
npx next dev > /tmp/dev.log 2>&1 &
DEV_PID=$!
for i in $(seq 1 20); do
  curl -s http://localhost:3000 -o /tmp/devcheck.html
  grep -q "Alabhya Vaibhav" /tmp/devcheck.html && break
  sleep 1
done
for marker in "Alabhya Vaibhav" "I build products" "Omni Channel AI Insights Platform" "Photograph 01" "Launching now." "alabhya.vaibhav1997@gmail.com"; do
  grep -q "$marker" /tmp/devcheck.html && echo "OK: $marker" || echo "MISSING: $marker"
done
kill $DEV_PID 2>/dev/null
```

Expected: all six lines print `OK: ...`, none print `MISSING: ...`.

- [ ] **Step 4: Commit the workflow**

```bash
git add -A
git commit -m "Add GitHub Actions workflow to deploy static export to GitHub Pages"
```

- [ ] **Step 5: Stop — do not push**

Do not run `git push`. Report back to the user that all 10 tasks are complete and committed locally on `main`, and that two manual steps remain before the site is live:
1. They (or you, with explicit confirmation) need to run `git push -u origin main`.
2. In the repo's GitHub Settings → Pages, the "Build and deployment" source must be switched from "Deploy from a branch" to "GitHub Actions" (one-time).

Ask the user whether to proceed with the push now.

---

## Self-Review Notes

- **Spec coverage:** Hero/About/Work/Photography/Twine/Contact all implemented (Tasks 4–9); content-as-data via `content/*.ts` (Task 3); static export + GitHub Actions deploy to `alabhyavaibhav.github.io` (Tasks 1, 10); warm paper palette + editorial fonts + grain texture (Task 2); per-section distinct animation (parallax in Hero, staggered reveal in Work, grid scale-in in Photography, tonal cross-fade via the dark `Twine` section background); resume PDF download (Tasks 1, 9); no contact form, no nav, no multi-page routing, no automated test suite — all honored as out-of-scope per spec.
- **No placeholders:** all content strings are the real, approved resume/Twine copy — no TBDs.
- **Type consistency:** `PhotoSlot`, `Company`/`Position`, and `SiteContent` types are defined once in Task 3 and consumed with identical shapes in Tasks 4, 5, 6, 7, 8, 9 — verified no renamed fields across tasks.
- **Push safety:** plan explicitly stops short of `git push`, per Global Constraints.
