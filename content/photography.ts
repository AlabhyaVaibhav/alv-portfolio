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
