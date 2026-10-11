import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { LuArrowLeft } from "react-icons/lu";
import { getProject, projects } from "@/data/projects";
import { profile } from "@/data/profile";
import { absoluteUrl, metaDescription, site } from "@/lib/site";
import { ProjectDetail } from "@/components/project/ProjectDetail";
import { JsonLd } from "@/components/seo/JsonLd";

export function generateStaticParams() {
  return projects.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: PageProps<"/projects/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const project = getProject(slug);
  if (!project) return {};
  const title = `${project.title} — ${project.tagline}`;
  const description = metaDescription(project.summary);
  return {
    title,
    description,
    keywords: [project.title, ...project.categories, ...project.stack, "Hamza Kahloon"],
    alternates: { canonical: `/projects/${project.slug}` },
    openGraph: {
      type: "article",
      url: `/projects/${project.slug}`,
      title: `${title} · ${site.name}`,
      description,
      siteName: site.name,
      authors: [site.url],
    },
    twitter: { card: "summary_large_image", title: `${title} · ${site.name}`, description },
  };
}

/** Standalone, indexable case-study page (direct visits, refreshes and search engines land here). */
export default async function ProjectPage({ params }: PageProps<"/projects/[slug]">) {
  const { slug } = await params;
  const project = getProject(slug);
  if (!project) notFound();

  const url = absoluteUrl(`/projects/${project.slug}`);
  const jsonLd = [
    {
      "@context": "https://schema.org",
      "@type": "SoftwareApplication",
      name: project.title,
      description: project.summary,
      url,
      applicationCategory: "WebApplication",
      operatingSystem: "Web",
      keywords: project.stack.join(", "),
      ...(project.image ? { image: absoluteUrl(project.image) } : {}),
      ...(project.gallery?.length ? { screenshot: project.gallery.map((g) => absoluteUrl(g.src)) } : {}),
      ...(project.links.live ? { sameAs: [project.links.live] } : {}),
      ...(project.links.github ? { codeRepository: project.links.github } : {}),
      author: { "@type": "Person", name: profile.name, url: site.url },
      creator: { "@type": "Person", name: profile.name, url: site.url },
    },
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Home", item: site.url },
        { "@type": "ListItem", position: 2, name: "Projects", item: absoluteUrl("/#projects") },
        { "@type": "ListItem", position: 3, name: project.title, item: url },
      ],
    },
  ];

  return (
    <main className="container-x relative max-w-6xl pb-24 pt-32 md:pt-40">
      <nav aria-label="Breadcrumb" className="mb-12 flex flex-wrap items-center justify-between gap-4">
        <Link
          href="/#projects"
          className="group inline-flex items-center gap-3 rounded-full border border-line px-5 py-2.5 text-sm text-mist transition-colors hover:border-lilac hover:text-ink"
        >
          <LuArrowLeft className="transition-transform duration-500 group-hover:-translate-x-1" />
          All projects
        </Link>
        <ol className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.24em] text-dim">
          <li>
            <Link href="/" className="hover:text-ink">
              Home
            </Link>
          </li>
          <li aria-hidden>/</li>
          <li>
            <Link href="/#projects" className="hover:text-ink">
              Projects
            </Link>
          </li>
          <li aria-hidden>/</li>
          <li className="text-lilac" aria-current="page">
            {project.title}
          </li>
        </ol>
      </nav>
      <ProjectDetail project={project} variant="page" />
      <JsonLd data={jsonLd} />
    </main>
  );
}
