export type Experience = {
  company: string;
  role: string;
  period: string;
  location: string;
  type: string;
  summary: string;
  bullets: string[];
  stack: string[];
  /** Project slugs delivered in this role */
  projects: string[];
};

export const experience: Experience[] = [
  {
    company: "Decoders Digital",
    role: "Full Stack Developer — AI/ML",
    period: "2025 — Present",
    location: "Lahore, Punjab",
    type: "Full-time",
    summary:
      "Building AI-first SaaS products end-to-end — voice agents, healthcare platforms and ML systems — and running them in production.",
    bullets: [
      "Developed LeadFront (formerly Vendira.ai), a full-stack AI voice agents SaaS automating phone calls, customer support and sales across voice, email, SMS and chat (Twilio, Deepgram, ElevenLabs, OpenAI, n8n).",
      "Led the SaaS transformation of Doctor AI Portal into a multi-tenant, HIPAA-focused healthcare platform with tenant-level data isolation, role-based access control and AI-powered patient intake (Whisper / Deepgram).",
      "Built an AI/ML bird sound recognition system using audio signal processing and machine learning for automated species classification.",
      "Deployed and maintained production applications with Docker, Gzip compression and traffic handling for high-load environments.",
    ],
    stack: ["React", "Node.js", "PostgreSQL", "Twilio", "ElevenLabs", "OpenAI", "n8n", "Whisper", "Deepgram", "Docker"],
    projects: ["leadfront", "doctor-ai-portal", "storm-ai", "bird-sound-recognition"],
  },
  {
    company: "Pangea Global Enterprise (PGE)",
    role: "Full Stack Developer — AI/ML",
    period: "2022 — 2025",
    location: "Lahore, Punjab",
    type: "Full-time · 3 years",
    summary:
      "Architected enterprise AI/ML web applications serving multiple organisations on a multi-tenant architecture.",
    bullets: [
      "Architected and deployed enterprise-grade AI/ML web applications using React.js, Next.js, Angular, Node.js and Python, serving multiple organisations with multi-tenant architecture.",
      "Developed and integrated machine learning models for intelligent data processing, automated decision-making and real-time conversational AI systems.",
      "Built robust REST APIs and FastAPI microservices for frontend–backend communication and AI model deployment, documented with OpenAPI.",
      "Implemented NLP-powered chatbots, voice AI (Vapi, Twilio, ElevenLabs), RAG systems and LangChain / LangGraph agent workflows.",
      "Engineered real-time communication with WebSockets, voice/SMS capabilities and multi-channel automation using n8n workflows.",
      "Optimised production deployments on VPS, Vercel and Railway with Docker, Gzip compression and traffic handling for high-load applications.",
    ],
    stack: ["React", "Next.js", "Angular", "Node.js", "Python", "FastAPI", "LangChain", "LangGraph", "Vapi", "WebSockets", "Docker"],
    projects: ["aipas", "legal-assistant-ai", "nozama-ai", "virtual-ai-companion"],
  },
  {
    company: "Freelance",
    role: "Software Developer",
    period: "2021 — 2022",
    location: "Lahore · Remote",
    type: "Freelance",
    summary: "Where it started — building software for real clients while studying Software Engineering.",
    bullets: [
      "Built Java applications for clients, including a complete hospital management system.",
      "Learned to own delivery end-to-end: gathering requirements, building, shipping and supporting real users.",
    ],
    stack: ["Java", "MySQL", "HTML5", "CSS", "JavaScript"],
    projects: [],
  },
];
