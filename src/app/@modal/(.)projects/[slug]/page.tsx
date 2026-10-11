import { notFound } from "next/navigation";
import { getProject, projects } from "@/data/projects";
import { ProjectDetail } from "@/components/project/ProjectDetail";
import { ProjectModal } from "@/components/project/ProjectModal";

export function generateStaticParams() {
  return projects.map((p) => ({ slug: p.slug }));
}

/** Client-side navigations to /projects/[slug] open here, as a modal over the current page. */
export default async function InterceptedProject({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const project = getProject(slug);
  if (!project) notFound();

  return (
    <ProjectModal title={project.title}>
      <ProjectDetail project={project} variant="modal" />
    </ProjectModal>
  );
}
