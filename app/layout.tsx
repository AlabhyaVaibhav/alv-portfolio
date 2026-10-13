import type { Metadata } from "next";
import { Caveat, Instrument_Serif, JetBrains_Mono } from "next/font/google";
import { Mat } from "@/components/mat/Mat";
import "./globals.css";

const display = Instrument_Serif({
  variable: "--font-instrument-serif",
  subsets: ["latin"],
  weight: "400",
  style: ["normal", "italic"],
});

const mono = JetBrains_Mono({
  variable: "--font-jetbrains-mono",
  subsets: ["latin"],
});

const hand = Caveat({
  variable: "--font-caveat",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Alabhya Vaibhav",
  description: "Product manager at Itron. Photographer, side-project builder, and Bailey's driver.",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${display.variable} ${mono.variable} ${hand.variable}`}>
      <body className="bg-grain font-mono text-cream antialiased">
        <Mat />
        {children}
      </body>
    </html>
  );
}
