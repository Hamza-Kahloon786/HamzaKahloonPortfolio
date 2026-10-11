"use client";

import { useEffect, useState, useSyncExternalStore } from "react";
import { AnimatePresence, motion } from "motion/react";
import { FaGithub, FaLinkedinIn, FaWhatsapp } from "react-icons/fa6";
import { LuArrowUpRight, LuCheck, LuCopy, LuGitFork, LuMail, LuPhone, LuSend, LuStar, LuX } from "react-icons/lu";
import { profile } from "@/data/profile";
import { projects } from "@/data/projects";
import type { GitHubSnapshot } from "@/lib/github";
import { lockScroll, unlockScroll } from "@/lib/scroll";
import { cn, EASE } from "@/lib/utils";
import { Magnetic } from "@/components/ui/Magnetic";
import { Reveal, SplitText } from "@/components/ui/Reveal";
import { Spotlight } from "@/components/ui/Spotlight";
import { TechIcon } from "@/components/ui/TechIcon";
import { Portal } from "@/components/ui/Portal";

const TOPICS = ["Full-time role", "Freelance project", "AI / voice agent build", "Just saying hi"];

const [emailLocal, emailDomain] = profile.email.split("@");

export function Contact({ github }: { github: GitHubSnapshot | null }) {
  const [copied, setCopied] = useState(false);
  const [drawer, setDrawer] = useState(false);

  const copyEmail = async () => {
    try {
      await navigator.clipboard.writeText(profile.email);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      window.location.href = `mailto:${profile.email}`;
    }
  };

  return (
    <section id="contact" aria-labelledby="contact-title" className="relative overflow-hidden pb-24 pt-32 md:pt-44">
      <div aria-hidden className="pointer-events-none absolute inset-0">
        <div className="absolute -bottom-40 left-1/2 h-[60vmin] w-[90vmin] -translate-x-1/2 rounded-full bg-violet/20 blur-[140px]" />
        <div className="grid-lines absolute inset-0 opacity-40 [mask-image:linear-gradient(to_bottom,transparent,#000_40%,transparent)]" />
      </div>

      <div className="container-x relative">
        <div className="flex flex-col justify-between gap-12 lg:flex-row lg:items-end">
          <div>
            <Reveal className="flex items-center gap-4" y={16}>
              <span className="font-mono text-xs text-lilac">07</span>
              <span className="h-px w-10 bg-line-strong" />
              <span className="kicker">Contact</span>
            </Reveal>
            <h2 id="contact-title" className="mt-6 font-display font-semibold leading-[0.88] tracking-[-0.03em]">
              <SplitText as="span" parts={["Let's build"]} className="block text-[clamp(3.2rem,9vw,8.5rem)] text-ink" />
              <SplitText
                as="span"
                delay={0.12}
                parts={[{ text: "something intelligent.", className: "italic text-gradient pr-[0.06em]" }]}
                className="block text-[clamp(3.2rem,9vw,8.5rem)]"
              />
            </h2>
          </div>
          <Reveal delay={0.2} className="shrink-0">
            <Magnetic strength={0.4}>
              <a
                href={`mailto:${profile.email}`}
                className="group relative grid size-36 place-items-center rounded-full border border-line-strong md:size-44"
                aria-label="Email Hamza"
              >
                <svg viewBox="0 0 120 120" className="absolute inset-0 size-full animate-spin-slow" aria-hidden>
                  <defs>
                    <path id="ctaCircle" d="M60,60 m-48,0 a48,48 0 1,1 96,0 a48,48 0 1,1 -96,0" />
                  </defs>
                  <text className="fill-mist font-mono text-[8.5px] uppercase tracking-[0.34em]">
                    <textPath href="#ctaCircle">Write · Connect · Build · Grow · </textPath>
                  </text>
                </svg>
                <span className="grid size-16 place-items-center rounded-full bg-linear-to-br from-violet to-cyan text-2xl text-white transition-transform duration-500 group-hover:rotate-45 group-hover:scale-110">
                  <LuArrowUpRight />
                </span>
              </a>
            </Magnetic>
          </Reveal>
        </div>

        <Reveal delay={0.1} className="mt-10 flex flex-col gap-6 border-t border-line pt-8 md:flex-row md:items-center md:justify-between">
          <p className="max-w-xl text-lg leading-relaxed text-mist">
            Good ideas start with a simple conversation. Have a product, an AI feature or a role in mind? I usually reply within 24 hours.
          </p>
          <div className="flex flex-wrap items-center gap-3">
            <span className="inline-flex items-center gap-2.5 rounded-full border border-emerald-600/25 bg-emerald-500/10 px-4 py-2 text-xs text-emerald-800">
              <span className="relative grid size-2 place-items-center">
                <span className="absolute size-2 animate-pulse-ring rounded-full bg-emerald-400" />
                <span className="size-2 rounded-full bg-emerald-400" />
              </span>
              {profile.availability}
            </span>
            <LocalTime />
          </div>
        </Reveal>

        <Reveal className="mt-14">
          <Spotlight className="group rounded-[28px] border border-line bg-paper-2/85 p-6 md:p-8">
            <div className="flex flex-col gap-6 xl:flex-row xl:items-center xl:justify-between">
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-3">
                  <span className="grid size-11 shrink-0 place-items-center rounded-2xl bg-linear-to-br from-violet to-cyan text-lg text-white shadow-[0_12px_28px_-12px_var(--color-violet)]">
                    <LuMail />
                  </span>
                  <p className="kicker">Email me directly</p>
                </div>
                <button
                  type="button"
                  onClick={copyEmail}
                  aria-label={`Copy email address ${profile.email}`}
                  className="mt-4 block max-w-full text-left font-display text-[clamp(0.875rem,4.3vw,2.4rem)] font-semibold leading-tight text-ink transition-colors hover:text-lilac"
                >
                  {emailLocal}
                  <wbr />@{emailDomain}
                </button>
              </div>
              <div className="flex shrink-0 flex-wrap items-center gap-3">
                <button
                  type="button"
                  onClick={copyEmail}
                  className="inline-flex items-center gap-2 rounded-full border-[1.5px] border-ink px-5 py-3 text-sm font-semibold text-ink transition-colors hover:bg-ink hover:text-paper"
                >
                  <AnimatePresence mode="wait" initial={false}>
                    <motion.span
                      key={copied ? "y" : "n"}
                      initial={{ scale: 0.4, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      exit={{ scale: 0.4, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                      className="grid place-items-center"
                    >
                      {copied ? <LuCheck /> : <LuCopy />}
                    </motion.span>
                  </AnimatePresence>
                  {copied ? "Copied!" : "Copy email"}
                </button>
                <a
                  href={`mailto:${profile.email}`}
                  className="group/mail inline-flex items-center gap-2 rounded-full bg-ink px-5 py-3 text-sm font-semibold text-paper transition-colors hover:bg-violet"
                >
                  Open mail app
                  <LuArrowUpRight className="transition-transform duration-300 group-hover/mail:rotate-45" />
                </a>
              </div>
            </div>
            <p className="sr-only" aria-live="polite">
              {copied ? "Email address copied to clipboard" : ""}
            </p>
          </Spotlight>
        </Reveal>

        <ul className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <ContactCard
            delay={0.05}
            href={profile.linkedin}
            icon={<FaLinkedinIn />}
            title="LinkedIn"
            detail={profile.name}
            brand="#0a66c2"
          />
          <ContactCard
            delay={0.1}
            onClick={() => setDrawer(true)}
            icon={<FaGithub />}
            title="GitHub"
            detail={`${github?.publicRepos ?? 29} repos · live stats`}
            brand="#181717"
            cursorLabel="Stats"
          />
          <ContactCard
            delay={0.15}
            href={`${profile.whatsapp}?text=${encodeURIComponent("Hi Hamza! I found your portfolio and would love to chat.")}`}
            icon={<FaWhatsapp />}
            title="WhatsApp"
            detail="Chat with me instantly"
            brand="#25d366"
          />
          <ContactCard delay={0.2} href={profile.phoneHref} icon={<LuPhone />} title="Phone" detail={profile.phone} brand="var(--color-violet)" external={false} />
        </ul>

        <ComposeForm />
      </div>

      <Portal>
        <AnimatePresence>{drawer && <GitHubDrawer key="gh" data={github} onClose={() => setDrawer(false)} />}</AnimatePresence>
      </Portal>
    </section>
  );
}

const subscribeMinute = (cb: () => void) => {
  const id = setInterval(cb, 15000);
  return () => clearInterval(id);
};
const timeFmt = new Intl.DateTimeFormat("en-US", { hour: "2-digit", minute: "2-digit", hour12: true, timeZone: profile.timeZone });

function LocalTime() {
  const time = useSyncExternalStore(subscribeMinute, () => timeFmt.format(new Date()), () => "");
  return (
    <span className="inline-flex items-center gap-2 rounded-full border border-line px-4 py-2 font-mono text-xs text-mist">
      Lahore <span className="text-ink tabular-nums">{time || "--:--"}</span> PKT
    </span>
  );
}

/** Compact contact channel: lifts and fills with its brand color on hover. */
function ContactCard({
  icon,
  title,
  detail,
  brand,
  delay,
  href,
  onClick,
  external = true,
  cursorLabel,
}: {
  icon: React.ReactNode;
  title: string;
  detail: string;
  brand: string;
  delay: number;
  href?: string;
  onClick?: () => void;
  external?: boolean;
  cursorLabel?: string;
}) {
  const className =
    "group flex h-full w-full items-center gap-4 rounded-3xl border border-line bg-paper-2/85 p-5 text-left transition-all duration-500 hover:-translate-y-1 hover:border-[color:var(--brand)] hover:shadow-[0_22px_44px_-26px_var(--brand)]";
  const body = (
    <>
      <span className="grid size-12 shrink-0 place-items-center rounded-2xl border border-line bg-paper text-lg text-[color:var(--brand)] transition-colors duration-500 group-hover:border-transparent group-hover:bg-[color:var(--brand)] group-hover:text-white">
        {icon}
      </span>
      <span className="min-w-0 flex-1">
        <span className="block font-display text-lg font-semibold text-ink">{title}</span>
        <span className="block truncate text-sm text-mist">{detail}</span>
      </span>
      <span className="grid size-9 shrink-0 place-items-center rounded-full border border-line text-mist transition-all duration-500 group-hover:rotate-45 group-hover:border-transparent group-hover:bg-ink group-hover:text-paper">
        <LuArrowUpRight />
      </span>
    </>
  );
  const style = { ["--brand" as string]: brand };
  return (
    <Reveal as="li" delay={delay}>
      {href ? (
        <a href={href} {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})} className={className} style={style}>
          {body}
        </a>
      ) : (
        <button type="button" onClick={onClick} data-cursor="view" data-cursor-label={cursorLabel} className={className} style={style}>
          {body}
        </button>
      )}
    </Reveal>
  );
}

function ComposeForm() {
  const [topic, setTopic] = useState(TOPICS[0]);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const body = `Hi Hamza,\n\n${message}\n\n— ${name}${email ? ` (${email})` : ""}`;
  const subject = `${topic} — via your portfolio`;
  const valid = name.trim().length > 1 && message.trim().length > 5;

  return (
    <Reveal className="mt-20">
      <form
        onSubmit={(e) => {
          e.preventDefault();
          if (!valid) return;
          window.location.href = `mailto:${profile.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
        }}
        className="grid gap-10 rounded-[32px] border border-line bg-paper-2/70 p-6 backdrop-blur md:p-10 lg:grid-cols-12"
      >
        <div className="lg:col-span-4">
          <p className="kicker">Send a message</p>
          <p className="mt-4 font-display text-4xl leading-tight text-ink">
            Tell me about <span className="italic text-gradient">your idea.</span>
          </p>
          <p className="mt-4 text-sm leading-relaxed text-mist">
            Pick a topic, write a few lines and send it by email or WhatsApp — whichever you prefer.
          </p>
        </div>
        <div className="space-y-6 lg:col-span-8">
          <fieldset>
            <legend className="mb-3 font-mono text-[10px] uppercase tracking-[0.24em] text-dim">I&apos;m reaching out about</legend>
            <div className="flex flex-wrap gap-2">
              {TOPICS.map((t) => (
                <button
                  key={t}
                  type="button"
                  aria-pressed={topic === t}
                  onClick={() => setTopic(t)}
                  className={cn(
                    "rounded-full border px-4 py-2 text-sm transition-all duration-300",
                    topic === t ? "border-transparent bg-ink text-paper" : "border-line text-mist hover:border-line-strong hover:text-ink",
                  )}
                >
                  {t}
                </button>
              ))}
            </div>
          </fieldset>
          <div className="grid gap-6 md:grid-cols-2">
            <Field label="Your name" value={name} onChange={setName} autoComplete="name" />
            <Field label="Your email (optional)" value={email} onChange={setEmail} type="email" autoComplete="email" />
          </div>
          <Field label="Message" value={message} onChange={setMessage} textarea />
          <div className="flex flex-wrap items-center gap-3 pt-2">
            <button
              type="submit"
              disabled={!valid}
              className="group inline-flex items-center gap-3 rounded-full bg-linear-to-r from-violet-deep via-violet to-lilac px-7 py-4 text-sm font-semibold text-white transition-opacity disabled:cursor-not-allowed disabled:opacity-40"
            >
              Send via email <LuSend className="transition-transform duration-500 group-hover:translate-x-1 group-hover:-translate-y-0.5" />
            </button>
            <a
              href={`${profile.whatsapp}?text=${encodeURIComponent(`${subject}\n\n${body}`)}`}
              target="_blank"
              rel="noopener noreferrer"
              aria-disabled={!valid}
              onClick={(e) => !valid && e.preventDefault()}
              className={cn(
                "inline-flex items-center gap-3 rounded-full border border-line-strong px-7 py-4 text-sm text-ink transition-colors hover:border-[#25d366]",
                !valid && "pointer-events-none opacity-40",
              )}
            >
              <FaWhatsapp className="text-[#25d366]" /> Send via WhatsApp
            </a>
          </div>
        </div>
      </form>
    </Reveal>
  );
}

function Field({
  label,
  value,
  onChange,
  textarea,
  type = "text",
  autoComplete,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  textarea?: boolean;
  type?: string;
  autoComplete?: string;
}) {
  const cls =
    "peer w-full border-b border-line-strong bg-transparent pb-3 pt-6 text-lg text-ink outline-none transition-colors placeholder:text-transparent focus:border-lilac";
  return (
    <label className="relative block">
      {textarea ? (
        <textarea value={value} onChange={(e) => onChange(e.target.value)} rows={4} placeholder={label} className={cn(cls, "resize-none")} />
      ) : (
        <input value={value} onChange={(e) => onChange(e.target.value)} type={type} autoComplete={autoComplete} placeholder={label} className={cls} />
      )}
      <span className="pointer-events-none absolute left-0 top-0 font-mono text-[10px] uppercase tracking-[0.24em] text-dim transition-colors peer-focus:text-lilac">
        {label}
      </span>
    </label>
  );
}

function GitHubDrawer({ data, onClose }: { data: GitHubSnapshot | null; onClose: () => void }) {
  useEffect(() => {
    lockScroll();
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => {
      unlockScroll();
      window.removeEventListener("keydown", onKey);
    };
  }, [onClose]);

  const fallbackRepos = projects
    .filter((p) => p.links.github)
    .slice(0, 6)
    .map((p) => ({ name: p.title, description: p.summary, url: p.links.github!, language: null as string | null, stars: 0, updated: p.year }));
  const repos = data?.repos ?? fallbackRepos;
  const maxLang = Math.max(1, ...(data?.languages.map((l) => l.count) ?? [1]));

  return (
    <motion.div className="fixed inset-0 z-[80]" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
      <div className="absolute inset-0 bg-paper/75 backdrop-blur-sm" onClick={onClose} />
      <motion.aside
        role="dialog"
        aria-modal="true"
        aria-label="GitHub profile"
        initial={{ x: "100%" }}
        animate={{ x: 0 }}
        exit={{ x: "100%" }}
        transition={{ duration: 0.7, ease: EASE }}
        data-lenis-prevent
        className="absolute inset-y-0 right-0 flex w-full max-w-[520px] flex-col overflow-y-auto border-l border-line-strong bg-paper-2"
      >
        <div className="sticky top-0 z-10 flex items-center justify-between border-b border-line bg-paper-2/90 px-6 py-4 backdrop-blur">
          <span className="inline-flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.3em] text-mist">
            <FaGithub className="text-ink" /> github.com/{profile.githubUser}
          </span>
          <button
            type="button"
            onClick={onClose}
            className="inline-flex items-center gap-2 rounded-full border border-lilac/50 px-3.5 py-2 font-mono text-[10px] uppercase tracking-[0.2em] text-ink hover:bg-violet/25"
          >
            Close <LuX />
          </button>
        </div>

        <div className="p-6">
          <div className="flex items-center gap-4">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={profile.headshot} alt="" className="size-16 rounded-2xl object-cover" />
            <div>
              <p className="font-display text-2xl text-ink">{data?.name ?? profile.name}</p>
              <p className="text-sm text-mist">{data?.bio ?? "Full Stack Developer | AI/LLM Engineer | Voice AI Specialist"}</p>
            </div>
          </div>

          <dl className="mt-8 grid grid-cols-3 gap-3">
            {[
              { k: "Repositories", v: data?.publicRepos ?? 29 },
              { k: "Followers", v: data?.followers ?? "—" },
              { k: "Stars earned", v: data?.totalStars ?? "—" },
            ].map((s) => (
              <div key={s.k} className="rounded-2xl border border-line p-4">
                <dd className="font-display text-3xl text-ink">{s.v}</dd>
                <dt className="mt-1 font-mono text-[9px] uppercase tracking-[0.2em] text-dim">{s.k}</dt>
              </div>
            ))}
          </dl>

          {data && data.languages.length > 0 && (
            <div className="mt-8">
              <p className="font-mono text-[10px] uppercase tracking-[0.24em] text-dim">Top languages by repository</p>
              <ul className="mt-4 space-y-3">
                {data.languages.map((l, i) => (
                  <li key={l.name} className="grid grid-cols-[7rem_1fr_2rem] items-center gap-3 text-sm">
                    <span className="flex items-center gap-2 text-ink/85">
                      <TechIcon name={l.name === "Jupyter Notebook" ? "Python" : l.name} size={14} />
                      {l.name}
                    </span>
                    <span className="h-1.5 overflow-hidden rounded-full bg-ink/[0.06]">
                      <motion.span
                        className="block h-full rounded-full bg-linear-to-r from-violet to-cyan"
                        initial={{ width: 0 }}
                        animate={{ width: `${(l.count / maxLang) * 100}%` }}
                        transition={{ duration: 1, ease: EASE, delay: 0.3 + i * 0.08 }}
                      />
                    </span>
                    <span className="text-right font-mono text-xs text-mist">{l.count}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          <p className="mt-10 font-mono text-[10px] uppercase tracking-[0.24em] text-dim">{data ? "Recently updated" : "Selected repositories"}</p>
          <ul className="mt-4 space-y-3">
            {repos.map((r, i) => (
              <motion.li key={r.url} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 + i * 0.05, duration: 0.5, ease: EASE }}>
                <a
                  href={r.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group block rounded-2xl border border-line p-4 transition-colors hover:border-lilac/50 hover:bg-ink/[0.02]"
                >
                  <div className="flex items-center justify-between gap-3">
                    <span className="flex items-center gap-2 font-mono text-sm text-ink">
                      <LuGitFork className="text-mist" /> {r.name}
                    </span>
                    <LuArrowUpRight className="text-mist transition-transform duration-300 group-hover:rotate-45 group-hover:text-ink" />
                  </div>
                  {r.description && <p className="mt-2 line-clamp-2 text-sm text-mist">{r.description}</p>}
                  <div className="mt-3 flex items-center gap-4 font-mono text-[10px] uppercase tracking-[0.16em] text-dim">
                    {r.language && <span>{r.language}</span>}
                    {r.stars > 0 && (
                      <span className="inline-flex items-center gap-1">
                        <LuStar /> {r.stars}
                      </span>
                    )}
                    <span>{r.updated}</span>
                  </div>
                </a>
              </motion.li>
            ))}
          </ul>

          <a
            href={profile.github}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-8 flex items-center justify-center gap-2 rounded-full bg-ink px-6 py-4 text-sm font-semibold text-paper"
          >
            View full GitHub profile <LuArrowUpRight />
          </a>
        </div>
      </motion.aside>
    </motion.div>
  );
}
