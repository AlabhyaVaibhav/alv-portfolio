// Cut-out desk objects in public/objects/ (transparent WebP, 800px max).
// `size` is the image in pixels; `cm` is how wide the image is in real life, so every object is drawn
// at true scale against the others (a pen is ~1.8x a sticky note). Widths were set from each object's
// measured long side (minimum rotated bounding box) and its real length: A4 29.7cm, A5 open 29.6cm,
// sticky note 7.6cm, index card 12.7cm, postcard 14.8cm, pens ~14cm, pencil 17.5cm, torn tape strips ~10cm.
// The full set of generated objects, with transparent PNG cutouts, lives in assets/ and assets/cutouts/.
export const OBJECTS = {
  "binder-clips": { size: [602, 746], cm: 11.6 },
  "black-felt-pen": { size: [600, 682], cm: 9.6 },
  "chai-cup": { size: [432, 442], cm: 7 },
  "chisel-tip-marker": { size: [518, 704], cm: 8.6 },
  "dot-grid-notebook": { size: [800, 625], cm: 32 },
  "glasses-and-watch": { size: [800, 758], cm: 21 },
  "highlighters": { size: [510, 624], cm: 7.7 },
  "kanban-mini-board": { size: [756, 586], cm: 23 },
  "laptop-corner": { size: [765, 800], cm: 25 },
  "not-building-card": { size: [800, 643], cm: 14 },
  "pencil": { size: [758, 188], cm: 17.1 },
  "postcard": { size: [722, 604], cm: 17 },
  "prd-printout": { size: [643, 800], cm: 26.5 },
  "prioritization-cards": { size: [800, 519], cm: 14 },
  "red-pen": { size: [662, 770], cm: 9.6 },
  "roadmap-strip": { size: [800, 422], cm: 26 },
  "ship-it-stickies": { size: [800, 468], cm: 16 },
  "sticky-note-stack": { size: [800, 798], cm: 11.2 },
  "succulent": { size: [492, 496], cm: 8 },
  "tangled-earphones": { size: [632, 544], cm: 9 },
  "washi-masking-tape": { size: [620, 720], cm: 10.5 },
  "wireframe-sheets": { size: [711, 800], cm: 29 },
} as const satisfies Record<string, { size: readonly [number, number]; cm: number }>;

export type ObjectName = keyof typeof OBJECTS;
