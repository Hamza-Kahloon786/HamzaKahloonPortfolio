"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { AnimatePresence, motion, useMotionValue, useSpring, useTransform, type MotionValue } from "motion/react";
import { LuArrowDownRight, LuArrowUpRight, LuDownload, LuMic } from "react-icons/lu";
import { profile } from "@/data/profile";
import { useIntroDone } from "@/lib/intro";
import { scrollToTarget } from "@/lib/scroll";
import { EASE } from "@/lib/utils";
import { Counter } from "@/components/ui/Counter";
import { Magnetic } from "@/components/ui/Magnetic";
import { SplitText } from "@/components/ui/Reveal";
import { TechIcon } from "@/components/ui/TechIcon";
import { NeuralCanvas } from "./NeuralCanvas";
import { openAssistant } from "@/components/assistant/Assistant";

const ORBIT = [
  { name: "OpenAI", label: "LLMs", x: "-4%", y: "30%", depth: 34, delay: 0 },
  { name: "LangChain", label: "Agents", x: "64%", y: "5%", depth: 26, delay: 1.2 },
  { name: "Twilio", label: "Voice AI", x: "80%", y: "42%", depth: 40, delay: 0.6 },
  { name: "Next.js", label: "Next.js", x: "-10%", y: "60%", depth: 22, delay: 1.8 },
  { name: "Python", label: "Python", x: "74%", y: "80%", depth: 30, delay: 2.4 },
];

export function Hero({ hasResume, assistant }: { hasResume: boolean; assistant: boolean }) {
  const ready = useIntroDone();
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const sx = useSpring(mx, { stiffness: 60, damping: 18 });
  const sy = useSpring(my, { stiffness: 60, damping: 18 });

  return (
    <section
      id="home"
      aria-label="Introduction"
      className="relative isolate min-h-svh overflow-hidden"
      onPointerMove={(e) => {
        if (e.pointerType !== "mouse") return;
        mx.set((e.clientX / window.innerWidth) * 2 - 1);
        my.set((e.clientY / window.innerHeight) * 2 - 1);
      }}
    >
      <div className="absolute inset-0 -z-10">
        <NeuralCanvas className="absolute inset-0 opacity-80" />
        <div className="grid-lines absolute inset-0 opacity-50 [mask-image:radial-gradient(ellipse_at_center,#000_30%,transparent_75%)]" />
        <div className="absolute right-[-10%] top-[10%] h-[70vmin] w-[70vmin] rounded-full bg-violet/25 blur-[140px]" />
        <div className="absolute bottom-[-20%] left-[-10%] h-[50vmin] w-[50vmin] rounded-full bg-cyan/10 blur-[140px]" />
        <div className="absolute inset-x-0 bottom-0 h-48 bg-linear-to-b from-transparent to-paper" />
      </div>

      <div className="container-x relative grid min-h-svh grid-cols-1 items-center gap-10 pb-36 pt-28 lg:grid-cols-12 lg:pb-28">
        <div className="relative z-10 lg:col-span-7">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={ready ? { opacity: 1, y: 0 } : undefined}
            transition={{ duration: 0.9, ease: EASE }}
            className="hero-instant mb-8 inline-flex items-center gap-3 rounded-full border border-line bg-ink/[0.03] py-1.5 pl-2 pr-4 backdrop-blur"
          >
            <span className="relative grid size-5 place-items-center">
              <span className="absolute size-2 animate-pulse-ring rounded-full bg-emerald-400" />
              <span className="size-2 rounded-full bg-emerald-400" />
            </span>
            <span className="font-mono text-[11px] font-semibold uppercase tracking-[0.18em] text-ink/75">
              {profile.availability.split(" & ")[0]} · {profile.location}
            </span>
          </motion.div>

          <h1 className="hero-instant-all font-display font-semibold leading-[0.86] tracking-[-0.035em]">
            <span className="sr-only">
              {profile.name} — {profile.title}
            </span>
            <SplitText
              as="span"
              parts={[profile.firstName]}
              play={ready}
              delay={0.05}
              className="block text-[clamp(4.2rem,11vw,10.5rem)] text-ink"
            />
            <SplitText
              as="span"
              parts={[{ text: profile.lastName, className: "italic text-gradient pr-[0.08em]" }]}
              play={ready}
              delay={0.18}
              className="block text-[clamp(4.2rem,11vw,10.5rem)]"
            />
          </h1>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={ready ? { opacity: 1, y: 0 } : undefined}
            transition={{ duration: 1, ease: EASE, delay: 0.45 }}
            className="hero-instant mt-8 flex flex-wrap items-baseline gap-x-3 font-display text-[clamp(1.4rem,2.6vw,2.2rem)] text-ink/90"
          >
            <span>I build</span>
            <RotatingWord words={profile.builds} />
          </motion.div>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={ready ? { opacity: 1, y: 0 } : undefined}
            transition={{ duration: 1, ease: EASE, delay: 0.55 }}
            className="hero-instant mt-6 max-w-xl text-base leading-relaxed text-mist md:text-lg"
          >
            {profile.intro}
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={ready ? { opacity: 1, y: 0 } : undefined}
            transition={{ duration: 1, ease: EASE, delay: 0.65 }}
            className="hero-instant mt-10 flex flex-wrap items-center gap-4"
          >
            <Magnetic>
              <a
                href="#projects"
                onClick={(e) => {
                  e.preventDefault();
                  scrollToTarget("#projects");
                }}
                className="group relative inline-flex items-center gap-3 overflow-hidden rounded-full bg-linear-to-r from-violet-deep via-violet to-lilac px-7 py-4 text-sm font-semibold text-white shadow-[0_10px_40px_-10px_color-mix(in_oklab,var(--color-violet)_80%,transparent)]"
              >
                <span className="absolute inset-0 -translate-x-full bg-linear-to-r from-transparent via-ink/25 to-transparent transition-transform duration-1000 group-hover:translate-x-full" />
                Explore my work
                <LuArrowDownRight className="size-4 transition-transform duration-500 group-hover:rotate-[-45deg]" />
              </a>
            </Magnetic>
            {hasResume ? (
              <Magnetic>
                <a
                  href={profile.resume}
                  download="Hamza-Kahloon-Resume.pdf"
                  className="group inline-flex items-center gap-3 rounded-full border border-line-strong px-7 py-4 text-sm font-semibold text-ink transition-colors hover:border-lilac hover:bg-ink/[0.04]"
                >
                  Download résumé
                  <LuDownload className="size-4 transition-transform duration-500 group-hover:translate-y-0.5" />
                </a>
              </Magnetic>
            ) : (
              <Magnetic>
                <a
                  href="#contact"
                  onClick={(e) => {
                    e.preventDefault();
                    scrollToTarget("#contact");
                  }}
                  className="group inline-flex items-center gap-3 rounded-full border border-line-strong px-7 py-4 text-sm font-semibold text-ink transition-colors hover:border-lilac hover:bg-ink/[0.04]"
                >
                  Let&apos;s talk
                  <LuArrowUpRight className="size-4 transition-transform duration-500 group-hover:rotate-45" />
                </a>
              </Magnetic>
            )}
          </motion.div>

          {assistant && (
            <motion.button
              type="button"
              onClick={() => openAssistant("voice")}
              data-assistant-trigger=""
              initial={{ opacity: 0, y: 16 }}
              animate={ready ? { opacity: 1, y: 0 } : undefined}
              transition={{ duration: 1, ease: EASE, delay: 0.8 }}
              className="hero-instant group mt-6 inline-flex items-center gap-3 rounded-full py-1.5 pl-1.5 pr-4 text-sm font-semibold text-ink transition-colors hover:bg-ink/[0.04]"
            >
              <span className="relative grid size-9 place-items-center">
                <span className="absolute inset-0 animate-pulse-ring rounded-full bg-violet/50" />
                <span className="relative grid size-9 place-items-center rounded-full bg-linear-to-br from-violet to-cyan text-white">
                  <LuMic className="size-4" />
                </span>
              </span>
              <span>
                Ask my AI by voice
                <span className="ml-2 font-normal text-mist">— it knows every project</span>
              </span>
            </motion.button>
          )}
        </div>

        <Portrait ready={ready} sx={sx} sy={sy} />
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={ready ? { opacity: 1 } : undefined}
        transition={{ duration: 1.2, delay: 0.9 }}
        className="hero-instant absolute inset-x-0 bottom-0 z-10 border-t border-line bg-paper/40 backdrop-blur-md"
      >
        <div className="container-x flex items-center justify-between gap-6 py-5">
          <dl className="grid flex-1 grid-cols-2 gap-x-6 gap-y-3 sm:grid-cols-4 lg:max-w-3xl">
            {profile.stats.map((s) => (
              <div key={s.label} className="flex flex-col">
                <dt className="order-2 font-mono text-[10px] uppercase tracking-[0.2em] text-dim">{s.label}</dt>
                <dd className="order-1 font-display text-2xl text-ink md:text-3xl">
                  <Counter value={s.value} suffix={s.suffix} start={ready} />
                </dd>
              </div>
            ))}
          </dl>
          <button
            type="button"
            onClick={() => scrollToTarget("#about")}
            className="hidden items-center gap-4 font-mono text-[10px] uppercase tracking-[0.3em] text-mist transition-colors hover:text-ink md:flex"
          >
            Scroll to explore
            <span className="relative h-12 w-px overflow-hidden bg-line">
              <span className="absolute inset-0 animate-scroll-line bg-lilac" />
            </span>
          </button>
        </div>
      </motion.div>
    </section>
  );
}

function RotatingWord({ words }: { words: readonly string[] }) {
  const [i, setI] = useState(0);
  useEffect(() => {
    const id = setInterval(() => setI((v) => (v + 1) % words.length), 2600);
    return () => clearInterval(id);
  }, [words.length]);
  return (
    <span className="relative inline-flex h-[1.25em] min-w-[10ch] overflow-hidden align-bottom">
      <AnimatePresence mode="popLayout" initial={false}>
        <motion.span
          key={words[i]}
          initial={{ y: "100%", opacity: 0, filter: "blur(6px)" }}
          animate={{ y: "0%", opacity: 1, filter: "blur(0px)" }}
          exit={{ y: "-100%", opacity: 0, filter: "blur(6px)" }}
          transition={{ duration: 0.75, ease: EASE }}
          className="italic text-gradient whitespace-nowrap pr-2"
        >
          {words[i]}
        </motion.span>
      </AnimatePresence>
    </span>
  );
}

function useDepth(v: MotionValue<number>, depth: number) {
  return useTransform(v, (n) => n * depth);
}

function Portrait({ ready, sx, sy }: { ready: boolean; sx: MotionValue<number>; sy: MotionValue<number> }) {
  const px = useDepth(sx, -14);
  const py = useDepth(sy, -10);
  const rx = useDepth(sx, 22);
  const ry = useDepth(sy, 16);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.94, y: 40 }}
      animate={ready ? { opacity: 1, scale: 1, y: 0 } : undefined}
      transition={{ duration: 1.4, ease: EASE, delay: 0.2 }}
      className="hero-instant relative mx-auto aspect-[4/5] w-full max-w-[460px] lg:col-span-5 lg:max-w-none"
    >
      {/* rings */}
      <motion.div style={{ x: rx, y: ry }} className="absolute inset-0 grid place-items-center">
        <svg viewBox="0 0 400 400" className="absolute size-[92%] animate-spin-slow opacity-60" aria-hidden>
          <circle cx="200" cy="200" r="196" fill="none" stroke="url(#ringGrad)" strokeWidth="0.8" strokeDasharray="2 10" />
          <defs>
            <linearGradient id="ringGrad" x1="0" x2="1">
              <stop offset="0" style={{ stopColor: "var(--color-violet)" }} />
              <stop offset="1" style={{ stopColor: "var(--color-cyan)" }} />
            </linearGradient>
          </defs>
        </svg>
        <svg viewBox="0 0 400 400" className="absolute size-[70%] animate-spin-slower opacity-50" aria-hidden>
          <circle cx="200" cy="200" r="196" fill="none" style={{ stroke: "var(--color-violet)" }} strokeWidth="0.6" strokeDasharray="60 18 4 18" />
        </svg>
        <div className="absolute size-[66%] rounded-full bg-[radial-gradient(circle,color-mix(in_oklab,var(--color-violet)_40%,transparent),color-mix(in_oklab,var(--color-cyan)_22%,transparent)_50%,transparent_70%)] blur-2xl" />
      </motion.div>

      {/* portrait */}
      <motion.div style={{ x: px, y: py }} className="absolute inset-x-[8%] bottom-0 top-[4%]">
        <Image
          src={profile.cutout}
          alt="Portrait of Hamza Kahloon"
          fill
          preload
          sizes="(max-width: 1024px) 80vw, 460px"
          className="object-contain object-bottom [filter:drop-shadow(0_24px_40px_color-mix(in_oklab,var(--color-violet-deep)_25%,transparent))_contrast(1.03)] [mask-image:linear-gradient(to_bottom,#000_72%,transparent)]"
        />
      </motion.div>

      {/* orbiting tech chips */}
      <div className="pointer-events-none absolute inset-0 hidden sm:block">
        {ORBIT.map((o) => (
          <OrbitChip key={o.name} {...o} sx={sx} sy={sy} ready={ready} />
        ))}
      </div>

      {/* rotating badge */}
      <div className="absolute left-[2%] top-[2%] hidden size-28 md:block">
        <svg viewBox="0 0 120 120" className="size-full animate-spin-slow" aria-hidden>
          <defs>
            <path id="badgeCircle" d="M60,60 m-46,0 a46,46 0 1,1 92,0 a46,46 0 1,1 -92,0" />
          </defs>
          <text className="fill-ink/70 font-mono text-[9.5px] uppercase tracking-[0.32em]">
            <textPath href="#badgeCircle">Full Stack · AI / ML · Voice AI · </textPath>
          </text>
        </svg>
        <span className="absolute inset-0 grid place-items-center font-display text-lg italic text-lilac">4+ yrs</span>
      </div>

      {/* now card */}
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={ready ? { opacity: 1, x: 0 } : undefined}
        transition={{ duration: 1, ease: EASE, delay: 1 }}
        className="hero-instant glass absolute bottom-[12%] left-0 flex items-center gap-3 rounded-2xl px-4 py-3 shadow-2xl shadow-black/10"
      >
        <span className="relative grid size-2.5 place-items-center">
          <span className="absolute size-2.5 animate-pulse-ring rounded-full bg-violet" />
          <span className="size-2.5 rounded-full bg-violet" />
        </span>
        <span className="text-xs leading-tight">
          <span className="block font-mono text-[9px] uppercase tracking-[0.24em] text-dim">Currently</span>
          <span className="text-ink">Building AI products @ {profile.company}</span>
        </span>
      </motion.div>
    </motion.div>
  );
}

function OrbitChip({
  name,
  label,
  x,
  y,
  depth,
  delay,
  sx,
  sy,
  ready,
}: (typeof ORBIT)[number] & { sx: MotionValue<number>; sy: MotionValue<number>; ready: boolean }) {
  const tx = useDepth(sx, depth);
  const ty = useDepth(sy, depth * 0.8);
  return (
    <motion.div style={{ left: x, top: y, x: tx, y: ty }} className="absolute">
      <motion.div
        initial={{ opacity: 0, scale: 0.6 }}
        animate={ready ? { opacity: 1, scale: 1 } : undefined}
        transition={{ duration: 0.9, ease: EASE, delay: 0.8 + delay * 0.15 }}
      >
        <div
          className="glass flex animate-float items-center gap-2 rounded-full py-1.5 pl-1.5 pr-3.5 shadow-xl shadow-black/10"
          style={{ animationDelay: `${delay}s` }}
        >
          <span className="grid size-7 place-items-center rounded-full bg-paper/80">
            <TechIcon name={name} size={15} />
          </span>
          <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-ink/90">{label}</span>
        </div>
      </motion.div>
    </motion.div>
  );
}
