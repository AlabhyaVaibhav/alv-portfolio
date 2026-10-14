import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { CaseStudyPage } from "@/components/case/CaseStudyPage";
import { projects, type CasePage, type Project } from "@/content/projects";
import { featuredFirst } from "@/lib/projectOrder";
import { neighbours, pagedProjects, projectSlug } from "@/lib/projectPages";

type Params = { slug: string };

const pages = pagedProjects(featuredFirst(projects)) as (Project & { page: CasePage })[];

// Static export: one page per project that has a case study, and nothing else.
export const dynamicParams = false;

export function generateStaticParams(): Params[] {
  return pages.map((p) => ({ slug: projectSlug(p.name) }));
}

export async function generateMetadata({ params }: { params: Promise<Params> }): Promise<Metadata> {
  const { slug } = await params;
  const project = pages.find((p) => projectSlug(p.name) === slug);
  if (!project) return {};
  return { title: `${project.name} · Alabhya Vaibhav`, description: project.page.dek };
}

export default async function ProjectPage({ params }: { params: Promise<Params> }) {
  const { slug } = await params;
  const project = pages.find((p) => projectSlug(p.name) === slug);
  if (!project) notFound();
  const [previous, next] = neighbours(pages, slug);
  return <CaseStudyPage project={project} previous={previous} next={next} />;
}
