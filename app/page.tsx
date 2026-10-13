import { Bailey } from "@/components/chapters/Bailey";
import { Camera } from "@/components/chapters/Camera";
import { Cover } from "@/components/chapters/Cover";
import { DayJob } from "@/components/chapters/DayJob";
import { SayHi } from "@/components/chapters/SayHi";
import { SideProjects } from "@/components/chapters/SideProjects";
import { ChapterNav } from "@/components/mat/ChapterNav";

export default function Home() {
  return (
    <>
      <main className="relative z-[1]">
        <Cover />
        <DayJob />
        <Camera />
        <SideProjects />
        <Bailey />
        <SayHi />
      </main>
      <ChapterNav />
    </>
  );
}
