# Hamza Kahloon — Portfolio

Personal portfolio for **Hamza Kahloon**, Full Stack Developer & AI/ML Engineer.
Built with **Next.js 16** (App Router, Cache Components), **React 19**, **Tailwind CSS 4**, **Motion** and **Lenis**.

## Run it

```bash
npm install
npm run dev      # http://localhost:3000
npm run build    # production build
npm start        # serve the production build
```

## Editing content

All content lives in `src/data/` — no component changes needed:

| File | What it controls |
| --- | --- |
| `profile.ts` | Name, intro, contact links, stats, education, "about" text, journey milestones |
| `experience.ts` | Roles, bullet points, stack and the projects shipped in each role |
| `projects.ts` | Every project: copy, highlights, metrics, stack, links, screenshot, accent colour |
| `skills.ts` | Skill groups (names must match keys in `components/ui/TechIcon.tsx`) |
| `certifications.ts` | Certificates, issuers, years, optional scan image and verification link |

### Images

- `public/images/hamza-cutout.png` — transparent hero portrait. Replace with a higher-resolution cut-out for a sharper hero.
- `public/images/hamza-headshot.jpg` — headshot used in the Journey section, GitHub panel and Open Graph image.
- `public/projects/<slug>/` — one folder per project.
  - `image` (a JPG) is the cover used on cards, the 3D ring and the share image. Projects without one get a generated cover.
  - `gallery` lists extra screens (`kind: "screen"` for flat screenshots, `kind: "device"` for transparent mockups) with their real `width`/`height`. If the first gallery item is a device mockup it becomes the hero of the case study; the rest appear under **Screens** with click-to-zoom.
- `public/certificates/*.jpg` — optional real certificate scans. Set `image` on the certificate to show the scan instead of the designed certificate.

### Résumé

Drop your CV at `public/resume.pdf`. The **Download résumé** button in the hero appears automatically on the next build.

## How the project modals work

Project pages use Next.js **intercepting + parallel routes**:

- Clicking a project anywhere on the site opens `/projects/[slug]` as a modal (`src/app/@modal/(.)projects/[slug]`), so the URL is shareable and Back closes it.
- Visiting the URL directly (or a search engine crawling it) renders the full, indexable case-study page (`src/app/projects/[slug]`).

## AI assistant ("Ask my AI")

A voice + text assistant that answers questions about Hamza's work and can open projects or scroll the page while it talks.

- **Voice:** OpenAI Realtime API over WebRTC (`gpt-realtime-2.1`, voice `marin`). The browser's SDP offer goes to `src/app/api/assistant/voice/route.ts`, which adds the session config and API key server-side — the key never reaches the browser. Calls end automatically after 3 minutes.
- **Text chat:** OpenAI Responses API (`gpt-6-luna`), streamed by `src/app/api/assistant/chat/route.ts`. Project mentions become clickable buttons.
- **Knowledge:** generated from `src/data/*` by `src/lib/knowledge.ts`, so the assistant always matches the site. Its rules live in `src/lib/assistant/server.ts`.
- **Guards:** same-origin check, per-IP rate limits (4 voice calls/hour, 25 messages/10 min), input size limits and a hashed safety identifier sent to OpenAI.
- The assistant only appears when `OPENAI_API_KEY` is set. Put it in `.env.local` (git-ignored) locally and in Vercel's environment variables in production.
- **Cost control:** use a dedicated OpenAI *project* key and set a monthly budget limit on that project — rate limits are per server instance, so the budget is the real cap.

## Color themes

Visitors can pick a color theme from the palette button in the navbar: **Emerald** (default), **Ocean**, **Violet**, **Sunset**, **Rose** and **Mono**. Themes only swap the color tokens (`html[data-theme=…]` blocks in `src/app/globals.css`); fonts and the white background stay the same. The choice is saved in the browser and applied before the first paint, so there's no flash of the default colors. To add or edit a theme, update `THEMES` in `src/lib/theme.ts` and add a matching CSS block.

## Sound

UI sounds are synthesized with the Web Audio API (`src/lib/sound.ts`) — no audio files. They're off by default; visitors switch them on with the speaker button in the navbar.

### Welcome voice

`public/audio/welcome.mp3` greets visitors once per visit ("Welcome to the portfolio of Muhammad Hamza Tanveer Kahloon…"). Browsers block sound before any interaction, so it plays immediately when allowed and otherwise on the first click or tap. It shows a small "Welcome message · AI voice" pill with a stop button, never plays for visitors who turned sounds off, and stops when the AI assistant opens (`src/components/ui/WelcomeVoice.tsx`).

The clip is generated once with OpenAI text-to-speech — no per-visitor cost. To change the words, voice (`marin`, `cedar`, …) or pronunciation, edit `scripts/generate-welcome.mjs` and run `npm run voice:welcome`.

## SEO & LLM SEO

- Per-page metadata, canonical URLs, Open Graph and Twitter cards; generated Open Graph images for the home page and every project
- `sitemap.xml`, `robots.txt` and a web manifest; every project has its own statically generated page
- JSON-LD: `Person` (with occupation and credentials), `WebSite`, `ProfilePage`, `ItemList` of projects, `FAQPage`, `SoftwareApplication` and `BreadcrumbList`
- A visible FAQ section written for the questions recruiters and AI assistants ask
- **`/llms.txt`** (site guide in the [llms.txt](https://llmstxt.org) format) and **`/llms-full.txt`** (the whole portfolio as Markdown), linked from the page head
- `robots.txt` explicitly allows AI search and assistant crawlers (GPTBot, OAI-SearchBot, ClaudeBot, PerplexityBot, Google-Extended, Applebot-Extended and others) and keeps `/api/` private

## Deploy on Vercel

1. Push the repo to GitHub and import it at [vercel.com/new](https://vercel.com/new) (framework: Next.js, no extra settings).
2. Add environment variables (Project → Settings → Environment Variables):
   - `OPENAI_API_KEY` — enables the AI assistant
   - `NEXT_PUBLIC_SITE_URL` — your final domain, e.g. `https://hamzakahloon.com` (if omitted, the Vercel production URL is used)
   - optional: `NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION`, `GITHUB_TOKEN`
3. Deploy. Environment variables are read at build time, so **redeploy after changing them**.
4. After the first deploy:
   - Add the site to [Google Search Console](https://search.google.com/search-console) and submit `https://your-domain/sitemap.xml`.
   - Add it to [Bing Webmaster Tools](https://www.bing.com/webmasters) too — ChatGPT search and Copilot use Bing's index.
   - Put the portfolio URL on your LinkedIn and GitHub profiles so search engines and LLMs connect them.
