export const profile = {
  name: "Hamza Kahloon",
  fullName: "Muhammad Hamza Tanveer Kahloon",
  firstName: "Hamza",
  lastName: "Kahloon",
  title: "Full Stack Developer & AI/ML Engineer",
  roles: ["Full Stack Developer", "AI / ML Engineer", "Voice AI Specialist", "SaaS Architect"],
  /** Rotating phrases in the hero: "I build ___" */
  builds: ["AI voice agents", "RAG pipelines", "multi-tenant SaaS", "LLM-powered products", "automation workflows"],
  intro:
    "I design, build and ship intelligent web products — from AI voice agents that answer real phone calls to RAG systems and multi-tenant SaaS platforms used every day.",
  location: "Lahore, Pakistan",
  timeZone: "Asia/Karachi",
  company: "Decoders Digital",
  email: "hamzaakahloon903@gmail.com",
  phone: "+92 309 1453950",
  phoneHref: "tel:+923091453950",
  whatsapp: "https://wa.me/923091453950",
  linkedin: "https://www.linkedin.com/in/hamza-kahloon-12a14125a/",
  github: "https://github.com/Hamza-Kahloon786",
  githubUser: "Hamza-Kahloon786",
  availability: "Open to full-time roles & freelance projects",
  headshot: "/images/hamza-headshot.jpg",
  cutout: "/images/hamza-cutout.png",
  resume: "/resume.pdf",
  stats: [
    { value: 4, suffix: "+", label: "Years building" },
    { value: 25, suffix: "+", label: "Projects shipped" },
    { value: 15, suffix: "+", label: "AI models deployed" },
    { value: 1000, suffix: "+", label: "Daily active users" },
  ],
  education: {
    school: "The University of Lahore",
    degree: "BS Software Engineering",
    year: "2022",
    grade: "CGPA 3.3 / 4.0",
    location: "Lahore, Punjab",
  },
  about: [
    "I'm Hamza — a full stack developer who specialises in AI. For more than four years I've been turning ideas into intelligent products: voice agents that pick up real phone calls, multi-tenant platforms that clinics and field-service teams run on daily, and retrieval systems that make documents genuinely useful.",
    "I like owning the whole lifecycle — the interface, the API, the model integration and the deployment — because that's where a product actually comes together. Every project here was built to serve real users, not to sit in a demo.",
  ],
  pillars: [
    {
      title: "AI Engineering",
      icon: "brain",
      text: "LLMs, RAG pipelines, LangChain & LangGraph agents, NLP, OCR and evaluation frameworks that prove the model works.",
    },
    {
      title: "Full-stack Product",
      icon: "layers",
      text: "React, Next.js and Angular front ends on Node.js, FastAPI and Django back ends — multi-tenant, secure and fast.",
    },
    {
      title: "Voice & Automation",
      icon: "audio",
      text: "Twilio, ElevenLabs, Vapi, Whisper and Deepgram voice agents, wired into n8n workflows across voice, SMS, email and chat.",
    },
  ],
} as const;

export const journey = [
  {
    year: "2021",
    title: "First lines, first clients",
    text: "Started freelancing — building Java applications, including a complete hospital management system.",
    tag: "Freelance",
  },
  {
    year: "2022",
    title: "BS Software Engineering",
    text: "Graduated from The University of Lahore (CGPA 3.3). Final-year research: anxiety detection in Urdu text with NLP — 88% accuracy.",
    tag: "Education",
  },
  {
    year: "2022",
    title: "Pangea Global Enterprise",
    text: "Joined PGE as a Full Stack Developer (AI/ML) — enterprise multi-tenant apps, FastAPI microservices and ML integrations.",
    tag: "Career",
  },
  {
    year: "2023",
    title: "Specialising in AI",
    text: "Built AIPAS — procurement automation with OCR, NLP and RAG, reaching 92% accuracy on automated decisions.",
    tag: "AI / ML",
  },
  {
    year: "2024",
    title: "Voice, 3D & agents",
    text: "Shipped voice-enabled AI experiences, NLP chatbots and LangChain / LangGraph agent workflows for production clients.",
    tag: "Voice AI",
  },
  {
    year: "2025",
    title: "Decoders Digital",
    text: "Joined Decoders Digital. Launched LeadFront (formerly Vendira.ai) AI voice agents and STORM AI — a CRM serving 1,000+ daily active users.",
    tag: "Career",
  },
  {
    year: "2026",
    title: "AI for healthcare",
    text: "Led the multi-tenant, HIPAA-focused rebuild of Doctor AI Portal with AI patient intake and automated SOAP notes.",
    tag: "Now",
  },
] as const;
