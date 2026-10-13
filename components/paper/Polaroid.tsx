import Image from "next/image";

type PolaroidProps = {
  src?: string;
  alt: string;
  caption?: string;
  onClick?: () => void;
  size?: "xs" | "sm" | "md";
  className?: string;
};

const WIDTH = {
  xs: "w-[25vw] md:w-[min(12vw,190px)]",
  sm: "w-[38vw] md:w-[min(13vw,190px)]",
  md: "w-[40vw] md:w-[min(16vw,230px)]",
};

const PAD = {
  xs: "p-1.5 pb-6 md:p-2 md:pb-8",
  sm: "p-2 pb-10",
  md: "p-2 pb-10",
};

export function Polaroid({ src, alt, caption, onClick, size = "md", className = "" }: PolaroidProps) {
  const frame = (
    <div className={`relative bg-paper ${PAD[size]} ${WIDTH[size]}`}>
      <div className="relative aspect-square w-full overflow-hidden bg-[#3b3a36]">
        {src ? (
          <Image src={src} alt={alt} fill sizes="230px" className="object-cover" />
        ) : (
          <span
            role="img"
            aria-label={alt}
            className="absolute inset-0 flex items-center justify-center bg-[repeating-linear-gradient(45deg,#4a4842_0_6px,#3b3a36_6px_12px)] font-mono text-[10px] uppercase tracking-[0.12em] text-cream/70"
          >
            photo soon
          </span>
        )}
      </div>
      {caption && (
        <p className="absolute bottom-1.5 left-0 right-0 text-center font-hand text-xl leading-none text-ink">{caption}</p>
      )}
    </div>
  );

  return (
    <div className={`drop-object ${className}`}>
      {onClick ? (
        <button
          type="button"
          onClick={onClick}
          aria-label={`Open ${alt}`}
          className="block cursor-zoom-in transition-transform hover:-translate-y-1"
        >
          {frame}
        </button>
      ) : (
        frame
      )}
    </div>
  );
}
