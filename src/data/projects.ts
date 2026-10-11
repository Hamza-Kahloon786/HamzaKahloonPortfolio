export const categories = ["AI & LLM", "Voice AI", "SaaS", "Healthcare", "Machine Learning", "Web"] as const;
export type Category = (typeof categories)[number];

export type ProjectGlyph =
  | "phone-call"
  | "stethoscope"
  | "zap"
  | "file-search"
  | "leaf"
  | "plane"
  | "search"
  | "scale"
  | "shopping-bag"
  | "phone"
  | "messages"
  | "dice"
  | "rocket"
  | "bot"
  | "globe"
  | "eye"
  | "briefcase"
  | "brain"
  | "bird"
  | "headset"
  | "wheat"
  | "chart"
  | "book";

export type ProjectShot = {
  src: string;
  alt: string;
  caption?: string;
  width: number;
  height: number;
  /** "device" = transparent mockup (shown without a frame), "screen" = flat screenshot */
  kind: "device" | "screen";
};

export type Project = {
  slug: string;
  title: string;
  tagline: string;
  categories: Category[];
  year: string;
  role: string;
  status: "Production" | "Live" | "Open source" | "Case study";
  summary: string;
  description: string[];
  highlights: string[];
  metrics?: { value: string; label: string }[];
  stack: string[];
  /** post = LinkedIn write-up, video = demo video (e.g. a LinkedIn video post) */
  links: { live?: string; github?: string; post?: string; video?: string };
  /** Cover screenshot (JPG) in /public/projects/<slug>/. Projects without one get a generated cover. */
  image?: string;
  /** Extra screens for the case study. A leading "device" shot becomes the hero. */
  gallery?: ProjectShot[];
  accent: string;
  glyph: ProjectGlyph;
  featured?: boolean;
};

const gh = (repo: string) => `https://github.com/Hamza-Kahloon786/${repo}`;

export const projects: Project[] = [
  {
    slug: "leadfront",
    title: "LeadFront",
    tagline: "The AI front office for service businesses",
    categories: ["Voice AI", "SaaS", "AI & LLM"],
    year: "2025 — 2026",
    role: "Full Stack Developer · Decoders Digital",
    status: "Production",
    summary:
      "An AI business-communication platform: voice and SMS agents that answer every call, qualify leads, book appointments and follow up automatically — with a built-in CRM, campaigns, job scheduling and a technician portal.",
    description: [
      "LeadFront (formerly Vendira.ai) clones a business's best rep. AI voice and SMS agents answer instantly, qualify leads, book appointments and follow up — 24/7, in 10+ languages, on the business's existing phone number.",
      "I built the platform end-to-end at Decoders Digital: the React app, the Node.js services, the real-time voice pipeline and the automations that tie calls, SMS, email, CRM and scheduling into one system.",
    ],
    highlights: [
      "AI inbound receptionist and outbound call campaigns with human-like voices — unlimited parallel calls and ~2-second average response.",
      "Real-time voice pipeline: Twilio telephony, Deepgram speech recognition, OpenAI conversational intelligence and ElevenLabs voices.",
      "Agents auto-detect and switch between 10+ languages mid-call, including Spanish, Hindi and Urdu.",
      "AI agent builder with custom scripts, knowledge-base uploads, premium voice selection and RAG-powered contextual answers.",
      "Appointment booking during live calls with Google Calendar sync and automated SMS reminders.",
      "SMS and email campaigns — bulk sends, templates, delivery / open / click tracking, auto-replies and follow-up sequences.",
      "Unified inbox, built-in CRM with lead scoring and pipeline, a job scheduler and a technician portal for field teams.",
      "Call analytics with AI summaries, outcome tracking, keyword extraction, transcripts and recording playback.",
      "Integrations with Salesforce, HubSpot, Jobber, Stripe, Slack, Zapier and Calendly; AES-256 encryption and role-based access.",
    ],
    metrics: [
      { value: "500+", label: "Businesses automated" },
      { value: "2M+", label: "Minutes handled" },
      { value: "10+", label: "Languages, auto-detected" },
    ],
    stack: ["React", "Vite", "Node.js", "Twilio", "Deepgram", "ElevenLabs", "OpenAI", "RAG", "Stripe", "Google Calendar", "n8n"],
    links: { live: "https://leadfront.net" },
    image: "/projects/leadfront/website.jpg",
    gallery: [
      {
        src: "/projects/leadfront/website.jpg",
        alt: "LeadFront website — the AI front office for service businesses",
        caption: "Talk to the AI live — voice and SMS agents from the landing page.",
        width: 1440,
        height: 900,
        kind: "screen",
      },
      {
        src: "/projects/leadfront/platform.jpg",
        alt: "LeadFront platform stats and always-on features",
        caption: "Always on — plug-and-play agents, 24/7 availability and unlimited parallel calls.",
        width: 1440,
        height: 900,
        kind: "screen",
      },
      {
        src: "/projects/leadfront/crm-demo.jpg",
        alt: "LeadFront live demos and CRM lead view with lead score and pipeline value",
        caption: "Live demos and the built-in CRM — lead scoring, qualified leads and pipeline value.",
        width: 1440,
        height: 900,
        kind: "screen",
      },
    ],
    accent: "#9333ea",
    glyph: "phone-call",
    featured: true,
  },
  {
    slug: "doctor-ai-portal",
    title: "Doctor AI Portal",
    tagline: "Multi-tenant healthcare SaaS with an AI front desk",
    categories: ["Healthcare", "SaaS", "Voice AI"],
    year: "2025 — 2026",
    role: "Lead Full Stack Developer · Decoders Digital",
    status: "Production",
    summary:
      "Transformed a single-clinic doctor portal into a multi-tenant, HIPAA-focused healthcare SaaS with AI voice & chat patient intake and automated SOAP notes.",
    description: [
      "Doctor AI Portal (MedAI Partners) is an autonomous front desk for clinics — it handles patient intake, refill requests and scheduling, then hands doctors structured notes to review.",
      "I led the transformation from a single-clinic system into a true multi-tenant platform: every query scoped by clinic, and every clinic with its own branding, onboarding and reporting.",
    ],
    highlights: [
      "Tenant-level data isolation with clinic_id scoping, plus per-clinic branding, onboarding and reporting.",
      "AI voice and chat intake with Whisper / Deepgram transcription and automated SOAP-note generation with a doctor review and approval workflow.",
      "Prescription refill requests with approve / deny workflow and e-signature support.",
      "Appointment scheduling with provider slot management, waitlist auto-promotion and patient notifications.",
      "Role-based access control across Super Admin, Clinic Admin, Provider and Patient with a permission matrix.",
      "HIPAA-focused security: encryption at rest and in transit, audit logging, session monitoring and a Super Admin dashboard for clinic, revenue and provider metrics.",
    ],
    metrics: [
      { value: "4", label: "Access roles" },
      { value: "2", label: "Speech-to-text engines" },
      { value: "SOAP", label: "Notes auto-generated" },
    ],
    stack: ["React", "Node.js", "PostgreSQL", "Whisper", "Deepgram", "OpenAI"],
    links: { live: "https://platform.medaipartners.com" },
    image: "/projects/doctor-ai-portal/patient-dashboard.jpg",
    gallery: [
      {
        src: "/projects/doctor-ai-portal/patient-dashboard-device.webp",
        alt: "Doctor AI Portal patient dashboard on a tablet — AI intake, call-me voice intake, refill requests, appointments and medications",
        caption: "Patient dashboard — AI chat intake, voice “Call Me” intake, refills, appointments and medications in one place.",
        width: 1800,
        height: 1505,
        kind: "device",
      },
      {
        src: "/projects/doctor-ai-portal/medai-website.jpg",
        alt: "MedAI Partners public website — the autonomous front desk for healthcare clinics",
        caption: "MedAI Partners — the public website.",
        width: 1440,
        height: 900,
        kind: "screen",
      },
    ],
    accent: "#d4a857",
    glyph: "stethoscope",
    featured: true,
  },
  {
    slug: "storm-ai",
    title: "STORM AI",
    tagline: "AI-powered CRM & field-service platform",
    categories: ["SaaS", "AI & LLM"],
    year: "2025",
    role: "Full Stack Developer",
    status: "Production",
    summary:
      "An enterprise multi-tenant CRM for service companies — leads, scheduling, dispatch, invoicing and an AI sales assistant that works over SMS.",
    description: [
      "STORM AI runs the day-to-day of field-service businesses: from the first inbound lead to the technician arriving on site and the invoice being paid.",
      "An AI sales assistant qualifies leads and handles objections over SMS, while a custom AI flow editor lets each company build its own automations.",
    ],
    highlights: [
      "Multi-tenant architecture with role-based access control.",
      "Contact & lead management, drag-and-drop job scheduling, route optimisation and GPS tracking.",
      "AI Sales Assistant with SMS conversations, lead qualification and objection handling.",
      "Automation workflows with Twilio, Google Calendar, QuickBooks and a custom AI flow editor.",
      "Customer portal plus an analytics dashboard with KPIs, lead-conversion tracking and document management.",
    ],
    metrics: [
      { value: "1,000+", label: "Daily active users" },
      { value: "<150ms", label: "Response time" },
      { value: "99.9%", label: "Uptime" },
    ],
    stack: ["Next.js", "React", "Supabase", "Node.js", "FastAPI", "MongoDB", "Twilio", "QuickBooks", "Stripe", "Google Calendar"],
    links: { live: "https://stormai.decodersdigital.net", github: gh("Saas") },
    image: "/projects/storm-ai/website.jpg",
    gallery: [
      {
        src: "/projects/storm-ai/website.jpg",
        alt: "STORM AI website — the all-in-one CRM for service businesses",
        caption: "Product site — CRM, scheduling, quotes & invoices and the AI sales assistant.",
        width: 1440,
        height: 900,
        kind: "screen",
      },
      {
        src: "/projects/storm-ai/features.jpg",
        alt: "STORM AI feature highlights — CRM, scheduling & dispatch, quotes & invoices, AI sales assistant",
        caption: "Feature highlights: CRM, drag-and-drop dispatch, estimates & invoices, AI SMS follow-up.",
        width: 1440,
        height: 900,
        kind: "screen",
      },
    ],
    accent: "#2563eb",
    glyph: "zap",
    featured: true,
  },
  {
    slug: "aipas",
    title: "AIPAS",
    tagline: "AI procurement automation & RAG system",
    categories: ["AI & LLM", "Machine Learning"],
    year: "2023 — 2024",
    role: "Full Stack & AI Engineer",
    status: "Live",
    summary:
      "Converts email-based procurement requests into structured, automated decisions with OCR, NLP and ML — plus a full RAG evaluation framework.",
    description: [
      "AIPAS — live as ProcureHub — connects buyers and vendors on one platform and automates the slow parts of procurement: reading documents, extracting requirements, comparing quotations and choosing the right vendor.",
      "On top sits a RAG comparison system that benchmarks vector stores and retrieval strategies, so every answer the assistant gives can be measured.",
    ],
    highlights: [
      "OCR + NLP pipeline for automated document processing and intelligent vendor selection.",
      "Separate buyer, vendor and admin portals — buyers raise requests and track open requests, quotations received and completed deals.",
      "AI-driven quotation analysis and an in-app AI chat assistant for procurement questions.",
      "92% accuracy on automated procurement decisions through ML algorithms.",
      "RAG comparison system deployed on Hugging Face Spaces with a Gradio UI and an MCP server.",
      "Hierarchical metadata classification with a 3-level taxonomy (domain / section / topic).",
      "Vector search across Chroma, FAISS and Pinecone with metadata filtering.",
      "Evaluation framework with Hit@k, MRR, semantic similarity and latency metrics; presets for hospital, bank and fluid-simulation domains.",
    ],
    metrics: [
      { value: "92%", label: "Decision accuracy" },
      { value: "1,000+", label: "Documents / hour" },
      { value: "35%", label: "Cost reduction" },
    ],
    stack: ["Python", "Django", "FastAPI", "React", "MongoDB", "OCR", "NLP", "RAG", "Chroma", "FAISS", "Pinecone", "Gradio", "Hugging Face"],
    links: { live: "http://aipas.duckdns.org", github: gh("Procurement-Automation-System"), video: "https://www.linkedin.com/posts/hamza-kahloon-12a14125a_project-title-aipas-ai-powered-procurement-ugcPost-7458551299677118464-T92U/" },
    image: "/projects/aipas/landing.jpg",
    gallery: [
      {
        src: "/projects/aipas/landing.jpg",
        alt: "ProcureHub (AIPAS) landing page — revolutionize procurement with AI-driven insights",
        caption: "ProcureHub — AI-driven vendor management and automated quotation analysis.",
        width: 1600,
        height: 736,
        kind: "screen",
      },
      {
        src: "/projects/aipas/buyer-dashboard.jpg",
        alt: "ProcureHub buyer dashboard with total, open and completed procurement requests",
        caption: "Buyer portal — create requests and track quotations from vendors.",
        width: 1600,
        height: 741,
        kind: "screen",
      },
      {
        src: "/projects/aipas/login.jpg",
        alt: "ProcureHub secure sign-in page",
        caption: "Secure sign-in to the procurement hub, with role-based portals.",
        width: 1600,
        height: 712,
        kind: "screen",
      },
    ],
    accent: "#dc2626",
    glyph: "file-search",
    featured: true,
  },
  {
    slug: "ezos-proposal-tool",
    title: "EZOS",
    tagline: "Proposals, commissions & payroll for sales teams",
    categories: ["SaaS"],
    year: "2026",
    role: "Full Stack Developer",
    status: "Production",
    summary:
      "A sales proposal engine and commission tracker for water-treatment sales teams — guided proposals with enforced pricing, branded PDFs, multi-level rep commissions and payroll reporting.",
    description: [
      "EZOS takes a sales team from the first conversation to a signed proposal: reps build a proposal in minutes, and every document goes out as the same branded PDF.",
      "Behind it sits a commission engine that pays out across six tiers of the sales hierarchy, plus a no-code control panel so admins change packages, pricing and financing without a deploy.",
    ],
    highlights: [
      "Guided proposal builder — customer, package, upgrades, margin and financing in one flow.",
      "Admin-set margin ceilings and financing terms, enforced on every proposal.",
      "Branded PDF proposals that print, download and email identically.",
      "Commission dashboard: total sales, revenue and commission owed, revenue and sales by package, and commission by rep with date-range filters.",
      "Sales ledger filtered by rep, water type and status, with install and payment tracking and PDF export.",
      "Multi-level commission splits per package — rep, direct recruiter, team lead, regional, partner and override.",
      "No-code control panel for packages, product types, water types, offices, financiers and adders — changes take effect immediately.",
      "Payroll reporting and user management for authorised staff across the Supreme, Homewater and H2Pros brands.",
    ],
    metrics: [
      { value: "6", label: "Commission tiers per sale" },
      { value: "3", label: "Brands supported" },
      { value: "0", label: "Deploys to change pricing" },
    ],
    stack: ["Next.js", "React"],
    links: { live: "https://ezos.online" },
    image: "/projects/ezos-proposal-tool/dashboard.jpg",
    gallery: [
      {
        src: "/projects/ezos-proposal-tool/dashboard-device.webp",
        alt: "EZOS commission tracker dashboard on a tablet — revenue by package and commission by representative",
        caption: "Commission dashboard — revenue and sales by package, commission owed by representative.",
        width: 1800,
        height: 1395,
        kind: "device",
      },
      {
        src: "/projects/ezos-proposal-tool/sales.jpg",
        alt: "EZOS sales ledger with rep, water type, install and payment status",
        caption: "Sales ledger — filters, install & payment tracking and PDF export.",
        width: 1366,
        height: 606,
        kind: "screen",
      },
      {
        src: "/projects/ezos-proposal-tool/control-panel.jpg",
        alt: "EZOS control panel for packages with multi-level commission splits",
        caption: "No-code control panel — packages, financiers, adders and commission tiers.",
        width: 1352,
        height: 608,
        kind: "screen",
      },
      {
        src: "/projects/ezos-proposal-tool/login.jpg",
        alt: "EZOS proposal tool sign-in page",
        caption: "Sign-in — from first conversation to signed proposal.",
        width: 1440,
        height: 900,
        kind: "screen",
      },
    ],
    accent: "#2563eb",
    glyph: "chart",
    featured: true,
  },
  {
    slug: "chapterlens",
    title: "ChapterLens",
    tagline: "AI that keeps technical books up to date",
    categories: ["AI & LLM", "SaaS"],
    year: "2026",
    role: "Full Stack & AI Engineer",
    status: "Live",
    summary:
      "Upload a technical book chapter and ChapterLens finds outdated facts, researches current sources, proposes style-matched rewrites with citations and exports a tracked, print-ready document.",
    description: [
      "Technical books go out of date fast. ChapterLens scans every factual claim in a chapter, flags what's stale and researches what's true today.",
      "Authors stay in control: every proposed change comes with cited sources, can be approved, edited or rejected, and is rewritten to match their own voice.",
    ],
    highlights: [
      "Drag-and-drop DOCX upload up to 50 MB — text, figures, tables and equations extracted instantly.",
      "GPT-4o scans every factual claim, flags outdated content and profiles the author's writing style.",
      "Automated web research pulls current data from government, academic and technical sources, cited per claim.",
      "Side-by-side review of original vs. updated text — approve, edit or reject each change.",
      "Style-matched rewrites that keep the author's tone, grade level and sentence structure.",
      "Exports an updated DOCX, a highlighted DOCX, PDF previews, a CSV changelog and a full audit trail.",
    ],
    metrics: [
      { value: "14", label: "Pipeline stages" },
      { value: "4", label: "Export formats" },
      { value: "7+", label: "Focus areas" },
    ],
    stack: ["Next.js", "React", "OpenAI"],
    links: { live: "https://chapteragent.spacetechnologyseries.com" },
    image: "/projects/chapterlens/website.jpg",
    gallery: [
      {
        src: "/projects/chapterlens/website.jpg",
        alt: "ChapterLens website — textbook updates powered by AI",
        caption: "Upload → analyse → research → compare → review → export.",
        width: 1440,
        height: 900,
        kind: "screen",
      },
      {
        src: "/projects/chapterlens/features.jpg",
        alt: "ChapterLens capabilities — upload, AI analysis, research, review, rewrites and export",
        caption: "Capabilities — from document parsing to AI research and style-matched rewrites.",
        width: 1440,
        height: 900,
        kind: "screen",
      },
    ],
    accent: "#0ea5e9",
    glyph: "book",
    featured: true,
  },
  {
    slug: "chainscope-ai",
    title: "ChainScope AI",
    tagline: "Carbon intelligence for UK supply chains",
    categories: ["AI & LLM", "Machine Learning", "SaaS"],
    year: "2026",
    role: "Full Stack & ML Engineer",
    status: "Open source",
    summary:
      "A full-stack SaaS that finds carbon hotspots across UK supply chains, forecasts emissions with ML and recommends reductions on an interactive map.",
    description: [
      "ChainScope AI (the app ships as EchoChain — Carbon Identifier) gives sustainability teams one view of their whole supply chain — suppliers, warehouses and transport routes — with the emissions of each one calculated automatically.",
      "Machine-learning forecasts and an AI assistant turn that data into actions: which routes to switch, which sites to fix first, and a compliance-ready report.",
    ],
    highlights: [
      "Scope 1 / 2 / 3 tracking using UK DEFRA 2024 emission factors for fuel, electricity, gas and freight — with a dashboard of total emissions, scope breakdown, monthly trend and emissions by category.",
      "Carbon hotspot map with suppliers, warehouses and routes — AI-generated insights on every marker.",
      "RandomForest regression forecasting — historical vs. forecasted emissions with an adjustable horizon of up to 12 months.",
      "Route optimisation on real roads via Google Directions with per-mode savings (road, rail, sea, air).",
      "Live UK grid page from the National Grid ESO Carbon Intensity API — current gCO₂/kWh with a rating, renewable / low-carbon / fossil share, generation mix and a 48-hour forecast.",
      "AI Assistant on GPT-4o-mini — risk-rated recommendations with quick wins and prioritised, scope-tagged actions, an Ask AI chat and SECR compliance report generation.",
      "Stripe subscriptions and Excel / CSV bulk import for suppliers.",
    ],
    metrics: [
      { value: "12-mo", label: "Emission forecasts" },
      { value: "Scope 1–3", label: "Emissions tracked" },
      { value: "48h", label: "Grid forecast" },
    ],
    stack: ["React", "Vite", "Tailwind CSS", "FastAPI", "MongoDB", "scikit-learn", "OpenAI", "Google Maps", "Stripe"],
    links: { github: gh("Echochain") },
    image: "/projects/chainscope-ai/dashboard.jpg",
    gallery: [
      {
        src: "/projects/chainscope-ai/dashboard.jpg",
        alt: "ChainScope AI (EchoChain) dashboard — total and Scope 1/2/3 emissions with live UK grid carbon intensity",
        caption: "Dashboard — total and Scope 1 / 2 / 3 emissions, live grid intensity and the scope breakdown.",
        width: 1600,
        height: 740,
        kind: "screen",
      },
      {
        src: "/projects/chainscope-ai/forecasting.jpg",
        alt: "ChainScope AI emissions forecasting with RandomForest regression over a 12-month horizon",
        caption: "Forecasting — RandomForest regression, historical vs. forecasted emissions over 12 months.",
        width: 1600,
        height: 739,
        kind: "screen",
      },
      {
        src: "/projects/chainscope-ai/live-uk-grid.jpg",
        alt: "ChainScope AI live UK grid page with carbon intensity, renewable share and generation mix",
        caption: "Live UK Grid — real-time carbon intensity and generation mix from the National Grid ESO API.",
        width: 1600,
        height: 738,
        kind: "screen",
      },
      {
        src: "/projects/chainscope-ai/ai-assistant.jpg",
        alt: "ChainScope AI assistant with risk-rated recommendations, quick wins and scope-tagged actions",
        caption: "AI Assistant — GPT-4o-mini recommendations, Ask AI and SECR report generation.",
        width: 1600,
        height: 739,
        kind: "screen",
      },
    ],
    accent: "#16a34a",
    glyph: "leaf",
    featured: true,
  },
  {
    slug: "legal-assistant-ai",
    title: "Legal Assistant AI",
    tagline: "Enterprise RAG for legal research",
    categories: ["AI & LLM"],
    year: "2025",
    role: "Full Stack & AI Engineer",
    status: "Case study",
    summary:
      "An enterprise RAG-powered legal assistant that retrieves the right clauses and precedents from a vector store and answers with GPT-4 — deployed at 5+ law firms.",
    description: [
      "Lawyers ask questions in plain language; the assistant embeds the query, retrieves the most relevant passages from a ChromaDB vector store and has GPT-4 answer strictly from that context.",
      "The result is research that is faster and traceable — every answer comes with the sources it was built from.",
    ],
    highlights: [
      "Retrieval pipeline: embedding model → ChromaDB vector store → top-k retrieval → GPT-4 with grounded context.",
      "Answers cite the exact section and source file (e.g. Section 148(g) of the Legal Profession Act 1966) and show a confidence level plus the top source chunks with similarity scores.",
      "Document library: upload legal PDFs, automatic chunking (141 chunks for a single Act), processing status, search and type filters.",
      "Chat history with search, favourites and filters; save and export conversations.",
      "Built-in legal disclaimers on every response and role-based accounts for lawyers.",
      "94% answer accuracy on legal queries.",
      "70% faster legal research for the teams using it.",
      "Deployed at 5+ law firms, saving an estimated $50K+ per firm annually.",
    ],
    metrics: [
      { value: "94%", label: "Answer accuracy" },
      { value: "70%", label: "Faster research" },
      { value: "5+", label: "Law firms" },
    ],
    stack: ["React", "Node.js", "OpenAI", "Chroma", "RAG"],
    links: {
      post: "https://www.linkedin.com/posts/hamza-kahloon-12a14125a_ai-legaltech-fullstackdevelopment-activity-7372317966253645825-dIFH",
    },
    image: "/projects/legal-assistant-ai/chat.jpg",
    gallery: [
      {
        src: "/projects/legal-assistant-ai/chat.jpg",
        alt: "Legal AI Assistant chat answering a question about the Legal Profession Act 1966 with a cited section",
        caption: "Ask in plain language — answers quote the exact section and source document.",
        width: 1280,
        height: 592,
        kind: "screen",
      },
      {
        src: "/projects/legal-assistant-ai/cited-sources.jpg",
        alt: "Legal AI Assistant answer with confidence level and five ranked source chunks",
        caption: "Every answer shows a confidence level and the ranked source chunks it was built from.",
        width: 1280,
        height: 591,
        kind: "screen",
      },
      {
        src: "/projects/legal-assistant-ai/chat-history.jpg",
        alt: "Legal AI Assistant chat history with search, favourites and filters",
        caption: "Chat history — search, favourites and filters, with full conversations and sources.",
        width: 1280,
        height: 592,
        kind: "screen",
      },
      {
        src: "/projects/legal-assistant-ai/document-library.jpg",
        alt: "Legal AI Assistant document library showing a processed PDF split into 141 chunks",
        caption: "Document library — uploads are processed and chunked for retrieval (141 chunks for one Act).",
        width: 1280,
        height: 398,
        kind: "screen",
      },
    ],
    accent: "#0284c7",
    glyph: "scale",
    featured: true,
  },
  {
    slug: "tripai",
    title: "TripAI",
    tagline: "AI trip planner with streaming itineraries",
    categories: ["AI & LLM", "Machine Learning"],
    year: "2026",
    role: "Full Stack & AI Engineer",
    status: "Open source",
    summary:
      "Travellers across Pakistan describe their preferences and get a complete, personalised itinerary in minutes — streamed live from GPT-4.1-mini and enriched with real routes, live weather, ML cost predictions and budget-matched hotels.",
    description: [
      "TripAI turns a short multi-step form into a full day-by-day trip — say Lahore to Hunza Valley or Naran. The itinerary streams in as it's generated, so users watch their plan take shape.",
      "Behind the scenes, AI jobs run on a Redis-backed queue and a separate Python service handles the machine-learning recommendations.",
    ],
    highlights: [
      "Streaming itineraries over Server-Sent Events from OpenAI GPT-4.1-mini.",
      "Background AI jobs with Redis + BullMQ workers for reliable generation.",
      "Python Flask ML microservice — RandomForest regression and content-based filtering.",
      "Real routes from Google Maps — distance, travel time and alternative routes on an embedded route map.",
      "Live weather from OpenWeatherMap plus a climate-suitability score per destination and month, with best months to visit and warnings for snow-blocked passes.",
      "ML cost prediction with a per-person budget breakdown in PKR, and hotel recommendations matched to the budget.",
      "Saved trip plans for every user, downloadable as PDF.",
      "React 19 front end with Redux Toolkit, React Query and validated multi-step forms.",
    ],
    stack: ["React", "Redux", "Node.js", "Express", "MongoDB", "Redis", "OpenAI", "Flask", "scikit-learn", "Google Maps"],
    links: { github: gh("AI-Based-Trip-Planner"), video: "https://www.linkedin.com/posts/hamza-kahloon-12a14125a_machinelearning-artificialintelligence-mern-ugcPost-7486188742291079168-yAGk/" },
    accent: "#6d28d9",
    glyph: "plane",
    featured: true,
  },
  {
    slug: "garage-ai",
    title: "GarageAI",
    tagline: "Missed calls → ready-to-book leads for UK garages",
    categories: ["SaaS", "Voice AI"],
    year: "2026",
    role: "Full Stack Developer",
    status: "Live",
    summary:
      "A lead-recovery SaaS for UK garages: every missed call triggers one polite SMS that guides the customer to a short form and delivers a ready-to-book lead.",
    description: [
      "Garages lose work every time the phone rings out. GarageAI catches each missed call, texts the caller instantly and walks them through a simple form.",
      "The garage receives a clean lead — vehicle, registration and the job needed — without changing its phone number.",
    ],
    highlights: [
      "Real-time missed-call detection with an instant SMS follow-up, working with the garage's existing number.",
      "Guided lead form capturing vehicle, registration and service required.",
      "ROI calculator, transparent £49/month pricing and an admin dashboard.",
      "GDPR-compliant lead handling, built for the UK market.",
    ],
    stack: ["React", "Vite", "Tailwind CSS", "SMS automation"],
    metrics: [
      { value: "95%", label: "Missed-call detection" },
      { value: "<3s", label: "SMS response time" },
      { value: "47%", label: "Lead conversion" },
    ],
    links: { live: "https://www.garageai.co.uk", github: gh("Garages_misscall_detect") },
    image: "/projects/garage-ai/website.jpg",
    gallery: [
      {
        src: "/projects/garage-ai/website.jpg",
        alt: "GarageAI website — turn your missed calls into leads",
        caption: "Real-time missed-call detection with an instant SMS follow-up.",
        width: 1440,
        height: 900,
        kind: "screen",
      },
      {
        src: "/projects/garage-ai/insights.jpg",
        alt: "GarageAI growth insights — detection accuracy, SMS response time, lead conversion",
        caption: "Growth insights and the revenue calculator for garage owners.",
        width: 1440,
        height: 900,
        kind: "screen",
      },
    ],
    accent: "#7c6cff",
    glyph: "phone",
    featured: true,
  },
  {
    slug: "intellex-crm",
    title: "Intellex CRM",
    tagline: "One AI inbox for every social account",
    categories: ["SaaS", "AI & LLM"],
    year: "2025",
    role: "Frontend & Product Engineer",
    status: "Live",
    summary:
      "A multi-account social-media CRM that unifies Facebook, Instagram and WhatsApp conversations, scores leads automatically and replies with AI.",
    description: [
      "Intellex pulls every conversation from a company's social accounts into one inbox, so no message — and no lead — slips through.",
      "Each conversation gets a lead score, and AI auto-responses keep customers engaged around the clock.",
    ],
    highlights: [
      "Unified inbox across Facebook, Instagram and WhatsApp accounts.",
      "Automatic lead scoring on every conversation.",
      "AI auto-responses with real-time notifications over WebSockets.",
      "Overview dashboard: connected accounts, conversations, unread messages and qualified leads.",
    ],
    stack: ["React", "WebSockets", "AI auto-response", "Lead scoring"],
    links: { live: "https://intellex-orcin.vercel.app", github: gh("intellex") },
    image: "/projects/intellex-crm/dashboard.jpg",
    accent: "#3b82f6",
    glyph: "messages",
    featured: true,
  },
  {
    slug: "ai-visibility-api",
    title: "AI Visibility Intelligence API",
    tagline: "A 3-agent pipeline for AI-search visibility",
    categories: ["AI & LLM"],
    year: "2026",
    role: "Backend & AI Engineer",
    status: "Open source",
    summary:
      "A Flask REST API that profiles a business, runs a 3-agent AI pipeline to discover high-value AI-search queries, scores each opportunity and recommends content to close the gaps.",
    description: [
      "As more people search through AI assistants, businesses need to know which questions they should be the answer to. This API finds them.",
      "Three agents work in sequence — discovering queries in the business's competitive space, scoring them for opportunity and generating content recommendations.",
    ],
    highlights: [
      "3-agent AI pipeline: query discovery → opportunity scoring → content recommendations.",
      "Transparent opportunity-score formula, with real data and a heuristic fallback.",
      "Dockerised with Gunicorn; database migrations run automatically on boot.",
      "Documented API reference, prompt-engineering notes and a test suite.",
    ],
    stack: ["Python", "Flask", "OpenAI", "Docker", "pytest"],
    links: { github: gh("AI-Visibility-Intelligence-API") },
    accent: "#a78bfa",
    glyph: "search",
  },
  {
    slug: "nexpreneur-ai",
    title: "NexpreneurAI",
    tagline: "Launch a business — no tech or English skills needed",
    categories: ["AI & LLM", "SaaS"],
    year: "2026",
    role: "Full Stack Developer",
    status: "Live",
    summary:
      "An AI platform that helps first-time founders launch and grow: describe an idea in your own language and get a business plan, product descriptions and more.",
    description: [
      "NexpreneurAI is built for people who have a business idea but not the technical or English skills to execute it.",
      "Users pick their language, describe their idea, and the platform generates the documents they need to get started — then tracks their progress.",
    ],
    highlights: [
      "Pick from 10 interface languages on first visit — including Urdu, Arabic, Hindi, Bengali, Pashto, Somali, Turkish, Polish and Romanian.",
      "Describe a skill or idea in a few words and get a personalised business plan — product ideas, pricing suggestions, marketing strategy and next steps.",
      "AI tools that generate product listings, social-media content and visuals.",
      "Learning Hub with guides on selling and growing, plus FAQs and support.",
      "Progress dashboard for completed AI tasks and activity over time.",
      "Email / password and Google OAuth sign-in with protected routes.",
    ],
    stack: ["React", "Vite", "Tailwind CSS", "Node.js", "Express", "MongoDB"],
    metrics: [{ value: "10", label: "Interface languages" }],
    links: { live: "https://nexpreneurai.com", github: gh("NexpreneurAI") },
    image: "/projects/nexpreneur-ai/website.jpg",
    gallery: [
      {
        src: "/projects/nexpreneur-ai/website.jpg",
        alt: "NexpreneurAI home — turn your skills into a real business with AI by your side",
        caption: "AI-powered business guidance for everyone — no technical skills, no language barriers.",
        width: 1440,
        height: 900,
        kind: "screen",
      },
      {
        src: "/projects/nexpreneur-ai/languages.jpg",
        alt: "NexpreneurAI language picker with ten languages",
        caption: "First step: choose from ten languages, from English and Urdu to Pashto and Somali.",
        width: 1440,
        height: 900,
        kind: "screen",
      },
      {
        src: "/projects/nexpreneur-ai/how-it-works.jpg",
        alt: "NexpreneurAI how it works — idea, AI business plan, AI growth tools",
        caption: "How it works — share an idea, get an AI business plan, grow with AI tools.",
        width: 1440,
        height: 900,
        kind: "screen",
      },
    ],
    accent: "#f97316",
    glyph: "rocket",
  },
  {
    slug: "virtual-ai-companion",
    title: "Virtual AI Companion",
    tagline: "A 3D chatbot you can talk to",
    categories: ["Voice AI", "AI & LLM"],
    year: "2024",
    role: "Full Stack & AI Engineer",
    status: "Open source",
    summary:
      "An interactive 3D AI companion with a voice interface — real-time speech-to-text and text-to-speech, contextual NLP responses and animated WebGL characters.",
    description: [
      "A 3D character rendered in the browser that listens, understands and talks back — combining WebGL, voice processing and NLP in one experience.",
    ],
    highlights: [
      "Interactive 3D companion rendered with WebGL / Three.js (React Three Fiber).",
      "Real-time voice processing with speech-to-text and text-to-speech.",
      "NLP models for contextual understanding and personalised responses.",
      "Responsive front end with video-call style interaction and real-time animations.",
    ],
    stack: ["React", "Three.js", "FastAPI", "NLP", "Voice AI"],
    links: { github: gh("r3f-Virtual-GF") },
    accent: "#ec4899",
    glyph: "bot",
  },
  {
    slug: "nozama-ai",
    title: "Nozama.ai",
    tagline: "AI-powered e-commerce marketplace",
    categories: ["AI & LLM", "Machine Learning"],
    year: "2025",
    role: "Full Stack Developer",
    status: "Case study",
    summary:
      "A marketplace with ML-driven product recommendations, a dynamic pricing engine and a 24/7 AI support chatbot.",
    description: [
      "Nozama.ai brings AI to every step of shopping — what customers see, what they pay and how they get help.",
    ],
    highlights: [
      "ML-driven product recommendations with 96% accuracy.",
      "Dynamic pricing engine.",
      "24/7 AI chatbot support for customers.",
    ],
    metrics: [{ value: "96%", label: "Recommendation accuracy" }],
    stack: ["React", "Node.js", "MongoDB", "Machine Learning"],
    links: { video: "https://www.linkedin.com/posts/hamza-kahloon-12a14125a_fullstackdevelopment-aimarketplace-react-ugcPost-7369043559905136640-dOR7/" },
    accent: "#fb7185",
    glyph: "shopping-bag",
  },
  {
    slug: "risksim-enterprise",
    title: "RiskSim Enterprise",
    tagline: "Monte Carlo risk simulation platform",
    categories: ["SaaS", "Machine Learning"],
    year: "2025",
    role: "Full Stack Developer",
    status: "Open source",
    summary:
      "Enterprise risk management with 10,000-iteration Monte Carlo simulations, an interactive scenario canvas and financial-impact analysis.",
    description: [
      "RiskSim helps organisations put a number on risk: model a scenario, run thousands of simulations and see the likely financial impact — and the ROI of defending against it.",
    ],
    highlights: [
      "10,000-iteration Monte Carlo risk simulations powered by NumPy / SciPy.",
      "Interactive canvas for building risk scenarios.",
      "Financial impact, revenue-loss and security-ROI calculations.",
      "Multi-location risk monitoring, incident tracking and defence-effectiveness metrics.",
    ],
    metrics: [{ value: "10,000", label: "Iterations per simulation" }],
    stack: ["React", "TypeScript", "Tailwind CSS", "FastAPI", "MongoDB", "NumPy"],
    links: { github: gh("risk_simulation") },
    accent: "#ef4444",
    glyph: "dice",
  },
  {
    slug: "ai-call-center",
    title: "AI Call Center",
    tagline: "Production call-center SaaS with AI voice",
    categories: ["Voice AI", "SaaS"],
    year: "2025",
    role: "Full Stack Developer",
    status: "Open source",
    summary:
      "A scalable, production-ready call-center SaaS with a modern UI, a robust backend and AI-powered voice integration — built for real users, not just an MVP.",
    description: [
      "Designed from day one as a production system: a modern interface for teams, a backend built to scale, and AI voice built into the call flow.",
    ],
    highlights: [
      "AI-powered voice integration inside the call flow.",
      "JavaScript front end with Python services and a PostgreSQL data layer.",
      "Architected for scale and real users rather than a throwaway MVP.",
    ],
    stack: ["React", "Python", "PostgreSQL", "Voice AI"],
    links: { github: gh("Call_Center") },
    accent: "#f472b6",
    glyph: "headset",
  },
  {
    slug: "project-pilot-hub",
    title: "ProjectPilotHub",
    tagline: "Software-studio site with an AI assistant",
    categories: ["Web", "AI & LLM"],
    year: "2026",
    role: "Full Stack Developer",
    status: "Live",
    summary:
      "Marketing site and API for a software studio offering FYP solutions, SaaS development, AI automation and ML/NLP services — built SEO-first with Next.js.",
    description: [
      "A fast, SEO-focused marketing site that presents the studio's services and work, with an AI assistant ready to answer visitors' questions.",
    ],
    highlights: [
      "Next.js App Router front end with a full SEO setup.",
      "Express API that emails contact-form submissions via Nodemailer.",
      "“Ask ProjectPilotHub AI” assistant available on every page.",
      "Services, portfolio, hire-a-developer and blog sections.",
    ],
    stack: ["Next.js", "React", "Node.js", "Express"],
    links: { live: "https://project-pilot-hub.vercel.app", github: gh("ProjectPilotHub") },
    image: "/projects/project-pilot-hub/website.jpg",
    accent: "#9b6dff",
    glyph: "globe",
  },
  {
    slug: "laser-eye-clinic",
    title: "Usman Laser Eye Clinic",
    tagline: "Patient registration, tokens & appointments",
    categories: ["Healthcare", "Web"],
    year: "2026",
    role: "Full Stack Developer",
    status: "Open source",
    summary:
      "A MERN system for a real eye clinic: reception registers patients without duplicates and issues daily queue tokens; doctors work the queue and open full records.",
    description: [
      "Built around how the clinic actually works — a receptionist at the front desk and doctors moving through a daily queue.",
    ],
    highlights: [
      "Permanent, atomically generated MR numbers per patient (e.g. MR-000001).",
      "Search by name, phone or MR number to reuse existing records — no duplicates.",
      "Daily token queue with per-patient status flow for doctors.",
      "JWT authentication with Receptionist and Doctor roles; appointment management and stats.",
    ],
    stack: ["React", "Vite", "Tailwind CSS", "Node.js", "Express", "MongoDB"],
    links: { github: gh("Laser-Eye-Clinic") },
    accent: "#14b8a6",
    glyph: "eye",
  },
  {
    slug: "actuarial-job-board",
    title: "Actuarial Job Board",
    tagline: "Scraped listings with a full CRUD dashboard",
    categories: ["Web"],
    year: "2025",
    role: "Full Stack Developer",
    status: "Open source",
    summary:
      "A full-stack job board that scrapes actuarial postings from Actuary List with Selenium and serves them through a Flask API and React UI with filtering and sorting.",
    description: ["Built as a hiring assessment for Bitbash — scraping, API and UI in one clean full-stack project."],
    highlights: [
      "Selenium scraper for automated job-data collection.",
      "Flask REST API with SQLAlchemy on PostgreSQL / MySQL.",
      "React UI to view, add, edit and delete jobs with filtering and sorting.",
    ],
    stack: ["Python", "Flask", "PostgreSQL", "React", "Selenium"],
    links: { github: gh("Scraping") },
    accent: "#60a5fa",
    glyph: "briefcase",
  },
  {
    slug: "anxiety-detection-urdu",
    title: "Anxiety Detection in Urdu",
    tagline: "NLP for mental-health signals in Urdu text",
    categories: ["Machine Learning", "AI & LLM"],
    year: "2022",
    role: "ML Engineer · Final-year research",
    status: "Case study",
    summary:
      "An NLP model trained on a custom Urdu dataset to detect anxiety in text, served through a Flask API with a Streamlit interface — 88% classification accuracy.",
    description: [
      "Most mental-health NLP work targets English. This project built a custom Urdu dataset and a classifier that detects anxiety in Urdu text in real time.",
    ],
    highlights: [
      "Custom Urdu dataset for mental-health analysis.",
      "Flask API for real-time text classification.",
      "Streamlit interface for interactive exploration.",
      "88% anxiety-classification accuracy.",
    ],
    metrics: [{ value: "88%", label: "Classification accuracy" }],
    stack: ["Python", "Streamlit", "Flask", "NLP", "scikit-learn"],
    links: {},
    accent: "#2dd4bf",
    glyph: "brain",
  },
  {
    slug: "bird-sound-recognition",
    title: "Bird Sound Recognition",
    tagline: "Species classification from audio",
    categories: ["Machine Learning"],
    year: "2025",
    role: "AI/ML Engineer · Decoders Digital",
    status: "Case study",
    summary:
      "An AI/ML system that identifies bird species from their calls using audio signal processing and machine learning.",
    description: [
      "Raw field recordings are processed into features a model can learn from, then classified into species automatically.",
    ],
    highlights: [
      "Audio signal processing to turn raw recordings into model-ready features.",
      "Machine-learning classifier for automated species identification.",
    ],
    stack: ["Python", "Machine Learning", "Audio processing"],
    links: {},
    accent: "#84cc16",
    glyph: "bird",
  },
  {
    slug: "grain-hub",
    title: "Grain Hub",
    tagline: "Brand website for a grain supplier",
    categories: ["Web"],
    year: "2025",
    role: "Frontend Developer",
    status: "Live",
    summary:
      "A business website for a supplier of premium wheat, rice and flour — products, services, team and contact, with a hero carousel and a consent modal.",
    description: ["A clean, image-led brand site that presents the supplier's products and promise to customers."],
    highlights: [
      "Hero carousel with product storytelling.",
      "Products, services, team and contact sections.",
      "“Natural promise” consent modal on first visit.",
    ],
    stack: ["React"],
    links: { live: "https://grain-hubs.vercel.app", github: gh("GrainHubs") },
    image: "/projects/grain-hub/website.jpg",
    accent: "#65a30d",
    glyph: "wheat",
  },
];

export const featuredProjects = projects.filter((p) => p.featured);

export function getProject(slug: string) {
  return projects.find((p) => p.slug === slug);
}

export function getAdjacentProjects(slug: string) {
  const i = projects.findIndex((p) => p.slug === slug);
  const prev = projects[(i - 1 + projects.length) % projects.length];
  const next = projects[(i + 1) % projects.length];
  return { prev, next };
}

export function projectsUsing(tech: string) {
  const t = tech.toLowerCase();
  return projects.filter((p) => p.stack.some((s) => s.toLowerCase() === t));
}
