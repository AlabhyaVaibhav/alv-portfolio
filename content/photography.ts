export type PhotoSlot = {
  id: string;
  alt: string;
  aspect: "portrait" | "square" | "landscape";
  // Populate with "/photography/<filename>.jpg" (place the file in public/photography/)
  // once a real photo is ready — no component code changes needed.
  src?: string;
};

export const aspectClass: Record<PhotoSlot["aspect"], string> = {
  portrait: "aspect-[3/4]",
  square: "aspect-square",
  landscape: "aspect-[4/3]",
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
