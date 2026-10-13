export type PhotoGroupId = "bailey" | "places" | "people";

export type PhotoSlot = {
  id: string;
  alt: string;
  aspect: "portrait" | "square" | "landscape";
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

// Piles on the mat, in order. TODO(copy): pile labels.
export const PHOTO_GROUPS: { id: PhotoGroupId; label: string }[] = [
  { id: "places", label: "places" },
  { id: "people", label: "people & streets" },
  { id: "bailey", label: "bailey" },
];

const B = "bailey" as const;
const S = "places" as const;
const H = "people" as const;

// Which pile each file belongs to, in the same order as `aspects`.
const groups: PhotoGroupId[] = [
  S, B, H, H, H, H, B, H, S, H, // 01–10
  H, H, S, H, S, S, B, B, B, S, // 11–20
  S, H, S, S, H, S, H, S, H, S, // 21–30
  H, H, H, S, S, S, S, H, H, H, // 31–40
  H, H, H, H, S, S, S, S, S, S, // 41–50
  S, S, H, S,                   // 51–54
];

// The four of each pile that sit face-up on the mat.
const picks = new Set(["01", "09", "30", "48", "41", "32", "43", "40", "02", "17", "07", "19"]);

// TODO(copy): replace generic alt text with real descriptions.
export const photography: PhotoSlot[] = aspects.map((aspect, i) => {
  const id = String(i + 1).padStart(2, "0");
  return { id, alt: `Photograph ${id}`, aspect, group: groups[i], pick: picks.has(id), src: `/photography/${id}.jpg` };
});
