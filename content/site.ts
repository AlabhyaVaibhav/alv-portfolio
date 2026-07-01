export type SiteContent = {
  name: string;
  tagline: string;
  email: string;
  linkedinUrl: string;
  resumeHref: string;
  about: string;
  twine: {
    tagline: string;
    body: string;
    status: string;
  };
  closingNote: string;
};

export const site: SiteContent = {
  name: "Alabhya Vaibhav",
  tagline: "Product Manager · Photographer · Builder",
  email: "alabhya.vaibhav1997@gmail.com",
  linkedinUrl: "https://www.linkedin.com/in/alabhya-vaibhav/",
  resumeHref: "/resume.pdf",
  about:
    "I build products — mostly the kind powered by AI — that turn complexity into something a team can actually use. At CommerceIQ, that's meant shipping platforms that surface insights, automate reporting, and quietly save hundreds of analyst hours a year. Outside of work, I'm usually behind a camera, slow-travelling somewhere new, or sketching out the next version of Twine. I care about how things look as much as how they work — design and filmmaking pull at me for the same reason product does: there's always a better version of the story waiting to be told.",
  twine: {
    tagline:
      "A companion that draws out the stories your photos have been holding.",
    body:
      "Twine is a story-sharing app built around a companion that asks the questions that bring back a moment — who was there, what led to it, why it mattered — then turns the story into a keepsake worth sharing: a comic strip, a junk journal, a Polaroid, and more.",
    status: "Launching now.",
  },
  closingNote:
    "Always happy to talk product, photography, or what I'm building next.",
};
