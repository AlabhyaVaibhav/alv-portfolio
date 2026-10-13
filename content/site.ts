export type SiteContent = {
  name: string;
  greeting: string;
  // The cover headline, one entry per line. The last word is set in italic.
  headline: string[];
  todoTitle: string;
  todo: string[];
  email: string;
  linkedinUrl: string;
  resumeHref: string;
  baileyNote: string;
  closingNote: string;
};

export const site: SiteContent = {
  name: "Alabhya Vaibhav",
  greeting: "hi, i'm alabhya.",
  headline: ["i solve complex problems", "and make the answer", "feel simple."],
  // TODO(copy): the to-do sticky in the Bailey chapter.
  todoTitle: "today",
  todo: ["walk bailey", "sunday drive", "edit photos", "ship twine"],
  email: "alabhya.vaibhav1997@gmail.com",
  linkedinUrl: "https://www.linkedin.com/in/alabhya-vaibhav/",
  resumeHref: "/resume.pdf",
  // TODO(copy): written in Bailey's voice.
  baileyNote: "Human works too much. I supervise. — B",
  closingNote:
    "Always happy to talk product, photography, or what I'm building next.",
};
