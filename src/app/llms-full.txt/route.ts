import { portfolioMarkdown } from "@/lib/knowledge";

/** The whole portfolio as one Markdown document for LLMs and AI search. Prerendered at build time. */
export function GET() {
  return new Response(portfolioMarkdown(), {
    headers: { "Content-Type": "text/markdown; charset=utf-8" },
  });
}
