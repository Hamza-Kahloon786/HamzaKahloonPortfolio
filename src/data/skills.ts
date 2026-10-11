export type SkillGroup = {
  title: string;
  motto: string;
  items: string[];
};

/** Names must match keys in components/ui/TechIcon.tsx and project `stack` entries. */
export const skillGroups: SkillGroup[] = [
  {
    title: "AI & LLM",
    motto: "Think. Build. Automate.",
    items: ["OpenAI", "LangChain", "LangGraph", "Hugging Face", "RAG", "NLP", "OCR", "Gradio", "Streamlit"],
  },
  {
    title: "Voice & Real-time",
    motto: "Conversations at scale.",
    items: ["Twilio", "ElevenLabs", "Vapi", "Whisper", "Deepgram", "WebRTC", "WebSockets"],
  },
  {
    title: "Frontend",
    motto: "Pixels to products.",
    items: ["React", "Next.js", "Angular", "TypeScript", "Redux", "Tailwind CSS", "Three.js", "Bootstrap", "HTML5", "CSS"],
  },
  {
    title: "Backend",
    motto: "Build. Integrate. Scale.",
    items: ["Node.js", "Express", "FastAPI", "Django", "Flask", "Spring Boot", "Laravel", "REST APIs"],
  },
  {
    title: "Machine Learning",
    motto: "Data into decisions.",
    items: ["scikit-learn", "TensorFlow", "PyTorch", "OpenCV", "Pandas", "NumPy", "Matplotlib", "Power BI"],
  },
  {
    title: "Data & Vectors",
    motto: "Memory for machines.",
    items: ["PostgreSQL", "MongoDB", "MySQL", "Supabase", "SQLite", "Redis", "Pinecone", "Chroma", "FAISS", "Qdrant", "Weaviate"],
  },
  {
    title: "Automation & DevOps",
    motto: "Ship. Monitor. Repeat.",
    items: ["n8n", "Zapier", "Docker", "Git", "GitHub", "Vercel", "Railway", "AWS", "Hostinger", "pytest"],
  },
  {
    title: "Integrations",
    motto: "Plug into everything.",
    items: ["Stripe", "QuickBooks", "Google Calendar", "Google Maps", "SendGrid", "Mailgun", "AWS SES", "Cloudinary"],
  },
  {
    title: "Languages",
    motto: "Fluent in logic.",
    items: ["Python", "JavaScript", "TypeScript", "Java", "C++", "PHP", "SQL"],
  },
];

export const allSkills = Array.from(new Set(skillGroups.flatMap((g) => g.items)));
