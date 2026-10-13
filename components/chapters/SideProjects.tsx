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
            enterAt={0.03 + i * 0.03}
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
        // Tucked under the card's bottom-right corner, clear of the tag and the neighbouring cards.
        const inset = slot.size === "lg" ? 22 : 14;
        return (
          <Piece
            key={`${ordered[i].name}-note`}
            x={Math.min(slot.x + inset, 86)}
            y={Math.min(slot.y + 20, 72)}
            rotate={7}
            from="top"
            enterAt={0.16}
            mobile={{ x: Math.min(mobile.x + 46, 56), y: Math.min(mobile.y + 30, 80), rotate: 7, scale: 0.75 }}
          >
            <StickyNote>{note}</StickyNote>
          </Piece>
        );
      })}
    </Chapter>
  );
}
