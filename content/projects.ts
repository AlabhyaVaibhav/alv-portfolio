export type CaseStudy = { problem: string; approach: string; outcome: string };

export type Project = {
  name: string;
  kind: "client" | "internal" | "writing";
  blurb: string;
  link?: string;
  // Screenshot for the card, e.g. "/projects/twine.png" (file in public/projects/). Hatched placeholder until set.
  image?: string;
  featured?: boolean;
  // Short handwritten sticky note attached to the card.
  note?: string;
  // Revealed when the card's binder clip is unclipped.
  caseStudy?: CaseStudy;
};

// TODO(copy): a real case study per project.
const PLACEHOLDER_CASE: CaseStudy = {
  problem: "The messy, complex problem, in a sentence or two.",
  approach: "What I tried, what I cut, and the call that mattered.",
  outcome: "What changed for the people using it, ideally with a number.",
};

// Add, remove, or reorder freely: the Side projects chapter shows them all in a carousel, featured first.
export const projects: Project[] = [
  {
    name: "Twine",
    kind: "internal",
    featured: true,
    blurb:
      "Your camera roll is full of stories nobody has heard. Twine's companion talks you through a moment, then weaves it into a keepsake you share privately with the people who were there.",
    note: "in beta",
    // From the Twine page on amarshvutukuri.com/labs/twine, rewritten in this site's voice.
    // TODO(copy): add your role on Twine, and a link once there's a public one (beta is TestFlight-only).
    caseStudy: {
      problem:
        "Camera rolls overflow, social feels like a performance, and close friends drift. The story behind a moment rarely reaches the people who were in it.",
      approach:
        "A short chat with a companion pulls the story out in your own voice. Pick a style, comic or doodle, and share it privately: one person, a circle, or a group.",
      outcome: "In beta on TestFlight. Private sharing is still in the works.",
    },
  },
  {
    name: "Fuzzy Trip",
    kind: "client",
    // TODO(copy): one line on what Fuzzy Trip is and what was built for it.
    blurb: "Client project. One line on what it is and what I built goes here.",
    caseStudy: PLACEHOLDER_CASE,
  },
  {
    name: "How Your City Moves",
    kind: "internal",
    blurb:
      "A dot-matrix look at how people commute across nine cities. Your commute stays in your browser: no accounts, and city stats are opt-in and anonymous.",
    link: "https://how-your-city-moves.vercel.app/",
    caseStudy: PLACEHOLDER_CASE,
  },
  {
    name: "IPL Prediction League",
    kind: "internal",
    blurb:
      "A prediction league for a YouTube community: daily match picks, season-long picks, a live schedule and a real-time leaderboard. React, Firebase.",
    caseStudy: PLACEHOLDER_CASE,
  },
  {
    name: "PMs Are Becoming Builders Again!",
    kind: "writing",
    blurb:
      "Building got cheap, so being wrong got cheap too. The PM bottleneck has moved from capacity to judgment: what's worth building, and what good looks like.",
    link: "https://www.linkedin.com/pulse/pms-becoming-builders-again-alabhya-vaibhav-hb6hf/",
  },
];
