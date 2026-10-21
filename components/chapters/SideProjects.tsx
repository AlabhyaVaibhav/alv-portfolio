import { Chapter } from "@/components/mat/Chapter";
import { Piece } from "@/components/mat/Piece";
import { Scatter, type ScatterItem } from "@/components/mat/Scatter";
import { ProjectCarousel } from "@/components/projects/ProjectCarousel";
import { chapters } from "@/content/chapters";
import { projects } from "@/content/projects";
import { featuredFirst } from "@/lib/projectOrder";

// Planning artifacts peeking out from under the sheet, out of focus so the carousel holds the eye. The bottom-right of the mat is kept clear for
// the carousel's "more projects this way" hint, which yellow chalk can't be read over paper.
const OBJECTS: ScatterItem[] = [
  { name: "kanban-mini-board", x: 52, y: -3, rotate: -4, from: "top", mobile: null },
  { name: "roadmap-strip", x: 6, y: 78, rotate: -3, from: "left", mobile: { x: 4, y: 92 } },
  { name: "prioritization-cards", x: 31, y: 0, rotate: -7, from: "top", mobile: null },
  { name: "pencil", x: 33, y: 90, rotate: -8, from: "bottom", mobile: null },
];

export function SideProjects() {
  return (
    <Chapter meta={chapters[3]}>
      <Scatter items={OBJECTS} blurred />
      <Piece x={4} y={12} rotate={-0.6} from="bottom" enterAt={0.03} mobile={{ x: 4, y: 12 }}>
        <ProjectCarousel projects={featuredFirst(projects)} />
      </Piece>
    </Chapter>
  );
}
