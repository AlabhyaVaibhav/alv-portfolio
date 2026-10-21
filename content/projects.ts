export type CaseStudy = { problem: string; approach: string; outcome: string };

// A full case-study page at /projects/<slug>. Every field is optional except the story itself:
// leave out what isn't known rather than inventing it.
export type CaseFact = { label: string; value: string | string[]; live?: boolean };
export type CaseCard = { kind: "learning" | "hiccup"; title: string; text: string };
export type CaseSection = {
  eyebrow: string;
  title: string;
  body?: string[];
  // Numbered steps, e.g. a user flow.
  steps?: { title: string; text: string }[];
  cards?: CaseCard[];
};
export type CasePage = {
  // One line above the title, e.g. what it is in a few words.
  eyebrow: string;
  // The standfirst under the title.
  dek: string;
  tags: string[];
  facts: CaseFact[];
  // Hero image in public/projects/; a hatched placeholder until set.
  hero?: string;
  sections: CaseSection[];
  outcome?: { title: string; text: string };
  // Where to go next: the live thing, a demo, a post.
  links?: { label: string; href: string }[];
};

export type Project = {
  name: string;
  kind: "client" | "internal" | "writing";
  blurb: string;
  link?: string;
  // Cover for the card and the case-study hero, e.g. "/projects/twine.webp" (file in public/projects/).
  // Hatched placeholder until set.
  image?: string;
  // For covers much wider than the card: show the whole image, letterboxed on this colour, instead of
  // cropping it.
  imageBg?: string;
  featured?: boolean;
  // Short handwritten sticky note attached to the card.
  note?: string;
  // Revealed when the card's binder clip is unclipped.
  caseStudy?: CaseStudy;
  // The full case study, opened from the card.
  page?: CasePage;
};

// Add, remove, or reorder freely: the Side projects chapter shows them all in a carousel, featured first.
export const projects: Project[] = [
  {
    name: "Twine",
    kind: "internal",
    featured: true,
    image: "/projects/twine.webp",
    imageBg: "#252525",
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
    // TODO(copy): add your role, the timeline and the tools, plus what you learned.
    page: {
      eyebrow: "stories, woven",
      hero: "/projects/twine.webp",
      dek: "A companion that helps you tell the story behind a photo, then turns it into a keepsake for the people who were there.",
      tags: ["Consumer app", "Storytelling"],
      facts: [
        { label: "Status", value: "In beta on TestFlight", live: true },
        { label: "Platform", value: "iOS" },
      ],
      sections: [
        {
          eyebrow: "The problem",
          title: "The stories behind our photos go untold",
          body: [
            "Camera rolls overflow faster than anyone can look back through them. Posting feels like a performance, and the friends who'd most want to hear about a moment are often the ones we see least.",
            "The moment, the story behind it and the people who were in it rarely end up in the same place. Nothing ties them together.",
          ],
        },
        {
          eyebrow: "How it works",
          title: "Capture, curate, share",
          steps: [
            { title: "Capture", text: "A short conversation with your companion. It asks about the moment, who was there and why it mattered, and keeps the story in your own voice." },
            { title: "Curate", text: "Pick a style, comic or doodle, and the memory becomes a keepsake you'd actually want to send." },
            { title: "Share", text: "Privately, never broadcast: to one person, to a circle, or to a group." },
          ],
        },
      ],
      outcome: { title: "In beta, sharing next", text: "Twine is in beta on TestFlight. Capturing and styling stories works today; private sharing is still in the works." },
    },
  },
  {
    name: "FuzzyTrip",
    kind: "client",
    image: "/projects/fuzzytrip.webp",
    imageBg: "#0c1a31",
    note: "in development",
    blurb:
      "Group trips stall in the group chat. In FuzzyTrip one organiser plans, everyone else weighs in over WhatsApp, and the group lands on one good plan.",
    caseStudy: {
      problem: "Group travel stalls on deciding, not booking: dates, budgets and places bounce around the group chat long before anyone commits.",
      approach: "Shaping the product strategy and roadmap, the design, and how a traveller should feel using it. One organiser plans; everyone else answers in WhatsApp; nobody books until the plan is set.",
      outcome: "The vision grows from faster group decisions into an end-to-end app that can be tailored into persona-based travel ecosystems.",
    },
    // TODO(copy): timeline and any early results once they can be shared.
    page: {
      eyebrow: "group trips, finally decided",
      dek: "One organiser plans in FuzzyTrip while everyone else weighs in through Wonderlog, in a private WhatsApp chat. The group shapes one plan together, and nothing gets booked until the organiser says go.",
      tags: ["Travel", "Group decisions"],
      hero: "/projects/fuzzytrip.webp",
      facts: [
        { label: "Status", value: "Under development" },
        { label: "My role", value: ["Product strategy & roadmap", "Product design", "Consumer experience"] },
      ],
      sections: [
        {
          eyebrow: "The problem",
          title: "Group trips die in the group chat",
          body: [
            "Everyone has an opinion on where, when and how much. The slowest part of group travel isn't the booking, it's the deciding: the gap between a group wanting to go and a group agreeing on a plan.",
            "That decision latency is what FuzzyTrip sets out to cut.",
          ],
        },
        {
          eyebrow: "How it works",
          title: "Many voices, one good plan",
          steps: [
            { title: "One organiser plans", text: "The organiser sets the trip up in FuzzyTrip." },
            { title: "Everyone weighs in", text: "The rest of the group answers Wonderlog in a private WhatsApp chat, with no new app to install." },
            { title: "Book once it's decided", text: "Together they shape one plan, and nobody books anything until the organiser does." },
          ],
        },
        {
          eyebrow: "My part",
          title: "Strategy, design and the traveller's view",
          steps: [
            { title: "Strategy & roadmap", text: "Defining what FuzzyTrip solves first, and the order it grows in from there." },
            { title: "Design", text: "Shaping the product and its flows so a group can land on one plan." },
            { title: "The consumer lens", text: "How a traveller would actually perceive it, and what makes a whole group trust the plan." },
          ],
        },
        {
          eyebrow: "The vision",
          title: "From faster decisions to the whole trip",
          body: [
            "Start by solving decision latency for groups. Then extend into an end-to-end app for the whole trip, one that can be tailored into persona-based travel ecosystems.",
          ],
        },
      ],
      links: [{ label: "Visit fuzzytrip.com", href: "https://fuzzytrip.com" }],
    },
  },
  {
    name: "How Your City Moves",
    kind: "internal",
    image: "/projects/how-your-city-moves.webp",
    note: "live",
    blurb:
      "A dot-matrix look at how people commute across nine cities. Your commute stays in your browser: no accounts, and city stats are opt-in and anonymous.",
    link: "https://www.howyourcitymoves.fyi",
    caseStudy: {
      problem: "There's no easy way to see how a whole city commutes, or to add your own commute without handing over data.",
      approach: "A dot-matrix map of commutes across nine cities. Your commute stays in your browser, with no accounts, and city stats are opt-in and anonymous.",
      outcome: "Live at howyourcitymoves.fyi, covering nine cities.",
    },
    // TODO(copy): timeline, tools and learnings.
    page: {
      eyebrow: "a dot-matrix look at commutes",
      dek: "See how people get around nine cities, and add your own commute without giving anything away.",
      tags: ["Data viz", "Privacy-first"],
      hero: "/projects/how-your-city-moves.webp",
      facts: [
        { label: "Status", value: "Live", live: true },
        { label: "Coverage", value: "Nine cities" },
      ],
      sections: [
        {
          eyebrow: "The idea",
          title: "A city, drawn in dots",
          body: [
            "Commutes shape a city as much as its roads do, but they're invisible from the outside. How Your City Moves draws them as a dot-matrix map, so you can see where people come from and where they're headed.",
          ],
        },
        {
          eyebrow: "My own commute",
          title: "480 hours a year on the road",
          body: [
            "My card: HSR Layout to Indiranagar, an hour each way by car. That adds up to 480 hours a year, about 20 days, or roughly 16 Test matches start to finish.",
          ],
        },
        {
          eyebrow: "Privacy",
          title: "Your commute never leaves your browser",
          body: [
            "There are no accounts. Your own commute stays on your device, and contributing to the city-wide stats is opt-in and anonymous.",
          ],
        },
      ],
      outcome: { title: "Live across nine cities", text: "It's live at howyourcitymoves.fyi, covering nine cities." },
      links: [{ label: "Visit howyourcitymoves.fyi", href: "https://www.howyourcitymoves.fyi" }],
    },
  },
  {
    name: "IPL Prediction League",
    kind: "internal",
    image: "/projects/ipl-prediction-league.webp",
    imageBg: "#0c1117",
    note: "live",
    // TODO(copy): confirm the community is Dugout Dost (from the cover).
    blurb:
      "A prediction league for the Dugout Dost YouTube community: daily match picks, season-long picks, a live schedule and a real-time leaderboard. React, Firebase.",
    caseStudy: {
      problem: "A YouTube community needed one place to call IPL matches and keep score across the season.",
      approach: "Daily match picks, season-long picks, an IPL schedule feed, a real-time leaderboard and an admin panel to settle results.",
      outcome: "Built in March 2026 and live for the IPL season.",
    },
    // TODO(copy): the community, how many played, and what you learned.
    page: {
      eyebrow: "a prediction league",
      dek: "A league for the Dugout Dost YouTube community to call every IPL match, with a leaderboard that updates as results come in.",
      tags: ["Community", "Sports"],
      hero: "/projects/ipl-prediction-league.webp",
      facts: [
        { label: "Status", value: "Live", live: true },
        { label: "Community", value: "Dugout Dost" },
        { label: "When", value: "Mar 2026" },
        { label: "Tools", value: ["React 19", "TypeScript", "Tailwind CSS 4", "Framer Motion", "Firebase", "Vite 6", "React Router 7"] },
      ],
      sections: [
        {
          eyebrow: "The brief",
          title: "One home for every match call",
          body: [
            "The league gives a YouTube community's match calls one home, and a scoreboard that runs the whole season.",
          ],
        },
        {
          eyebrow: "What's in it",
          title: "Picks, a schedule and a live table",
          steps: [
            { title: "Daily picks", text: "Call each match before it starts." },
            { title: "Season picks", text: "Long-range calls that pay off at the end." },
            { title: "Schedule feed", text: "Every IPL fixture in one place." },
            { title: "Leaderboard", text: "Updates in real time as results land." },
            { title: "Admin panel", text: "Settle results and keep the league honest." },
          ],
        },
      ],
      outcome: { title: "Live for the season", text: "Built in March 2026 and live for the IPL season." },
    },
  },
  {
    name: "PMs Are Becoming Builders Again!",
    kind: "writing",
    image: "/projects/pms-are-builders.webp",
    imageBg: "#fdf9f5",
    blurb:
      "Building got cheap, so being wrong got cheap too. The PM bottleneck has moved from capacity to judgment: what's worth building, and what good looks like.",
    link: "https://www.linkedin.com/pulse/pms-becoming-builders-again-alabhya-vaibhav-hb6hf/",
  },
];
