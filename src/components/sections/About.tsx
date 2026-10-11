"use client";

import Image from "next/image";
import { useEffect, useRef } from "react";
import { motion, useScroll, useSpring, useTransform, type MotionValue } from "motion/react";
import { LuArrowUpRight, LuAudioLines, LuBrainCircuit, LuGraduationCap, LuLayers } from "react-icons/lu";
import { journey, profile } from "@/data/profile";
import { scrollToTarget } from "@/lib/scroll";
import { pad2 } from "@/lib/utils";
import { Reveal } from "@/components/ui/Reveal";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Spotlight } from "@/components/ui/Spotlight";
import { Tilt } from "@/components/ui/Tilt";

const PILLAR_ICONS = { brain: LuBrainCircuit, layers: LuLayers, audio: LuAudioLines } as const;

export function About() {
  return (
    <section id="about" aria-labelledby="about-title" className="relative pt-32 md:pt-44">
      <div className="container-x grid grid-cols-1 gap-16 lg:grid-cols-12 lg:gap-12">
        <div className="lg:col-span-5">
          <div className="lg:sticky lg:top-28">
            <div id="about-title">
              <SectionHeading
                index="01"
                kicker="Journey"
                parts={["Code that", { text: "thinks.", className: "italic text-gradient" }]}
              />
            </div>

            <Reveal delay={0.1} className="mt-12 flex items-end gap-6">
              <Tilt className="relative w-[56%] max-w-[260px] rounded-[28px]" max={8}>
                <div className="relative aspect-[4/5] overflow-hidden rounded-[28px] border border-line bg-paper-3">
                  <Image
                    src={profile.headshot}
                    alt="Hamza Kahloon, Full Stack Developer and AI/ML Engineer"
                    fill
                    sizes="260px"
                    className="object-cover grayscale transition-[filter,transform] duration-700 group-hover/tilt:scale-105 group-hover/tilt:grayscale-0"
                  />
                  <div className="absolute inset-0 bg-linear-to-t from-paper/80 via-transparent to-transparent" />
                  <span className="absolute bottom-4 left-4 font-mono text-[9px] uppercase tracking-[0.28em] text-ink/80">Lahore · PK</span>
                </div>
                <Corner className="-left-2 -top-2" />
                <Corner className="-bottom-2 -right-2 rotate-180" />
              </Tilt>
              <div className="pb-2">
                <p className="font-script text-5xl leading-none text-lilac md:text-6xl">Hamza</p>
                <p className="mt-4 font-mono text-[10px] uppercase leading-[2] tracking-[0.3em] text-mist">
                  Still learning
                  <br />
                  Still building
                  <br />
                  Still shipping
                </p>
              </div>
            </Reveal>

            <Reveal delay={0.2} className="mt-10">
              <div className="glass flex items-start gap-4 rounded-2xl p-5">
                <span className="grid size-11 shrink-0 place-items-center rounded-xl border border-line bg-paper text-lilac">
                  <LuGraduationCap className="size-5" />
                </span>
                <div>
                  <p className="font-mono text-[10px] uppercase tracking-[0.24em] text-dim">Education · {profile.education.year}</p>
                  <p className="mt-1 font-display text-xl text-ink">{profile.education.degree}</p>
                  <p className="text-sm text-mist">
                    {profile.education.school} · {profile.education.grade}
                  </p>
                </div>
              </div>
            </Reveal>
          </div>
        </div>

        <div className="lg:col-span-7 lg:pt-36">
          <ScrollWords text={profile.about[0]} />
          <Reveal className="mt-10 max-w-2xl text-lg leading-relaxed text-mist">
            <p>{profile.about[1]}</p>
          </Reveal>

          <div className="mt-16 grid gap-4 md:grid-cols-3">
            {profile.pillars.map((p, i) => {
              const Icon = PILLAR_ICONS[p.icon];
              return (
                <Reveal key={p.title} delay={i * 0.08}>
                  <Spotlight className="h-full rounded-3xl border border-line bg-paper-2/80 p-6 transition-transform duration-500 hover:-translate-y-1.5">
                    <div className="flex items-center justify-between">
                      <span className="grid size-12 place-items-center rounded-2xl bg-linear-to-br from-violet/30 to-cyan/10 text-lilac ring-1 ring-ink/10">
                        <Icon className="size-5" />
                      </span>
                      <span className="font-mono text-xs text-dim">{pad2(i + 1)}</span>
                    </div>
                    <h3 className="mt-6 font-display text-2xl text-ink">{p.title}</h3>
                    <p className="mt-3 text-sm leading-relaxed text-mist">{p.text}</p>
                  </Spotlight>
                </Reveal>
              );
            })}
          </div>
        </div>
      </div>

      <JourneyTrack />
    </section>
  );
}

function Corner({ className }: { className?: string }) {
  return (
    <span aria-hidden className={`absolute size-6 border-l border-t border-lilac/70 ${className ?? ""}`} />
  );
}

function ScrollWords({ text }: { text: string }) {
  const ref = useRef<HTMLParagraphElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 85%", "end 50%"] });
  const words = text.split(" ");
  return (
    <p ref={ref} className="font-display text-[clamp(1.55rem,2.7vw,2.5rem)] leading-[1.3] text-ink">
      {words.map((w, i) => (
        <Word key={i} progress={scrollYProgress} range={[i / words.length, (i + 1) / words.length]}>
          {w}
        </Word>
      ))}
    </p>
  );
}

function Word({ children, progress, range }: { children: string; progress: MotionValue<number>; range: [number, number] }) {
  const opacity = useTransform(progress, range, [0.14, 1]);
  return (
    <>
      <motion.span style={{ opacity }}>{children}</motion.span>{" "}
    </>
  );
}

/** Desktop: vertical scroll drives a pinned horizontal timeline. Mobile: native swipe. */
function JourneyTrack() {
  const container = useRef<HTMLDivElement>(null);
  const track = useRef<HTMLOListElement>(null);
  const distance = useRef(0);
  const { scrollYProgress } = useScroll({ target: container, offset: ["start start", "end end"] });
  const x = useTransform(scrollYProgress, (p) => -p * distance.current);
  const progress = useSpring(scrollYProgress, { stiffness: 120, damping: 30 });

  useEffect(() => {
    const el = track.current;
    const box = container.current;
    if (!el || !box) return;
    const measure = () => {
      const desktop = window.matchMedia("(min-width: 1024px)").matches;
      distance.current = desktop ? Math.max(0, el.scrollWidth - window.innerWidth) : 0;
      box.style.height = desktop ? `${distance.current + window.innerHeight}px` : "";
    };
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    window.addEventListener("resize", measure);
    return () => {
      ro.disconnect();
      window.removeEventListener("resize", measure);
    };
  }, []);

  return (
    <div ref={container} className="relative mt-28 md:mt-40">
      <div className="lg:sticky lg:top-0 lg:flex lg:h-svh lg:flex-col lg:justify-center lg:overflow-hidden">
        <div className="container-x mb-8 flex items-end justify-between gap-6 lg:mb-12">
          <h3 className="font-display text-[clamp(2rem,4vw,3.6rem)] leading-none text-ink">
            The journey <span className="italic text-gradient">so far</span>
          </h3>
          <p className="hidden font-mono text-[10px] uppercase tracking-[0.3em] text-mist md:block">
            {journey[0].year} → {journey[journey.length - 1].year} · Keep scrolling
          </p>
        </div>

        <motion.ol
          ref={track}
          style={{ x }}
          className="flex snap-x snap-mandatory gap-5 overflow-x-auto px-[clamp(1rem,4vw,3.5rem)] pb-6 [scrollbar-width:none] lg:snap-none lg:overflow-visible lg:pb-0"
        >
          {journey.map((m, i) => (
            <li
              key={`${m.year}-${m.title}`}
              className="group relative w-[82vw] max-w-[400px] shrink-0 snap-start sm:w-[380px]"
            >
              <div className="relative mb-6 flex items-center">
                <span className="relative z-10 grid size-4 place-items-center rounded-full border border-lilac bg-paper transition-colors duration-500 group-hover:bg-lilac">
                  <span className="size-1.5 rounded-full bg-lilac" />
                </span>
                <span className="h-px flex-1 bg-linear-to-r from-lilac/60 to-line" />
              </div>
              <article className="relative h-full overflow-hidden rounded-3xl border border-line bg-paper-2/80 p-7 transition-[border-color,transform] duration-500 group-hover:-translate-y-2 group-hover:border-lilac/40">
                <span className="pointer-events-none absolute -right-4 -top-6 font-display text-[7.5rem] leading-none text-ink/[0.045] transition-colors duration-500 group-hover:text-violet/15">
                  {m.year}
                </span>
                <div className="flex items-center justify-between">
                  <span className="font-display text-4xl text-ink">{m.year}</span>
                  <span className="rounded-full border border-line px-3 py-1 font-mono text-[10px] uppercase tracking-[0.2em] text-lilac">
                    {m.tag}
                  </span>
                </div>
                <h4 className="mt-8 font-display text-2xl text-ink">{m.title}</h4>
                <p className="mt-3 text-sm leading-relaxed text-mist">{m.text}</p>
                <span className="mt-6 block font-mono text-[10px] text-dim">{pad2(i + 1)} / {pad2(journey.length)}</span>
              </article>
            </li>
          ))}
          <li className="flex w-[82vw] max-w-[400px] shrink-0 snap-start flex-col justify-center rounded-3xl border border-dashed border-line-strong p-8 sm:w-[380px]">
            <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-dim">Next chapter</p>
            <p className="mt-4 font-display text-3xl leading-tight text-ink">
              The next milestone could be <span className="italic text-gradient">ours.</span>
            </p>
            <button
              type="button"
              onClick={() => scrollToTarget("#contact")}
              className="group mt-8 inline-flex w-fit items-center gap-2 rounded-full border border-line-strong px-5 py-2.5 text-sm text-ink transition-colors hover:border-lilac"
            >
              Start a conversation
              <LuArrowUpRight className="transition-transform duration-500 group-hover:rotate-45" />
            </button>
          </li>
        </motion.ol>

        <div className="container-x mt-10 hidden lg:block">
          <div className="h-px w-full bg-line">
            <motion.div style={{ scaleX: progress }} className="h-px origin-left bg-linear-to-r from-violet to-cyan" />
          </div>
        </div>
      </div>
    </div>
  );
}
