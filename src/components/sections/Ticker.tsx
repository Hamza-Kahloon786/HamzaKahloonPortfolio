import { Marquee } from "@/components/ui/Marquee";

const WORDS = [
  "Full Stack Development",
  "AI Voice Agents",
  "RAG Pipelines",
  "LangChain & LangGraph",
  "Multi-tenant SaaS",
  "Healthcare AI",
  "n8n Automation",
  "Computer Vision",
  "Production Deployments",
];

export function Ticker() {
  return (
    <div aria-hidden className="relative -mt-px rotate-[-1.5deg] scale-[1.03] border-y border-line bg-linear-to-r from-violet-deep via-violet to-lilac py-4">
      <Marquee duration={45} pauseOnHover={false}>
        {WORDS.map((w) => (
          <span key={w} className="mx-7 flex items-center gap-7 font-display text-xl uppercase tracking-[0.12em] text-white md:text-2xl">
            {w}
            <span className="text-cyan-200">✦</span>
          </span>
        ))}
      </Marquee>
    </div>
  );
}
