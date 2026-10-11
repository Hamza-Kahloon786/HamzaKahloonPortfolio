import { cn } from "@/lib/utils";
import { Reveal, SplitText } from "./Reveal";

type Part = string | { text: string; className?: string };

export function SectionHeading({
  index,
  kicker,
  parts,
  intro,
  align = "left",
  size = "lg",
  className,
}: {
  index: string;
  kicker: string;
  parts: Part[];
  intro?: string;
  align?: "left" | "center";
  /** "md" for headings that live in a narrow (sticky side) column. */
  size?: "lg" | "md";
  className?: string;
}) {
  return (
    <header className={cn("flex flex-col gap-6", align === "center" && "items-center text-center", className)}>
      <Reveal className="flex items-center gap-4" y={16}>
        <span className="font-mono text-xs text-lilac">{index}</span>
        <span className="h-px w-10 bg-line-strong" />
        <span className="kicker">{kicker}</span>
      </Reveal>
      <SplitText
        parts={parts}
        className={cn(
          "max-w-5xl font-display font-semibold leading-[0.95] tracking-[-0.02em] text-ink",
          size === "lg" ? "text-[clamp(2.6rem,6.4vw,6.2rem)]" : "text-[clamp(2.6rem,4.6vw,4.7rem)]",
        )}
      />
      {intro ? (
        <Reveal delay={0.15} className={cn("max-w-xl text-base leading-relaxed text-mist md:text-lg", align === "center" && "mx-auto")}>
          <p>{intro}</p>
        </Reveal>
      ) : null}
    </header>
  );
}
