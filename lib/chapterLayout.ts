// Layout classes for a chapter. The static HTML is rendered without knowing the visitor's motion
// preference, so the reduced-motion layout comes from CSS (motion-reduce:) and is right on first paint.
export const SECTION_CLASS =
  "relative h-[160vh] motion-reduce:h-auto motion-reduce:min-h-[110vh] md:motion-reduce:min-h-screen";

export const STAGE_CLASS =
  "pointer-events-none fixed inset-0 motion-reduce:pointer-events-auto motion-reduce:relative motion-reduce:inset-auto motion-reduce:min-h-[110vh] md:motion-reduce:min-h-screen";

// Window of chapter progress in which the spread is on the mat (entries have landed, exit not
// yet underway). Outside it the stage is inert so keyboard and screen-reader focus can't land on
// pieces that are off-screen.
const INTERACTIVE_FROM = 0.2;
const INTERACTIVE_UNTIL = 0.85;

export function stageInteractive(progress: number, isFirst: boolean, isLast: boolean): boolean {
  const entered = isFirst || progress >= INTERACTIVE_FROM;
  const notLeaving = isLast || progress <= INTERACTIVE_UNTIL;
  return entered && notLeaving;
}
