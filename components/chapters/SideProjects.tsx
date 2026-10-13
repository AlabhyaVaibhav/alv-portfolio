import { Chapter } from "@/components/mat/Chapter";
import { Piece } from "@/components/mat/Piece";
import { ProjectCarousel } from "@/components/projects/ProjectCarousel";
import { chapters } from "@/content/chapters";
import { projects } from "@/content/projects";
import { featuredFirst } from "@/lib/projectOrder";

export function SideProjects() {
  return (
    <Chapter meta={chapters[3]}>
      <Piece x={4} y={12} rotate={-0.6} from="bottom" enterAt={0.03} mobile={{ x: 4, y: 12 }}>
        <ProjectCarousel projects={featuredFirst(projects)} />
      </Piece>
    </Chapter>
  );
}
