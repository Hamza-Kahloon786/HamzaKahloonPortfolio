"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import {
  AnimatePresence,
  motion,
  useAnimationFrame,
  useInView,
  useMotionValue,
  useMotionValueEvent,
  useSpring,
  useTransform,
  type MotionValue,
} from "motion/react";
import { LuArrowLeft, LuArrowRight, LuArrowUpRight } from "react-icons/lu";
import { categories, featuredProjects, projects, type Category, type Project } from "@/data/projects";
import { useFinePointer, useMediaQuery, useReducedMotion } from "@/lib/hooks";
import { cn, EASE, pad2 } from "@/lib/utils";
import { Reveal } from "@/components/ui/Reveal";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Portal } from "@/components/ui/Portal";
import { ProjectCover } from "@/components/project/ProjectCover";

const CARD_W = 380;
const CARD_H = 238;

export function Projects() {
  // The 3D ring is desktop-only; phones get the swipeable rail, so don't build the ring there.
  const desktop = useMediaQuery("(min-width: 768px)");
  return (
    <section id="projects" aria-labelledby="projects-title" className="relative overflow-hidden py-32 md:py-44">
      <div className="container-x">
        <div className="flex flex-col justify-between gap-10 lg:flex-row lg:items-end">
          <div id="projects-title">
            <SectionHeading
              index="04"
              kicker="Projects"
              parts={["Ideas, shipped as", { text: "real products.", className: "italic text-gradient" }]}
              intro="Drag the wall, click any screen, or browse the full index. Every project opens with the story, the stack and the links."
            />
          </div>
          <Reveal className="font-mono text-[10px] uppercase leading-[2.2] tracking-[0.32em] text-mist lg:pb-3 lg:text-right">
            <p>Ideas</p>
            <p>Interfaces</p>
            <p>Intelligence</p>
            <p className="text-ink">Real impact</p>
          </Reveal>
        </div>
      </div>

      {desktop && <ProjectRing items={featuredProjects} />}
      <MobileRail items={featuredProjects} />
      <ProjectIndex />
    </section>
  );
}

/* ───────────────────────── 3D ring ───────────────────────── */

const mod = (a: number, n: number) => ((a % n) + n) % n;

function ProjectRing({ items }: { items: Project[] }) {
  const n = items.length;
  const step = 360 / n;
  const radius = Math.round((CARD_W / 2 / Math.tan(Math.PI / n)) * 1.14);

  const stageRef = useRef<HTMLDivElement>(null);
  const rotation = useMotionValue(0);
  const smooth = useSpring(rotation, { stiffness: 55, damping: 18, mass: 1 });
  const inView = useInView(stageRef, { amount: 0.35 });
  const reduced = useReducedMotion();
  const [active, setActive] = useState(0);
  const hovering = useRef(false);
  const dragging = useRef(false);
  const dragged = useRef(false);

  useAnimationFrame((_, delta) => {
    if (!inView || reduced || hovering.current || dragging.current) return;
    rotation.set(rotation.get() - Math.min(delta, 50) * 0.0055);
  });

  useMotionValueEvent(smooth, "change", (v) => {
    const idx = mod(Math.round(-v / step), n);
    setActive((prev) => (prev === idx ? prev : idx));
  });

  const snap = (offset = 0) => rotation.set(Math.round(rotation.get() / step) * step + offset);
  const goTo = (i: number) => {
    const current = rotation.get();
    let target = -i * step;
    target += Math.round((current - target) / 360) * 360;
    rotation.set(target);
  };

  const onPointerDown = (e: React.PointerEvent) => {
    if (e.button !== 0) return;
    dragging.current = true;
    dragged.current = false;
    const startX = e.clientX;
    const startR = rotation.get();
    const move = (ev: PointerEvent) => {
      const dx = ev.clientX - startX;
      if (Math.abs(dx) > 6) dragged.current = true;
      rotation.set(startR + dx * 0.16);
    };
    const up = () => {
      dragging.current = false;
      snap();
      window.removeEventListener("pointermove", move);
      window.removeEventListener("pointerup", up);
    };
    window.addEventListener("pointermove", move);
    window.addEventListener("pointerup", up);
  };

  const current = items[active];

  return (
    <div className="relative mt-20 hidden md:block">
      {/* stage dressing */}
      <div aria-hidden className="pointer-events-none absolute inset-0">
        <div className="absolute left-1/2 top-0 h-[120%] w-[60%] -translate-x-1/2 bg-[conic-gradient(from_180deg_at_50%_0%,transparent_160deg,color-mix(in_oklab,var(--color-violet)_7%,transparent)_180deg,transparent_200deg)]" />
        <div className="absolute bottom-[14%] left-1/2 h-40 w-[70%] -translate-x-1/2 rounded-[50%] bg-violet/15 blur-[80px]" />
        <div className="absolute bottom-[10%] left-1/2 h-24 w-[46%] -translate-x-1/2 rounded-[50%] border border-lilac/25" />
        <div className="absolute bottom-[6%] left-1/2 h-36 w-[66%] -translate-x-1/2 rounded-[50%] border border-ink/[0.06]" />
      </div>

      <div
        ref={stageRef}
        role="region"
        aria-roledescription="carousel"
        aria-label="Featured projects"
        tabIndex={0}
        data-cursor="drag"
        onPointerDown={onPointerDown}
        onPointerEnter={() => (hovering.current = true)}
        onPointerLeave={() => (hovering.current = false)}
        onClickCapture={(e) => {
          if (dragged.current) {
            e.preventDefault();
            e.stopPropagation();
            dragged.current = false;
          }
        }}
        onKeyDown={(e) => {
          if (e.key === "ArrowLeft") snap(step);
          if (e.key === "ArrowRight") snap(-step);
        }}
        className="relative h-[540px] touch-pan-y select-none overflow-hidden outline-none [perspective:1700px] [perspective-origin:50%_38%]"
      >
        <div className="pointer-events-none absolute inset-0 [transform-style:preserve-3d]" style={{ transform: "rotateX(-5deg) translateY(-10px)" }}>
          <motion.div className="pointer-events-none absolute inset-0 [transform-style:preserve-3d]" style={{ z: -radius, rotateY: smooth }}>
            {items.map((p, i) => (
              <RingCard key={p.slug} project={p} index={i} angle={i * step} radius={radius} rotation={smooth} active={i === active} />
            ))}
          </motion.div>
        </div>
      </div>

      <div className="container-x relative -mt-4 grid grid-cols-[auto_1fr_auto] items-center gap-6">
        <RingButton label="Previous project" onClick={() => snap(step)}>
          <LuArrowLeft />
        </RingButton>
        <div className="min-h-[124px] text-center" aria-live="polite">
          <AnimatePresence mode="wait">
            <motion.div
              key={current.slug}
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -14 }}
              transition={{ duration: 0.45, ease: EASE }}
            >
              <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-mist">
                {pad2(active + 1)} / {pad2(n)} · {current.categories.join(" · ")}
              </p>
              <h3 className="mt-3 font-display text-4xl text-ink">{current.title}</h3>
              <p className="mt-2 text-mist">{current.tagline}</p>
            </motion.div>
          </AnimatePresence>
        </div>
        <RingButton label="Next project" onClick={() => snap(-step)}>
          <LuArrowRight />
        </RingButton>
      </div>

      <div className="mt-6 flex justify-center gap-0.5">
        {items.map((p, i) => (
          <button
            key={p.slug}
            type="button"
            onClick={() => goTo(i)}
            aria-label={`Show ${p.title}`}
            className="group grid h-6 min-w-6 place-items-center"
          >
            <span
              className={cn(
                "block h-1 rounded-full transition-all duration-500",
                i === active ? "w-8 bg-linear-to-r from-violet to-cyan" : "w-2 bg-ink/20 group-hover:bg-ink/50",
              )}
            />
          </button>
        ))}
      </div>
      <p className="mt-6 text-center">
        <Link
          href={`/projects/${current.slug}`}
          scroll={false}
          className="group inline-flex items-center gap-2 rounded-full border border-line-strong px-6 py-3 text-sm text-ink transition-colors hover:border-lilac hover:bg-ink/[0.04]"
        >
          Open {current.title}
          <LuArrowUpRight className="transition-transform duration-500 group-hover:rotate-45" />
        </Link>
      </p>
    </div>
  );
}

function RingCard({
  project,
  index,
  angle,
  radius,
  rotation,
  active,
}: {
  project: Project;
  index: number;
  angle: number;
  radius: number;
  rotation: MotionValue<number>;
  active: boolean;
}) {
  const opacity = useTransform(rotation, (r) => {
    const c = Math.cos(((angle + r) * Math.PI) / 180);
    return 0.12 + 0.88 * Math.max(0, (c + 0.25) / 1.25);
  });
  return (
    <div
      className="pointer-events-auto absolute left-1/2 top-1/2 [backface-visibility:hidden]"
      style={{
        width: CARD_W,
        height: CARD_H,
        marginLeft: -CARD_W / 2,
        marginTop: -CARD_H / 2,
        transform: `rotateY(${angle}deg) translateZ(${radius}px)`,
      }}
    >
      <motion.div style={{ opacity }} className="h-full w-full">
        <Link
          href={`/projects/${project.slug}`}
          scroll={false}
          draggable={false}
          onDragStart={(e) => e.preventDefault()}
          data-cursor="view"
          data-cursor-label="Open"
          aria-label={`${project.title} — ${project.tagline}`}
          tabIndex={active ? 0 : -1}
          className={cn(
            "group relative flex h-full w-full flex-col overflow-hidden rounded-xl border bg-white transition-[border-color,box-shadow] duration-500 [-webkit-box-reflect:below_10px_linear-gradient(transparent_70%,rgba(0,0,0,0.14))]",
            active ? "border-lilac/50 shadow-[0_24px_60px_-18px_color-mix(in_oklab,var(--color-violet)_55%,transparent)]" : "border-ink/10 shadow-[0_18px_40px_-22px_rgba(16,16,24,0.35)]",
          )}
        >
          <div className="relative flex-1 overflow-hidden">
            <div className="absolute inset-0 transition-transform duration-700 ease-[cubic-bezier(.16,1,.3,1)] group-hover:scale-105">
              <ProjectCover project={project} className="h-full w-full" sizes="380px" showTitle={false} />
            </div>
            <span className="absolute left-3 top-3 rounded-full bg-white/90 px-2.5 py-1 font-mono text-[9px] uppercase tracking-[0.2em] text-ink shadow-sm backdrop-blur">
              {pad2(index + 1)} · {project.categories[0]}
            </span>
          </div>
          <div className="flex items-center justify-between gap-3 border-t border-line bg-white px-4 py-3">
            <p className="truncate font-display text-[1.35rem] leading-tight text-ink">{project.title}</p>
            <span className="grid size-8 shrink-0 place-items-center rounded-full border border-line text-ink transition-all duration-500 group-hover:rotate-45 group-hover:border-violet group-hover:bg-violet group-hover:text-white">
              <LuArrowUpRight />
            </span>
          </div>
        </Link>
      </motion.div>
    </div>
  );
}

function RingButton({ children, label, onClick }: { children: React.ReactNode; label: string; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      className="grid size-14 place-items-center rounded-full border border-line-strong text-ink transition-all duration-300 hover:scale-105 hover:border-lilac hover:bg-violet/20"
    >
      {children}
    </button>
  );
}

/* ───────────────────────── Mobile rail ───────────────────────── */

function MobileRail({ items }: { items: Project[] }) {
  return (
    <ul className="mt-14 flex snap-x snap-mandatory gap-4 overflow-x-auto px-4 pb-4 [scrollbar-width:none] md:hidden">
      {items.map((p, i) => (
        <li key={p.slug} className="w-[82vw] shrink-0 snap-center">
          <Link href={`/projects/${p.slug}`} scroll={false} className="block overflow-hidden rounded-2xl border border-line bg-paper-2">
            <ProjectCover project={p} className="aspect-[16/10]" sizes="82vw" showTitle={false} />
            <div className="p-5">
              <p className="font-mono text-[10px] uppercase tracking-[0.24em] text-lilac">
                {pad2(i + 1)} · {p.categories[0]}
              </p>
              <p className="mt-2 font-display text-2xl text-ink">{p.title}</p>
              <p className="mt-1 text-sm text-mist">{p.tagline}</p>
            </div>
          </Link>
        </li>
      ))}
    </ul>
  );
}

/* ───────────────────────── Index ───────────────────────── */

function ProjectIndex() {
  const [filter, setFilter] = useState<Category | "All">("All");
  const [hovered, setHovered] = useState<Project | null>(null);
  const fine = useFinePointer();
  const list = filter === "All" ? projects : projects.filter((p) => p.categories.includes(filter));
  const counts = Object.fromEntries(categories.map((c) => [c, projects.filter((p) => p.categories.includes(c)).length]));

  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const sx = useSpring(x, { stiffness: 160, damping: 22, mass: 0.6 });
  const sy = useSpring(y, { stiffness: 160, damping: 22, mass: 0.6 });

  useEffect(() => {
    if (!fine) return;
    const move = (e: PointerEvent) => {
      x.set(e.clientX);
      y.set(e.clientY);
    };
    window.addEventListener("pointermove", move, { passive: true });
    return () => window.removeEventListener("pointermove", move);
  }, [fine, x, y]);

  return (
    <div className="container-x mt-32">
      <div className="flex flex-col gap-6 border-b border-line pb-8 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="kicker">Full index</p>
          <h3 className="mt-3 font-display text-[clamp(2rem,4vw,3.4rem)] leading-none text-ink">
            All projects <span className="font-mono text-base text-lilac align-top">({projects.length})</span>
          </h3>
        </div>
        <div role="tablist" aria-label="Filter projects" className="flex flex-wrap gap-2">
          {(["All", ...categories] as const).map((c) => {
            const isActive = filter === c;
            return (
              <button
                key={c}
                role="tab"
                aria-selected={isActive}
                type="button"
                onClick={() => setFilter(c)}
                className={cn(
                  "relative rounded-full px-4 py-2 text-xs transition-colors duration-300",
                  isActive ? "text-white" : "text-mist hover:text-ink",
                )}
              >
                {isActive && (
                  <motion.span
                    layoutId="filter-pill"
                    className="absolute inset-0 rounded-full bg-linear-to-r from-violet-deep to-violet"
                    transition={{ type: "spring", stiffness: 380, damping: 32 }}
                  />
                )}
                <span className="relative">
                  {c}
                  <span className="ml-1.5 font-mono text-[10px] opacity-60">{c === "All" ? projects.length : counts[c]}</span>
                </span>
              </button>
            );
          })}
        </div>
      </div>

      <motion.ul layout className="relative" onPointerLeave={() => setHovered(null)}>
        <AnimatePresence mode="popLayout" initial={false}>
          {list.map((p) => (
            <motion.li
              key={p.slug}
              layout
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.98 }}
              transition={{ duration: 0.45, ease: EASE }}
              className="border-b border-line"
            >
              <Link
                href={`/projects/${p.slug}`}
                scroll={false}
                onPointerEnter={() => setHovered(p)}
                data-cursor="view"
                data-cursor-label="Open"
                className="group relative grid grid-cols-[2.5rem_1fr_auto] items-center gap-4 overflow-hidden py-6 md:grid-cols-[4rem_1.4fr_1fr_6rem_3rem] md:py-8"
              >
                <span
                  aria-hidden
                  className="absolute inset-0 origin-bottom scale-y-0 transition-transform duration-500 ease-[cubic-bezier(.16,1,.3,1)] group-hover:scale-y-100"
                  style={{ background: `linear-gradient(90deg, ${p.accent}1f, transparent 70%)` }}
                />
                <span className="relative font-mono text-xs text-dim transition-colors group-hover:text-lilac">
                  {pad2(projects.indexOf(p) + 1)}
                </span>
                <span className="relative min-w-0 transition-transform duration-500 ease-[cubic-bezier(.16,1,.3,1)] group-hover:translate-x-3">
                  <span className="block truncate font-display text-[clamp(1.5rem,3vw,2.6rem)] leading-tight text-ink">{p.title}</span>
                  <span className="mt-1 block truncate text-sm text-mist">{p.tagline}</span>
                </span>
                <span className="relative hidden flex-wrap gap-1.5 md:flex">
                  {p.categories.slice(0, 2).map((c) => (
                    <span key={c} className="rounded-full border border-line px-2.5 py-1 font-mono text-[10px] uppercase tracking-[0.14em] text-mist">
                      {c}
                    </span>
                  ))}
                  {p.links.video && (
                    <span className="inline-flex items-center gap-1 rounded-full bg-ink px-2.5 py-1 font-mono text-[10px] font-semibold uppercase tracking-[0.14em] text-paper">
                      ▶ Demo
                    </span>
                  )}
                </span>
                <span className="relative hidden font-mono text-xs text-mist md:block">{p.year}</span>
                <span className="relative grid size-10 place-items-center justify-self-end rounded-full border border-line text-mist transition-all duration-500 group-hover:rotate-45 group-hover:border-lilac group-hover:bg-violet group-hover:text-white">
                  <LuArrowUpRight />
                </span>
              </Link>
            </motion.li>
          ))}
        </AnimatePresence>
      </motion.ul>

      <Portal>
        {fine && (
          <motion.div aria-hidden className="pointer-events-none fixed left-0 top-0 z-30" style={{ x: sx, y: sy }}>
            <AnimatePresence>
              {hovered && (
                <motion.div
                  key={hovered.slug}
                  initial={{ opacity: 0, scale: 0.85, rotate: -4 }}
                  animate={{ opacity: 1, scale: 1, rotate: 0 }}
                  exit={{ opacity: 0, scale: 0.9, rotate: 3 }}
                  transition={{ duration: 0.35, ease: EASE }}
                  className="absolute left-8 top-[-110px] w-[340px] overflow-hidden rounded-xl border border-ink/15 shadow-[0_30px_80px_-20px_rgba(16,16,24,0.22)]"
                  style={{ boxShadow: `0 0 50px -12px ${hovered.accent}` }}
                >
                  <ProjectCover project={hovered} className="aspect-[16/10]" sizes="340px" />
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        )}
      </Portal>
    </div>
  );
}
