export type Edge = "left" | "right" | "top" | "bottom";

export type PieceTrackInput = {
  from: Edge;
  enterAt: number;
  rotate: number;
  enter: boolean;
  exit: boolean;
};

export type Ease = "linear" | "in" | "out";

export type PieceTrack = {
  input: number[];
  x: number[];
  y: number[];
  rotate: number[];
  // One easing per segment (input.length - 1): entries ease out so pieces land quickly and settle,
  // exits ease in so pieces linger before being swept off.
  ease: Ease[];
};

export const ENTER_SPAN = 0.15;
export const EXIT_START = 0.8;

const OFF_STAGE = 110;
const ENTRY_OFFSET: Record<Edge, { x: number; y: number }> = {
  left: { x: -OFF_STAGE, y: 0 },
  right: { x: OFF_STAGE, y: 0 },
  top: { x: 0, y: -OFF_STAGE },
  bottom: { x: 0, y: OFF_STAGE },
};

// Keyframes for one piece across its chapter's scroll progress (0→1):
// slide on from `from`, hold at rest, then get swept off to the left.
export function pieceTrack({ from, enterAt, rotate, enter, exit }: PieceTrackInput): PieceTrack {
  const track: PieceTrack = { input: [], x: [], y: [], rotate: [], ease: [] };
  // `ease` applies to the segment that ends at this keyframe.
  const push = (t: number, x: number, y: number, r: number, ease: Ease = "linear") => {
    const last = track.input[track.input.length - 1];
    if (last !== undefined && t <= last) return;
    if (last !== undefined) track.ease.push(ease);
    track.input.push(t);
    track.x.push(x);
    track.y.push(y);
    track.rotate.push(r);
  };

  if (enter) {
    const start = Math.min(Math.max(enterAt, 0), EXIT_START - ENTER_SPAN);
    const off = ENTRY_OFFSET[from];
    const spin = from === "left" || from === "top" ? -18 : 18;
    push(0, off.x, off.y, rotate + spin);
    push(start, off.x, off.y, rotate + spin);
    push(start + ENTER_SPAN, 0, 0, rotate, "out");
  } else {
    push(0, 0, 0, rotate);
  }

  if (exit) {
    push(EXIT_START, 0, 0, rotate);
    push(1, -120, 8, rotate - 25, "in");
  } else {
    push(1, 0, 0, rotate);
  }
  return track;
}
