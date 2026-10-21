"use client";

import { useEffect, useState } from "react";
import { FROM_FOLDER } from "./FolderLink";

function cameFromFolder(): boolean {
  if (typeof window === "undefined") return false;
  try {
    return sessionStorage.getItem(FROM_FOLDER) === "1";
  } catch {
    return false;
  }
}

// When a case study was opened through the folder animation, the screen is all paper at the hand-off.
// The page starts under that same paper and fades it away, so the two read as one motion.
// The flag only exists after a client-side folder transition, so the server render (no paper) and a
// direct visit agree.
export function PaperArrival() {
  const [covered, setCovered] = useState(cameFromFolder);

  useEffect(() => {
    if (!covered) return;
    try {
      sessionStorage.removeItem(FROM_FOLDER);
    } catch {}
    const frame = requestAnimationFrame(() => setCovered(false));
    return () => cancelAnimationFrame(frame);
  }, [covered]);

  return (
    <div
      aria-hidden
      className={`pointer-events-none fixed inset-0 z-[60] bg-paper transition-opacity duration-500 ease-out ${covered ? "opacity-100" : "opacity-0"}`}
    />
  );
}
