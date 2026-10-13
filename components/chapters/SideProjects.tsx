import { Chapter } from "@/components/mat/Chapter";
import { Piece } from "@/components/mat/Piece";
import { KraftCard } from "@/components/paper/KraftCard";
import { StickyNote } from "@/components/paper/StickyNote";
import { chapters } from "@/content/chapters";
import { projects } from "@/content/projects";
import { featuredFirst, MAX_PROJECTS, noteSlot, projectSlots, projectSlotsMobile } from "@/lib/projectSlots";

const EDGES = ["left", "top", "right", "bottom"] as const;

export function SideProjects() {
  const ordered = featuredFirst(projects);
  if (process.env.NODE_ENV !== "production" && ordered.length > MAX_PROJECTS) {
    console.warn(`SideProjects shows ${MAX_PROJECTS} of ${ordered.length} projects.`);
  }
  const slots = projectSlots(ordered.length);
  const mobileSlots = projectSlotsMobile(ordered.length);
  const note = noteSlot(ordered.length);

  return (
    <Chapter meta={chapters[3]}>
      {slots.map((slot, i) => {
        const project = ordered[i];
        return (
          <Piece
            key={project.name}
            x={slot.x}
            y={slot.y}
            rotate={slot.rotate}
            from={EDGES[i % EDGES.length]}
            enterAt={0.03 + i * 0.03}
            mobile={mobileSlots[i]}
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
      {ordered[0]?.note && slots.length > 0 && (
        <Piece
          x={note.desktop.x}
          y={note.desktop.y}
          rotate={7}
          from="top"
          enterAt={0.16}
          mobile={{ ...note.mobile, rotate: 7 }}
        >
          <StickyNote>{ordered[0].note}</StickyNote>
        </Piece>
      )}
    </Chapter>
  );
}
