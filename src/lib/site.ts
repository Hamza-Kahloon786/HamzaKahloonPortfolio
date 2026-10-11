/**
 * Site-wide SEO configuration.
 * Set NEXT_PUBLIC_SITE_URL to your production domain (e.g. https://hamzakahloon.dev).
 * On Vercel, the production URL is picked up automatically if it is not set.
 */
function resolveSiteUrl() {
  if (process.env.NEXT_PUBLIC_SITE_URL) return process.env.NEXT_PUBLIC_SITE_URL.replace(/\/$/, "");
  if (process.env.VERCEL_PROJECT_PRODUCTION_URL) return `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`;
  return "http://localhost:3000";
}

export const site = {
  url: resolveSiteUrl(),
  name: "Hamza Kahloon",
  title: "Hamza Kahloon — Full Stack Developer & AI/ML Engineer",
  /** Meta description — kept under ~155 characters so search results show it in full. */
  description:
    "Hamza Kahloon — Full Stack Developer & AI/ML Engineer in Lahore. 4+ years building AI voice agents, RAG pipelines and SaaS with React, Next.js & Python.",
  /** Longer summary for structured data and the llms.txt files, where length doesn't matter. */
  summary:
    "Hamza Kahloon is a Lahore-based Full Stack Developer and AI/ML Engineer with 4+ years of experience building AI voice agents, RAG pipelines and multi-tenant SaaS platforms with React, Next.js, Node.js, Python and FastAPI.",
  keywords: [
    "Hamza Kahloon",
    "Muhammad Hamza Tanveer Kahloon",
    "Full Stack Developer",
    "AI/ML Engineer",
    "AI Engineer Lahore",
    "Full Stack Developer Pakistan",
    "Voice AI developer",
    "RAG developer",
    "LangChain developer",
    "LangGraph",
    "Next.js developer",
    "React developer",
    "Node.js developer",
    "FastAPI developer",
    "Python developer",
    "SaaS developer",
    "Twilio ElevenLabs voice agents",
    "OpenAI integration",
    "n8n automation",
  ],
  locale: "en_US",
  /** Used for sitemap lastModified. Bump when content changes. */
  updated: "2026-10-11",
} as const;

/** Trims text to a search-friendly meta description length at a word boundary. */
export function metaDescription(text: string, max = 155) {
  if (text.length <= max) return text;
  const cut = text.slice(0, max - 1);
  return `${cut.slice(0, cut.lastIndexOf(" ")).replace(/[\s,;:—–-]+$/, "")}…`;
}

export const absoluteUrl = (path = "/") => `${site.url}${path.startsWith("/") ? path : `/${path}`}`;
