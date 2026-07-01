import { Hero } from "@/components/sections/Hero";
import { About } from "@/components/sections/About";
import { Work } from "@/components/sections/Work";
import { Photography } from "@/components/sections/Photography";

export default function Home() {
  return (
    <main>
      <Hero />
      <About />
      <Work />
      <Photography />
    </main>
  );
}
