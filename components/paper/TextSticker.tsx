import { STICKER_LIFT } from "./ImageSticker";

// Text stickers in a tool's or skill's signature colours: a white kiss-cut border around a printed
// face. No brand logos, just names and colours.
export const STICKER_TONES = {
  // AI tools
  claude: { face: "bg-[#d97757] text-white font-display italic", mark: "✳" },
  chatgpt: { face: "bg-[#111111] text-white font-body font-semibold" },
  replit: { face: "bg-[#f26207] text-white font-body font-bold lowercase" },
  lovable: { face: "bg-[linear-gradient(135deg,#ff4f8b,#ff8a3d)] text-white font-body font-bold lowercase", mark: "♥" },
  gemini: { face: "bg-[linear-gradient(135deg,#4285f4,#9b72cb)] text-white font-body font-semibold", mark: "✦" },
  // Work tools
  sql: { face: "bg-[#ffd23f] text-ink font-mono font-bold" },
  figma: { face: "bg-[#1e1e1e] text-white font-body font-semibold" },
  tableau: { face: "bg-[#1f4e9c] text-white font-body font-semibold" },
  jira: { face: "bg-[#0052cc] text-white font-body font-bold" },
  aws: { face: "bg-[#232f3e] text-[#ff9900] font-body font-black lowercase" },
  // Camera kit
  sony: { face: "bg-[#111111] text-white font-body font-bold tracking-[0.08em]" },
  iphone: { face: "bg-[#f5f5f7] text-ink font-body font-semibold" },
  lightroom: { face: "bg-[#001e36] text-[#31a8ff] font-body font-bold" },
  vsco: { face: "bg-black text-white font-body font-black tracking-[0.2em]" },
  instax: { face: "bg-[#bfe6d8] text-ink font-body font-bold lowercase" },
  // Skills
  kraft: { face: "paper-kraft text-kraft-ink font-mono uppercase tracking-[0.1em]" },
} as const;

export type StickerTone = keyof typeof STICKER_TONES;

type TextStickerProps = {
  label: string;
  tone: StickerTone;
  shape?: "pill" | "rect" | "circle";
  // Text size classes; the sticker grows to fit.
  size?: string;
  className?: string;
};

export function TextSticker({ label, tone, shape = "pill", size = "text-[15px] md:text-[17px]", className = "" }: TextStickerProps) {
  const { face, ...rest } = STICKER_TONES[tone];
  const mark = "mark" in rest ? rest.mark : undefined;
  const round = shape === "circle" ? "rounded-full" : shape === "pill" ? "rounded-full" : "rounded-[8px]";
  const facePad = shape === "circle" ? "flex aspect-square items-center justify-center p-3" : "px-3.5 py-1.5";
  return (
    <div
      role="img"
      aria-label={`${label} sticker`}
      className={`inline-block bg-white p-[4px] shadow-[0_1px_1px_rgba(0,0,0,0.25),0_5px_10px_rgba(0,0,0,0.28)] ${round} ${STICKER_LIFT} ${className}`}
    >
      <div className={`whitespace-nowrap leading-none ${round} ${facePad} ${face} ${size}`}>
        {mark && <span className="mr-1.5 not-italic">{mark}</span>}
        {label}
      </div>
    </div>
  );
}
