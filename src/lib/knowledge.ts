import { certifications } from "@/data/certifications";
import { experience } from "@/data/experience";
import { journey, profile } from "@/data/profile";
import { projects } from "@/data/projects";
import { skillGroups } from "@/data/skills";
import { absoluteUrl, site } from "./site";

/**
 * The single source of truth that machines read: the AI assistant's knowledge,
 * /llms.txt and /llms-full.txt are all generated from the same portfolio data.
 */

/** Joins lines, dropping conditional (false/null) entries but keeping blank lines. */
const lines = (...parts: Array<string | false | null | undefined>) =>
  parts.filter((p): p is string => typeof p === "string").join("\n");

function projectMarkdown(p: (typeof projects)[number]) {
  const links = [
    `[Case study](${absoluteUrl(`/projects/${p.slug}`)})`,
    p.links.live && `[Live site](${p.links.live})`,
    p.links.github && `[Source code](${p.links.github})`,
    p.links.video && `[Demo video](${p.links.video})`,
    p.links.post && `[LinkedIn write-up](${p.links.post})`,
  ].filter(Boolean);
  return lines(
    `### ${p.title} — ${p.tagline}`,
    "",
    `- Slug: ${p.slug}`,
    `- Year: ${p.year} · Role: ${p.role} · Status: ${p.status}`,
    `- Categories: ${p.categories.join(", ")}`,
    `- Stack: ${p.stack.join(", ")}`,
    !!p.metrics?.length && `- Results: ${p.metrics.map((m) => `${m.value} ${m.label.toLowerCase()}`).join("; ")}`,
    `- Links: ${links.join(" · ")}`,
    "",
    p.summary,
    "",
    ...p.description,
    "",
    "What was built:",
    ...p.highlights.map((h) => `- ${h}`),
  );
}

/** Full Markdown profile — served at /llms-full.txt and given to the AI assistant. */
export function portfolioMarkdown() {
  return lines(
    `# ${profile.name} — ${profile.title}`,
    "",
    `> ${site.summary}`,
    "",
    "## At a glance",
    "",
    `- Name: ${profile.name} (full name: ${profile.fullName})`,
    `- Role: ${profile.title} (${profile.roles.join(", ")})`,
    `- Based in: ${profile.location} · works with teams worldwide`,
    `- Current company: ${profile.company}`,
    `- Experience: ${profile.stats.map((s) => `${s.value.toLocaleString("en-US")}${s.suffix} ${s.label.toLowerCase()}`).join(", ")}`,
    `- Education: ${profile.education.degree}, ${profile.education.school} (${profile.education.year}, ${profile.education.grade})`,
    `- Availability: ${profile.availability}`,
    `- Website: ${site.url}`,
    `- Email: ${profile.email}`,
    `- Phone / WhatsApp: ${profile.phone} (${profile.whatsapp})`,
    `- LinkedIn: ${profile.linkedin}`,
    `- GitHub: ${profile.github}`,
    "",
    "## About",
    "",
    ...profile.about,
    "",
    "### What he focuses on",
    "",
    ...profile.pillars.map((p) => `- **${p.title}:** ${p.text}`),
    "",
    "## Experience",
    "",
    ...experience.flatMap((e) => [
      `### ${e.role} — ${e.company} (${e.period})`,
      "",
      `${e.type} · ${e.location}. ${e.summary}`,
      "",
      ...e.bullets.map((b) => `- ${b}`),
      `- Stack: ${e.stack.join(", ")}`,
      "",
    ]),
    "## Projects",
    "",
    ...projects.flatMap((p) => [projectMarkdown(p), ""]),
    "## Skills",
    "",
    ...skillGroups.map((g) => `- **${g.title}:** ${g.items.join(", ")}`),
    "",
    "## Certifications",
    "",
    ...certifications.map((c) => `- ${c.title} — ${c.issuer}${c.year ? ` (${c.year})` : ""}`),
    "",
    "## Career timeline",
    "",
    ...journey.map((j) => `- **${j.year} · ${j.title}:** ${j.text}`),
    "",
    "## Frequently asked questions",
    "",
    ...faqs.flatMap((f) => [`### ${f.q}`, "", f.a, ""]),
  );
}

/** Short guide in the llms.txt format (https://llmstxt.org). */
export function llmsTxt() {
  return lines(
    `# ${profile.name}`,
    "",
    `> ${profile.title} based in ${profile.location}. ${profile.intro}`,
    "",
    `${profile.name} has ${profile.stats[0].value}+ years of experience and works at ${profile.company}. He specialises in AI voice agents, RAG pipelines, LLM integrations and multi-tenant SaaS, using React, Next.js, Node.js, Python, FastAPI, LangChain, OpenAI, Twilio and ElevenLabs. ${profile.availability}. Contact: ${profile.email}.`,
    "",
    "## Profile",
    "",
    `- [Portfolio home](${site.url}): about, journey, skills, experience, projects, certifications and contact`,
    `- [Full profile in Markdown](${absoluteUrl("/llms-full.txt")}): everything on this site in one plain-text file`,
    `- [LinkedIn](${profile.linkedin}): professional profile`,
    `- [GitHub](${profile.github}): public repositories`,
    "",
    "## Featured projects",
    "",
    ...projects.filter((p) => p.featured).map((p) => `- [${p.title}](${absoluteUrl(`/projects/${p.slug}`)}): ${p.tagline}. ${p.summary}`),
    "",
    "## Optional",
    "",
    ...projects.filter((p) => !p.featured).map((p) => `- [${p.title}](${absoluteUrl(`/projects/${p.slug}`)}): ${p.tagline}`),
  );
}

/** Visible on the page (FAQ section) and mirrored in FAQPage structured data. */
export const faqs = [
  {
    q: `Who is ${profile.name}?`,
    a: `${profile.name} (full name ${profile.fullName}) is a ${profile.title} based in ${profile.location}. He has ${profile.stats[0].value}+ years of experience building AI-powered products — AI voice agents, RAG systems and multi-tenant SaaS platforms — and currently works at ${profile.company}.`,
  },
  {
    q: `What does ${profile.firstName} specialise in?`,
    a: "AI engineering and full-stack product development: LLM integrations with OpenAI, RAG pipelines, LangChain and LangGraph agents, real-time voice agents with Twilio, ElevenLabs, Deepgram and Whisper, and multi-tenant SaaS built with React, Next.js, Node.js, FastAPI and Django.",
  },
  {
    q: `What are ${profile.firstName}'s most notable projects?`,
    a: `Highlights include LeadFront, an AI front office of voice and SMS agents for service businesses; Doctor AI Portal, a multi-tenant healthcare SaaS with AI patient intake; STORM AI, a CRM serving 1,000+ daily active users; AIPAS (ProcureHub), procurement automation with 92% decision accuracy; and EZOS, a proposal and commission platform for sales teams.`,
  },
  {
    q: `Which technologies does ${profile.firstName} work with?`,
    a: "Python, JavaScript and TypeScript; React, Next.js and Angular on the front end; Node.js, Express, FastAPI, Django and Flask on the back end; OpenAI, LangChain, LangGraph and Hugging Face for AI; PostgreSQL, MongoDB, Supabase, Redis and vector databases such as Pinecone, Chroma and FAISS; and Docker, Vercel and AWS for deployment.",
  },
  {
    q: `Is ${profile.firstName} available for hire?`,
    a: `Yes — ${profile.availability.toLowerCase()}. He works with teams worldwide from ${profile.location} and usually replies within 24 hours.`,
  },
  {
    q: `How can I contact ${profile.firstName}?`,
    a: `Email ${profile.email}, message on WhatsApp at ${profile.phone}, or connect on LinkedIn. The contact form on this site also opens a ready-to-send email or WhatsApp message.`,
  },
  {
    q: `Where did ${profile.firstName} study?`,
    a: `${profile.education.degree} at ${profile.education.school} (${profile.education.year}, ${profile.education.grade}). His final-year research detected anxiety in Urdu text with NLP at 88% accuracy.`,
  },
] as const;
