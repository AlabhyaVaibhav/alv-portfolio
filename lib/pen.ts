// Hand-drawn pen strokes as SVG path data.

const r1 = (n: number) => Math.round(n * 10) / 10;

// A marker squiggle: a run of soft waves across `width`, inside `height`.
export function squigglePath(width: number, height: number): string {
  const waves = Math.max(2, Math.round(width / 24));
  const step = width / waves;
  const mid = height / 2;
  let d = `M0 ${r1(mid)}`;
  for (let i = 0; i < waves; i++) {
    const x = step * i;
    d += ` Q${r1(x + step / 2)} ${i % 2 ? height : 0} ${r1(i === waves - 1 ? width : x + step)} ${r1(mid)}`;
  }
  return d;
}

// Small deterministic random numbers from a string, so the server and client draw the same stroke.
function seeded(seed: string) {
  let h = 2166136261;
  for (const c of seed) h = Math.imul(h ^ c.charCodeAt(0), 16777619);
  return () => {
    h = Math.imul(h ^ (h >>> 15), 2246822507);
    h = Math.imul(h ^ (h >>> 13), 3266489909);
    return ((h ^= h >>> 16) >>> 0) / 4294967296;
  };
}

// One quick pen stroke through a line of text: starts a touch early, drifts, overshoots slightly.
export function crossoutPath(width: number, height: number, seed: string): string {
  const rand = seeded(seed);
  const mid = height / 2;
  const drift = (span: number) => mid + (rand() * 2 - 1) * span;
  return [
    `M${r1(rand() * 3)} ${r1(drift(2))}`,
    `C${r1(width * 0.3)} ${r1(drift(4))} ${r1(width * 0.7)} ${r1(drift(4))} ${r1(width - rand() * 3)} ${r1(drift(2))}`,
  ].join(" ");
}
