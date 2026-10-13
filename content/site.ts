export type SiteContent = {
  name: string;
  greeting: string;
  // The cover headline, one entry per line. The last word is set in italic.
  headline: string[];
  email: string;
  linkedinUrl: string;
  resumeHref: string;
  baileyNote: string;
  closingNote: string;
};

export const site: SiteContent = {
  name: "Alabhya Vaibhav",
  greeting: "Hi, I'm Alabhya",
  headline: ["An empathetic", "product designer", "who makes AI feel human"],
  email: "alabhya.vaibhav1997@gmail.com",
  linkedinUrl: "https://www.linkedin.com/in/alabhya-vaibhav/",
  resumeHref: "/resume.pdf",
  // TODO(copy): written in Bailey's voice.
  baileyNote: "Human works too much. I supervise. — B",
  closingNote:
    "Always happy to talk product, photography, or what I'm building next.",
};
