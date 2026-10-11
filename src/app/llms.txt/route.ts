import { llmsTxt } from "@/lib/knowledge";

/** https://llmstxt.org — a concise guide to this site for AI assistants. Prerendered at build time. */
export function GET() {
  return new Response(llmsTxt(), {
    headers: { "Content-Type": "text/markdown; charset=utf-8" },
  });
}
