import Image from "next/image";
import Link from "next/link";
import { FaGithub, FaLinkedinIn } from "react-icons/fa6";
import { LuArrowLeft, LuArrowRight, LuArrowUpRight, LuPlay } from "react-icons/lu";
import { getAdjacentProjects, type Project } from "@/data/projects";
import { cn, pad2 } from "@/lib/utils";
import { TechChip } from "@/components/ui/TechIcon";
import { BrowserFrame, ProjectCover } from "./ProjectCover";
import { ProjectGallery } from "./ProjectGallery";

/** Full case-study content. Shared by the intercepted modal and the standalone /projects/[slug] page. */
export function ProjectDetail({ project, variant }: { project: Project; variant: "modal" | "page" }) {
  const Heading = variant === "page" ? "h1" : "h2";
  const Sub = variant === "page" ? "h2" : "h3";
  const { prev, next } = getAdjacentProjects(project.slug);
  const { live, github, post, video } = project.links;
  const gallery = project.gallery ?? [];
  // A transparent device mockup makes the best hero; otherwise the cover sits in a browser frame.
  const heroDevice = gallery[0]?.kind === "device" ? gallery[0] : null;
  const screens = gallery.filter((g) => g !== heroDevice && (heroDevice !== null || g.src !== project.image));
  // Show the cover at its real proportions so wide screenshots aren't cropped.
  const coverShot = gallery.find((g) => g.src === project.image);
  const coverRatio = coverShot ? `${coverShot.width} / ${coverShot.height}` : "16 / 10";

  return (
    <article className="relative overflow-x-clip">
      <div
        aria-hidden
        className="pointer-events-none absolute -top-24 left-[30%] right-0 h-[560px]"
        style={{ background: `radial-gradient(closest-side, ${project.accent}26, transparent)` }}
      />

      <header className="relative">
        <p className="font-mono text-[11px] uppercase tracking-[0.3em]" style={{ color: project.accent }}>
          {project.categories.join(" · ")}
        </p>
        <Heading className="mt-4 font-display text-[clamp(2.6rem,6vw,5.2rem)] font-semibold leading-[0.95] tracking-[-0.02em] text-ink">
          {project.title}
        </Heading>
        <p className="mt-4 max-w-2xl font-display text-[clamp(1.2rem,2vw,1.6rem)] italic text-ink/75">{project.tagline}</p>

        <dl className="mt-10 grid grid-cols-2 gap-6 border-y border-line py-6 md:grid-cols-4">
          {[
            { k: "Role", v: project.role },
            { k: "Year", v: project.year },
            { k: "Status", v: project.status },
            { k: "Stack", v: `${project.stack.length} technologies` },
          ].map((m) => (
            <div key={m.k}>
              <dt className="font-mono text-[10px] uppercase tracking-[0.24em] text-dim">{m.k}</dt>
              <dd className="mt-1.5 text-sm text-ink">{m.v}</dd>
            </div>
          ))}
        </dl>

        {(live || github || post || video) && (
          <div className="mt-8 flex flex-wrap gap-3">
            {live && (
              <a
                href={live}
                target="_blank"
                rel="noopener noreferrer"
                className="group inline-flex items-center gap-2 rounded-full px-6 py-3 text-sm font-semibold text-white shadow-[0_10px_40px_-12px_var(--a)]"
                style={{ background: `linear-gradient(100deg, ${project.accent}, var(--color-violet-deep))`, ["--a" as string]: project.accent }}
              >
                Visit live site
                <LuArrowUpRight className="transition-transform duration-500 group-hover:rotate-45" />
              </a>
            )}
            {video && (
              <a
                href={video}
                target="_blank"
                rel="noopener noreferrer"
                className={cn(
                  "group inline-flex items-center gap-2.5 rounded-full px-6 py-3 text-sm font-semibold transition-colors",
                  live ? "border border-ink text-ink hover:bg-ink hover:text-paper" : "bg-ink text-paper hover:bg-violet",
                )}
              >
                <span className={cn("grid size-6 place-items-center rounded-full", live ? "bg-ink text-paper group-hover:bg-paper group-hover:text-ink" : "bg-paper text-ink")}>
                  <LuPlay className="size-3 translate-x-[1px]" />
                </span>
                Watch the demo
              </a>
            )}
            {github && (
              <a
                href={github}
                target="_blank"
                rel="noopener noreferrer"
                className="group inline-flex items-center gap-2 rounded-full border border-line-strong px-6 py-3 text-sm text-ink transition-colors hover:border-lilac hover:bg-ink/[0.04]"
              >
                <FaGithub /> Source code
                <LuArrowUpRight className="text-mist transition-transform duration-500 group-hover:rotate-45" />
              </a>
            )}
            {post && (
              <a
                href={post}
                target="_blank"
                rel="noopener noreferrer"
                className="group inline-flex items-center gap-2 rounded-full border border-line-strong px-6 py-3 text-sm text-ink transition-colors hover:border-lilac hover:bg-ink/[0.04]"
              >
                <FaLinkedinIn /> Read the LinkedIn post
                <LuArrowUpRight className="text-mist transition-transform duration-500 group-hover:rotate-45" />
              </a>
            )}
          </div>
        )}
      </header>

      {heroDevice ? (
        <div
          className="relative mt-12 overflow-hidden rounded-[28px] border border-line"
          style={{ background: `radial-gradient(70% 70% at 50% 35%, ${project.accent}26, transparent 75%), var(--color-paper-2)` }}
        >
          <Image
            src={heroDevice.src}
            alt={heroDevice.alt}
            width={heroDevice.width}
            height={heroDevice.height}
            preload={variant === "page"}
            sizes="(max-width: 1200px) 100vw, 1100px"
            className="mx-auto h-auto w-[94%] py-4 md:w-[86%]"
          />
        </div>
      ) : (
        <BrowserFrame url={live} className="relative mt-12">
          <div className="relative" style={{ aspectRatio: coverRatio }}>
            <ProjectCover
              project={project}
              className="h-full w-full"
              sizes="(max-width: 1200px) 100vw, 1100px"
              preload={variant === "page"}
              showTitle={!project.image}
            />
          </div>
        </BrowserFrame>
      )}

      {project.metrics && project.metrics.length > 0 && (
        <ul className={cn("mt-12 grid gap-4", project.metrics.length >= 3 ? "sm:grid-cols-3" : "sm:grid-cols-2")}>
          {project.metrics.map((m) => (
            <li key={m.label} className="rounded-2xl border border-line bg-ink/[0.02] p-6">
              <p className="font-display text-5xl text-ink">{m.value}</p>
              <p className="mt-2 font-mono text-[10px] uppercase tracking-[0.24em] text-mist">{m.label}</p>
            </li>
          ))}
        </ul>
      )}

      {screens.length > 0 && (
        <section className="mt-16" aria-label={`${project.title} screens`}>
          <div className="flex items-baseline justify-between gap-4">
            <Sub className="kicker">Screens</Sub>
            <span className="font-mono text-xs text-dim">{pad2(screens.length)} · click to zoom</span>
          </div>
          <ProjectGallery shots={screens} accent={project.accent} />
        </section>
      )}

      <div className="mt-16 grid gap-14 lg:grid-cols-12">
        <div className="lg:col-span-7">
          <Sub className="kicker">Overview</Sub>
          <div className="mt-5 space-y-5 text-lg leading-relaxed text-ink/85">
            {project.description.map((d) => (
              <p key={d}>{d}</p>
            ))}
          </div>

          <Sub className="kicker mt-14">What I built</Sub>
          <ol className="mt-6 space-y-4">
            {project.highlights.map((h, i) => (
              <li key={h} className="flex gap-5 rounded-2xl border border-line bg-ink/[0.015] p-5">
                <span className="font-mono text-xs" style={{ color: project.accent }}>
                  {pad2(i + 1)}
                </span>
                <span className="leading-relaxed text-ink/85">{h}</span>
              </li>
            ))}
          </ol>
        </div>

        <aside className="lg:col-span-5">
          <div className="space-y-10 lg:sticky lg:top-8">
            <div>
              <Sub className="kicker">Tech stack</Sub>
              <div className="mt-5 flex flex-wrap gap-2">
                {project.stack.map((t) => (
                  <TechChip key={t} name={t} />
                ))}
              </div>
            </div>
            <div className="rounded-2xl border border-line p-6">
              <Sub className="kicker">In one line</Sub>
              <p className="mt-4 leading-relaxed text-ink/85">{project.summary}</p>
            </div>
          </div>
        </aside>
      </div>

      <nav aria-label="More projects" className="mt-20 grid gap-4 border-t border-line pt-10 sm:grid-cols-2">
        {[
          { p: prev, dir: "Previous", Icon: LuArrowLeft },
          { p: next, dir: "Next", Icon: LuArrowRight },
        ].map(({ p, dir, Icon }) => (
          <Link
            key={dir}
            href={`/projects/${p.slug}`}
            scroll={variant === "page"}
            replace={variant === "modal"}
            className={cn(
              "group flex items-center gap-5 rounded-2xl border border-line p-5 transition-colors hover:border-lilac/50 hover:bg-ink/[0.02]",
              dir === "Next" && "sm:flex-row-reverse sm:text-right",
            )}
          >
            <span className="grid size-12 shrink-0 place-items-center rounded-full border border-line text-ink transition-colors group-hover:border-lilac group-hover:bg-violet/20">
              <Icon />
            </span>
            <span className="min-w-0">
              <span className="block font-mono text-[10px] uppercase tracking-[0.24em] text-dim">{dir} project</span>
              <span className="mt-1 block truncate font-display text-2xl text-ink">{p.title}</span>
            </span>
          </Link>
        ))}
      </nav>
    </article>
  );
}
