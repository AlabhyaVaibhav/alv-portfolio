import { Chapter } from "@/components/mat/Chapter";
import { Piece } from "@/components/mat/Piece";
import { KraftCard } from "@/components/paper/KraftCard";
import { StickyNote } from "@/components/paper/StickyNote";
import { chapters } from "@/content/chapters";
import { projects } from "@/content/projects";
import { featuredFirst, MAX_PROJECTS, projectSlotMobile, projectSlots } from "@/lib/projectSlots";

const EDGES = ["left", "top", "right", "bottom"] as const;

export function SideProjects() {
  const ordered = featuredFirst(projects);
  if (process.env.NODE_ENV !== "production" && ordered.length > MAX_PROJECTS) {
    console.warn(`SideProjects shows ${MAX_PROJECTS} of ${ordered.length} projects.`);
  }
  const slots = projectSlots(ordered.length);

  return (
    <Chapter meta={chapters[3]}>
      {slots.map((slot, i) => {
        const project = ordered[i];
        const mobile = projectSlotMobile(i);
        return (
          <Piece
            key={project.name}
            x={slot.x}
            y={slot.y}
            rotate={slot.rotate}
            from={EDGES[i % EDGES.length]}
            enterAt={0.13 + i * 0.03}
            mobile={mobile}
          >
            <KraftCard
              title={project.name}
              tag={project.kind === "client" ? "Client" : "Internal"}
              size={slot.size}
              href={project.link}
            >
              {project.blurb}
            </KraftCard>
          </Piece>
        );
      })}
      {slots.map((slot, i) => {
        const note = ordered[i].note;
        if (!note) return null;
        const mobile = projectSlotMobile(i);
        const width = slot.size === "lg" ? 26 : 16;
        return (
          <Piece
            key={`${ordered[i].name}-note`}
            x={Math.min(slot.x + width, 84)}
            y={Math.max(slot.y - 8, 8)}
            rotate={7}
            from="top"
            enterAt={0.26}
            mobile={{ x: mobile.x + 22, y: Math.max(mobile.y - 6, 6), rotate: 7, scale: 0.6 }}
          >
            <StickyNote>{note}</StickyNote>
          </Piece>
        );
      })}
    </Chapter>
  );
}
