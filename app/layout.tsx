import type { Metadata } from "next";
import { Analytics } from "@vercel/analytics/next";
import { Caveat, Instrument_Sans, Instrument_Serif, JetBrains_Mono } from "next/font/google";
import { Mat } from "@/components/mat/Mat";
import "./globals.css";

const display = Instrument_Serif({
  variable: "--font-instrument-serif",
  subsets: ["latin"],
  weight: "400",
  style: ["normal", "italic"],
});

// Long-form reading (case-study pages): the sans sibling of the display serif.
const body = Instrument_Sans({
  variable: "--font-instrument-sans",
  subsets: ["latin"],
});

const mono = JetBrains_Mono({
  variable: "--font-jetbrains-mono",
  subsets: ["latin"],
});

const hand = Caveat({
  variable: "--font-caveat",
  subsets: ["latin"],
});

const description = "Product manager at Itron. Photographer, side-project builder, and Bailey's driver.";

// The share card itself is app/opengraph-image.png (and twitter-image.png); without one, link previews
// picked the first image on the page, a company logo.
export const metadata: Metadata = {
  metadataBase: new URL("https://offmydesk.lol"),
  title: "Alabhya Vaibhav",
  description,
  openGraph: {
    title: "Alabhya Vaibhav · off my desk",
    description,
    url: "/",
    siteName: "off my desk",
    type: "website",
  },
  twitter: { card: "summary_large_image", title: "Alabhya Vaibhav · off my desk", description },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${display.variable} ${body.variable} ${mono.variable} ${hand.variable}`}>
      <body className="bg-grain font-mono text-cream antialiased">
        <Mat />
        {children}
        <Analytics />
      </body>
    </html>
  );
}
