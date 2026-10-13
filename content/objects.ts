// Cut-out desk objects in public/objects/ (transparent WebP, 800px max), with their pixel sizes.
// The full set of generated objects, with transparent PNG cutouts, lives in assets/ and assets/cutouts/.
// To add one: export its cutout to public/objects/<name>.webp at 800px and add its size here.
export const OBJECT_SIZES = {
  "binder-clips": [602, 746],
  "black-felt-pen": [600, 682],
  "chai-cup": [432, 442],
  "chisel-tip-marker": [518, 704],
  "dot-grid-notebook": [800, 625],
  "glasses-and-watch": [800, 758],
  "highlighters": [510, 624],
  "kanban-mini-board": [756, 586],
  "laptop-corner": [765, 800],
  "not-building-card": [800, 643],
  "paper-clips": [596, 662],
  "pencil": [758, 188],
  "postcard": [722, 604],
  "prd-printout": [643, 800],
  "prioritization-cards": [800, 519],
  "red-pen": [662, 770],
  "roadmap-strip": [800, 422],
  "ship-it-stickies": [800, 468],
  "sticky-note-stack": [800, 798],
  "succulent": [492, 496],
  "tangled-earphones": [632, 544],
  "wireframe-sheets": [711, 800],
} as const;

export type ObjectName = keyof typeof OBJECT_SIZES;
