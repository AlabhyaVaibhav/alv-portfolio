export type PhotoGroupId = "bailey" | "places" | "people";

export type PhotoSlot = {
  id: string;
  alt: string;
  aspect: "portrait" | "square" | "landscape";
  // Width over height, after EXIF rotation.
  ratio: number;
  group: PhotoGroupId;
  // Shown on the mat ahead of the rest of its pile.
  pick?: boolean;
  // "/photography/<id>.jpg" (file lives in public/photography/).
  src?: string;
};

export const aspectClass: Record<PhotoSlot["aspect"], string> = {
  portrait: "aspect-[3/4]",
  square: "aspect-square",
  landscape: "aspect-[4/3]",
};

// Width:height of each file 01.jpg … 54.jpg, in order. To add a photo, drop NN.jpg in
// public/photography/ and append its ratio here (and its pile below).
const ratios = [
  2.95, 0.56, 1.78, 0.56, 0.56, 0.56, 0.56, 1.34, 1.25, 0.8, // 01–10
  0.8, 0.75, 1.34, 0.56, 1.25, 1.33, 0.8, 1.25, 1.25, 1.78, // 11–20
  1.77, 1.25, 1.25, 1.79, 1.78, 1.77, 1.78, 1.78, 1.78, 1.78, // 21–30
  1.25, 1.25, 1.25, 1.78, 1.78, 1.78, 1.78, 1.84, 1.25, 1.25, // 31–40
  0.8, 1.26, 0.8, 0.56, 1.78, 1.25, 0.8, 0.51, 0.8, 0.56, // 41–50
  0.56, 0.56, 0.8, 1.78, // 51–54
];

const aspectOf = (ratio: number): PhotoSlot["aspect"] => (ratio < 0.9 ? "portrait" : ratio > 1.1 ? "landscape" : "square");

// Piles on the mat, in order. TODO(copy): pile labels.
export const PHOTO_GROUPS: { id: PhotoGroupId; label: string }[] = [
  { id: "places", label: "places" },
  { id: "people", label: "people & streets" },
  { id: "bailey", label: "bailey" },
];

const B = "bailey" as const;
const S = "places" as const;
const H = "people" as const;

// Which pile each file belongs to, in the same order as `ratios`.
const groups: PhotoGroupId[] = [
  S, B, H, H, H, H, B, H, S, H, // 01–10
  H, H, S, H, S, S, B, B, B, S, // 11–20
  S, H, S, S, H, S, H, S, H, S, // 21–30
  H, H, H, S, S, S, S, H, H, H, // 31–40
  H, H, H, H, S, S, S, S, S, S, // 41–50
  S, S, H, S,                   // 51–54
];

// The four of each pile that sit face-up on the mat.
const picks = new Set(["13", "09", "30", "48", "41", "32", "43", "40", "02", "17", "07", "19"]);

// TODO(copy): replace generic alt text with real descriptions.
export const photography: PhotoSlot[] = ratios.map((ratio, i) => {
  const id = String(i + 1).padStart(2, "0");
  return { id, alt: `Photograph ${id}`, aspect: aspectOf(ratio), ratio, group: groups[i], pick: picks.has(id), src: `/photography/${id}.jpg` };
});
