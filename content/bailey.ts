export type BaileySlot = {
  id: string;
  caption: string;
  alt: string;
  // Drop the photo in public/bailey/ and set src to "/bailey/<file>.jpg". No code changes needed.
  src?: string;
};

export const bailey: BaileySlot[] = [
  { id: "walk", caption: "walk o'clock", alt: "Bailey in a harness, perched on a rock in the garden", src: "/bailey/walk.jpg" },
  { id: "copilot", caption: "co-pilot", alt: "Alabhya holding Bailey by the car on a road trip", src: "/bailey/copilot.jpg" },
  { id: "play", caption: "zoomies", alt: "Bailey on top of the sofa, caught on the home camera", src: "/bailey/zoomies.jpg" },
  { id: "nap", caption: "post-zoomies", alt: "Bailey asleep on a glass side table", src: "/bailey/nap.jpg" },
];
