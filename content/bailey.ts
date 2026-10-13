export type BaileySlot = {
  id: string;
  caption: string;
  alt: string;
  // Drop the photo in public/bailey/ and set src to "/bailey/<file>.jpg". No code changes needed.
  src?: string;
};

// TODO(copy): captions are placeholders.
export const bailey: BaileySlot[] = [
  { id: "walk", caption: "walk o'clock", alt: "Bailey out on a walk" },
  { id: "copilot", caption: "co-pilot", alt: "Bailey riding along on a drive" },
  { id: "play", caption: "zoomies", alt: "Bailey mid-play" },
  { id: "nap", caption: "post-zoomies", alt: "Bailey napping" },
];
