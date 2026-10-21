import type { StickerTone } from "@/components/paper/TextSticker";

// Stickers for the skills and kit on Alabhya's resume, plus the AI tools he builds with.
export type SkillSticker = { label: string; tone: StickerTone; shape?: "pill" | "rect" | "circle" };

export const aiTools: SkillSticker[] = [
  { label: "Claude", tone: "claude" },
  { label: "ChatGPT", tone: "chatgpt", shape: "rect" },
  { label: "replit", tone: "replit" },
  { label: "lovable", tone: "lovable" },
  { label: "Gemini", tone: "gemini" },
];

// From the resume's "Core competencies", shortened to fit a label.
export const competencies: SkillSticker[] = [
  { label: "product strategy", tone: "kraft", shape: "rect" },
  { label: "GenAI & LLMs", tone: "kraft", shape: "rect" },
  { label: "A/B testing", tone: "kraft", shape: "rect" },
  { label: "customer research", tone: "kraft", shape: "rect" },
  { label: "GTM", tone: "kraft", shape: "rect" },
  { label: "UX design", tone: "kraft", shape: "rect" },
];

// From the resume's "Technical competencies".
export const workTools: SkillSticker[] = [
  { label: "SQL", tone: "sql", shape: "circle" },
  { label: "Figma", tone: "figma" },
  { label: "Tableau", tone: "tableau", shape: "rect" },
  { label: "Jira", tone: "jira" },
  { label: "aws", tone: "aws", shape: "rect" },
];

// The camera kit. TODO(copy): confirm the Sony model ("ZV10": the ZV-E10 or the ZV-1?).
export const cameraKit: SkillSticker[] = [
  { label: "SONY ZV-E10", tone: "sony", shape: "rect" },
  { label: "iPhone", tone: "iphone" },
  { label: "Lr Lightroom", tone: "lightroom", shape: "rect" },
  { label: "VSCO", tone: "vsco", shape: "circle" },
  { label: "instax", tone: "instax" },
];
