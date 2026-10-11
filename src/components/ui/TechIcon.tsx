"use client";

import type { IconType } from "react-icons";
import {
  SiAngular, SiBootstrap, SiCloudinary, SiCplusplus, SiCss, SiCursor, SiDeepgram, SiDjango, SiDocker,
  SiElevenlabs, SiExpress, SiFastapi, SiFlask, SiGit, SiGithub, SiGooglecalendar, SiGooglemaps, SiGradio,
  SiHostinger, SiHtml5, SiHuggingface, SiJavascript, SiLangchain, SiLanggraph, SiLaravel, SiMailgun,
  SiMongodb, SiMysql, SiNextdotjs, SiNodedotjs, SiNumpy, SiOpencv, SiPandas, SiPhp, SiPostgresql,
  SiPytest, SiPython, SiPytorch, SiQdrant, SiQuickbooks, SiRailway, SiReact, SiRedis, SiRedux,
  SiScikitlearn, SiSelenium, SiSocketdotio, SiSpringboot, SiSqlite, SiStreamlit, SiStripe, SiSupabase,
  SiTailwindcss, SiTensorflow, SiThreedotjs, SiTypescript, SiVercel, SiVite, SiWebrtc, SiZapier,
} from "react-icons/si";
import { RiOpenaiFill } from "react-icons/ri";
import { TbBrandAws, TbBrandTwilio } from "react-icons/tb";
import { FaJava } from "react-icons/fa";
import {
  LuAudioLines, LuBot, LuBrainCircuit, LuChartColumn, LuChartLine, LuDatabase, LuFileSearch,
  LuMessageCircle, LuMessagesSquare, LuScanText, LuServerCog, LuTarget,
} from "react-icons/lu";
import { cn } from "@/lib/utils";

type TechMeta = { icon?: IconType; color: string; mono?: string };

const IVORY = "#111018";

export const TECH: Record<string, TechMeta> = {
  // Frontend
  React: { icon: SiReact, color: "#149eca" },
  "Next.js": { icon: SiNextdotjs, color: IVORY },
  Angular: { icon: SiAngular, color: "#ff3b5c" },
  TypeScript: { icon: SiTypescript, color: "#3178c6" },
  JavaScript: { icon: SiJavascript, color: "#e5c800" },
  Redux: { icon: SiRedux, color: "#9b6dd6" },
  "Tailwind CSS": { icon: SiTailwindcss, color: "#38bdf8" },
  "Three.js": { icon: SiThreedotjs, color: IVORY },
  Bootstrap: { icon: SiBootstrap, color: "#8c5cf0" },
  HTML5: { icon: SiHtml5, color: "#e34f26" },
  CSS: { icon: SiCss, color: "#2b9bf4" },
  Vite: { icon: SiVite, color: "#8f86ff" },
  // Backend
  "Node.js": { icon: SiNodedotjs, color: "#5fa04e" },
  Express: { icon: SiExpress, color: IVORY },
  FastAPI: { icon: SiFastapi, color: "#05998b" },
  Django: { icon: SiDjango, color: "#44b78b" },
  Flask: { icon: SiFlask, color: IVORY },
  "Spring Boot": { icon: SiSpringboot, color: "#6db33f" },
  Laravel: { icon: SiLaravel, color: "#ff2d20" },
  "REST APIs": { icon: LuServerCog, color: "var(--color-lilac)" },
  // AI
  OpenAI: { icon: RiOpenaiFill, color: IVORY },
  Whisper: { icon: RiOpenaiFill, color: "#10a37f" },
  LangChain: { icon: SiLangchain, color: "#1c9c86" },
  LangGraph: { icon: SiLanggraph, color: "#1c9c86" },
  "Hugging Face": { icon: SiHuggingface, color: "#e6b400" },
  RAG: { icon: LuFileSearch, color: "var(--color-violet)" },
  NLP: { icon: LuMessagesSquare, color: "var(--color-lilac)" },
  OCR: { icon: LuScanText, color: "#0891b2" },
  Gradio: { icon: SiGradio, color: "#f97316" },
  Streamlit: { icon: SiStreamlit, color: "#ff4b4b" },
  Cursor: { icon: SiCursor, color: IVORY },
  "Machine Learning": { icon: LuBrainCircuit, color: "#c084fc" },
  "AI auto-response": { icon: LuBot, color: "var(--color-violet)" },
  "Lead scoring": { icon: LuTarget, color: "#34d399" },
  // ML & data
  "scikit-learn": { icon: SiScikitlearn, color: "#f7931e" },
  TensorFlow: { icon: SiTensorflow, color: "#ff6f00" },
  PyTorch: { icon: SiPytorch, color: "#ee4c2c" },
  OpenCV: { icon: SiOpencv, color: "#7c6cff" },
  Pandas: { icon: SiPandas, color: "#e70488" },
  NumPy: { icon: SiNumpy, color: "#4dabcf" },
  Matplotlib: { icon: LuChartLine, color: "#60a5fa" },
  "Power BI": { icon: LuChartColumn, color: "#d4a900" },
  "Audio processing": { icon: LuAudioLines, color: "#65a30d" },
  // Voice & realtime
  Twilio: { icon: TbBrandTwilio, color: "#f22f46" },
  ElevenLabs: { icon: SiElevenlabs, color: IVORY },
  Vapi: { color: "#0ea47a", mono: "Va" },
  Deepgram: { icon: SiDeepgram, color: "#0fb875" },
  WebRTC: { icon: SiWebrtc, color: IVORY },
  WebSockets: { icon: SiSocketdotio, color: IVORY },
  "Voice AI": { icon: LuAudioLines, color: "#f472b6" },
  "SMS automation": { icon: LuMessageCircle, color: "#7c6cff" },
  // Data & vectors
  PostgreSQL: { icon: SiPostgresql, color: "#6b8ff0" },
  MongoDB: { icon: SiMongodb, color: "#47a248" },
  MySQL: { icon: SiMysql, color: "#5a9bd5" },
  Supabase: { icon: SiSupabase, color: "#3fcf8e" },
  SQLite: { icon: SiSqlite, color: "#4fa3d1" },
  Redis: { icon: SiRedis, color: "#ff4438" },
  Pinecone: { color: IVORY, mono: "Pc" },
  Chroma: { color: "#d9a400", mono: "Ch" },
  FAISS: { color: "#4f8ff7", mono: "Fs" },
  Qdrant: { icon: SiQdrant, color: "#dc244c" },
  Weaviate: { color: "#00c08b", mono: "Wv" },
  SQL: { icon: LuDatabase, color: "#475569" },
  // Automation & devops
  n8n: { color: "#ea4b71", mono: "n8n" },
  Zapier: { icon: SiZapier, color: "#ff4f00" },
  Docker: { icon: SiDocker, color: "#2496ed" },
  Git: { icon: SiGit, color: "#f05032" },
  GitHub: { icon: SiGithub, color: IVORY },
  Vercel: { icon: SiVercel, color: IVORY },
  Railway: { icon: SiRailway, color: IVORY },
  AWS: { icon: TbBrandAws, color: "#ff9900" },
  "AWS SES": { icon: TbBrandAws, color: "#ff9900" },
  Hostinger: { icon: SiHostinger, color: "#8a63ff" },
  pytest: { icon: SiPytest, color: "#0a9edc" },
  Selenium: { icon: SiSelenium, color: "#43b02a" },
  // Integrations
  Stripe: { icon: SiStripe, color: "#8b85ff" },
  QuickBooks: { icon: SiQuickbooks, color: "#2ca01c" },
  "Google Calendar": { icon: SiGooglecalendar, color: "#4285f4" },
  "Google Maps": { icon: SiGooglemaps, color: "#34a853" },
  SendGrid: { color: "#1a82e2", mono: "SG" },
  Mailgun: { icon: SiMailgun, color: "#f06b66" },
  Cloudinary: { icon: SiCloudinary, color: "#5b7cfa" },
  // Languages
  Python: { icon: SiPython, color: "#4b8bbe" },
  Java: { icon: FaJava, color: "#f89820" },
  "C++": { icon: SiCplusplus, color: "#659ad2" },
  PHP: { icon: SiPhp, color: "#8892bf" },
};

export function techMeta(name: string): TechMeta {
  return TECH[name] ?? { color: "var(--color-lilac)", mono: name.slice(0, 2) };
}

export function TechIcon({ name, className, size = 22 }: { name: string; className?: string; size?: number }) {
  const meta = techMeta(name);
  if (meta.icon) {
    const Icon = meta.icon;
    return <Icon aria-hidden size={size} className={className} style={{ color: meta.color }} />;
  }
  return (
    <span
      aria-hidden
      className={cn("inline-grid place-items-center font-mono font-bold leading-none tracking-tight", className)}
      style={{ color: meta.color, fontSize: size * (meta.mono && meta.mono.length > 2 ? 0.5 : 0.62), width: size, height: size }}
    >
      {meta.mono}
    </span>
  );
}

/** Small pill with icon + name, used in project details and experience. */
export function TechChip({ name, className }: { name: string; className?: string }) {
  const meta = techMeta(name);
  return (
    <span
      className={cn(
        "inline-flex items-center gap-2 rounded-full border border-line bg-ink/[0.03] py-1.5 pl-2 pr-3 text-xs text-ink/85",
        className,
      )}
      style={{ ["--chip" as string]: meta.color }}
    >
      <TechIcon name={name} size={14} />
      {name}
    </span>
  );
}
