export type Project = {
  name: string;
  kind: "client" | "internal";
  blurb: string;
  link?: string;
  // Screenshot for the card, e.g. "/projects/twine.png" (file in public/projects/). Hatched placeholder until set.
  image?: string;
  featured?: boolean;
  // Short handwritten sticky note attached to the card.
  note?: string;
};

// Add, remove, or reorder freely: the Side projects chapter shows them all in a carousel, featured first.
export const projects: Project[] = [
  {
    name: "Twine",
    kind: "internal",
    featured: true,
    blurb:
      "A companion that draws out the stories your photos have been holding, then turns them into keepsakes worth sharing: a comic strip, a junk journal, a Polaroid.",
    note: "launching now",
  },
  {
    name: "Fuzzy Trip",
    kind: "client",
    // TODO(copy): one line on what Fuzzy Trip is and what was built for it.
    blurb: "Client project. One line on what it is and what I built goes here.",
  },
  {
    name: "How Your City Moves",
    kind: "internal",
    // TODO(copy): confirm this one-liner.
    blurb: "A dot-matrix look at how people move through Bangalore.",
    link: "https://how-your-city-moves.vercel.app/",
  },
];
