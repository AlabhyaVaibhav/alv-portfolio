import { Camera } from "@/components/chapters/Camera";
import { Cover } from "@/components/chapters/Cover";
import { DayJob } from "@/components/chapters/DayJob";

export default function Home() {
  return (
    <main className="relative z-[1]">
      <Cover />
      <DayJob />
      <Camera />
    </main>
  );
}
