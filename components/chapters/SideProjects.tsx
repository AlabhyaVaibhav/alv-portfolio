import { Chapter } from "@/components/mat/Chapter";
import { Piece } from "@/components/mat/Piece";
import { Scatter, type ScatterItem } from "@/components/mat/Scatter";
import { ProjectCarousel } from "@/components/projects/ProjectCarousel";
import { chapters } from "@/content/chapters";
import { projects } from "@/content/projects";
import { featuredFirst } from "@/lib/projectOrder";

// Planning artifacts peeking out from under the sheet.
const OBJECTS: ScatterItem[] = [
  { name: "kanban-mini-board", x: 52, y: -3, rotate: -4, from: "top", mobile: null },
  { name: "roadmap-strip", x: 6, y: 76, rotate: -3, from: "left", mobile: { x: 6, y: 78 } },
  { name: "prioritization-cards", x: 70, y: 77, rotate: 6, from: "right", mobile: null },
  { name: "pencil", x: 40, y: 88, rotate: -8, from: "bottom", mobile: null },
];

export function SideProjects() {
  return (
    <Chapter meta={chapters[3]}>
      <Scatter items={OBJECTS} />
      <Piece x={4} y={12} rotate={-0.6} from="bottom" enterAt={0.03} mobile={{ x: 4, y: 12 }}>
        <ProjectCarousel projects={featuredFirst(projects)} />
      </Piece>
    </Chapter>
  );
}
