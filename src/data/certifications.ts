export type Certification = {
  id: string;
  title: string;
  issuer: string;
  year?: string;
  focus: string[];
  /** Optional scan of the real certificate, e.g. "/certificates/python.jpg" */
  image?: string;
  /** Optional public verification link */
  credentialUrl?: string;
  tone: string;
};

export const certifications: Certification[] = [
  {
    id: "pge-web-ai-ml",
    title: "Web Development with AI/ML",
    issuer: "Pangea Global Enterprise (PGE)",
    year: "2025",
    focus: ["Full-stack development", "AI/ML integration", "Production deployment"],
    tone: "#8b5cf6",
  },
  {
    id: "nexus-full-stack",
    title: "Full Stack Development",
    issuer: "Nexus AI Lahore",
    focus: ["Frontend", "Backend", "Databases"],
    tone: "#22d3ee",
  },
  {
    id: "itu-web-development",
    title: "Web Development",
    issuer: "ITU University · Arfa Tower",
    focus: ["HTML & CSS", "JavaScript", "Responsive web"],
    tone: "#38bdf8",
  },
  {
    id: "pny-web-designer-developer",
    title: "Web Designer & Developer",
    issuer: "PNY Training",
    year: "2024",
    focus: ["Web design", "Web development"],
    tone: "#f472b6",
  },
  {
    id: "great-learning-ui-ux",
    title: "UI/UX Design",
    issuer: "Great Learning Academy",
    year: "2024",
    focus: ["User research", "Wireframing", "Visual design"],
    tone: "#f59e0b",
  },
  {
    id: "sololearn-python",
    title: "Python Programming",
    issuer: "SoloLearn",
    year: "2023",
    focus: ["Python", "Problem solving"],
    tone: "#4b8bbe",
  },
  {
    id: "sololearn-ai-ml",
    title: "AI/ML Fundamentals",
    issuer: "SoloLearn",
    year: "2023",
    focus: ["Machine learning", "AI foundations"],
    tone: "#c084fc",
  },
  {
    id: "great-learning-cpp",
    title: "C++ Programming",
    issuer: "Great Learning Academy",
    year: "2023",
    focus: ["C++", "OOP"],
    tone: "#659ad2",
  },
  {
    id: "coursera-advanced-js",
    title: "Advanced JavaScript",
    issuer: "Coursera",
    year: "2022",
    focus: ["JavaScript", "Async patterns"],
    tone: "#f7df1e",
  },
  {
    id: "mongodb-database-management",
    title: "Database Management",
    issuer: "MongoDB University",
    year: "2022",
    focus: ["MongoDB", "Data modelling"],
    tone: "#47a248",
  },
];
