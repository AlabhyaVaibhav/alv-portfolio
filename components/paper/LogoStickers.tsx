import { ImageSticker } from "./ImageSticker";

// Company logo stickers for the Day job board: logos Alabhya supplied, cut out with a solid white
// die-cut backing (public/logos/).
const LOGOS = {
  itron: { src: "/logos/itron.webp", alt: "Itron logo sticker", width: 600, height: 291, className: "w-[24vw] md:w-[min(9vw,140px)]" },
  commerceiq: { src: "/logos/commerceiq.webp", alt: "CommerceIQ logo sticker", width: 600, height: 600, className: "w-[15vw] md:w-[min(5.5vw,88px)]" },
  soroco: { src: "/logos/soroco.webp", alt: "Soroco logo sticker", width: 600, height: 592, className: "w-[15vw] md:w-[min(5.5vw,88px)]" },
  quikr: { src: "/logos/quikr.webp", alt: "Quikr logo sticker", width: 600, height: 269, className: "w-[24vw] md:w-[min(8vw,125px)]" },
  mckinsey: { src: "/logos/mckinsey.webp", alt: "McKinsey & Company logo sticker", width: 600, height: 230, className: "w-[26vw] md:w-[min(9vw,140px)]" },
} as const;

export type LogoName = keyof typeof LOGOS;

export function LogoSticker({ name }: { name: LogoName }) {
  return <ImageSticker {...LOGOS[name]} />;
}
