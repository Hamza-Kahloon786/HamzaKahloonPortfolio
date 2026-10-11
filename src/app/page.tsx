import { existsSync } from "node:fs";
import { join } from "node:path";
import { profile } from "@/data/profile";
import { projects } from "@/data/projects";
import { getGitHubSnapshot } from "@/lib/github";
import { faqs } from "@/lib/knowledge";
import { absoluteUrl, site } from "@/lib/site";
import { Preloader } from "@/components/layout/Preloader";
import { Hero } from "@/components/sections/Hero";
import { Ticker } from "@/components/sections/Ticker";
import { About } from "@/components/sections/About";
import { Skills } from "@/components/sections/Skills";
import { Experience } from "@/components/sections/Experience";
import { Projects } from "@/components/sections/Projects";
import { Certifications } from "@/components/sections/Certifications";
import { Faq } from "@/components/sections/Faq";
import { Contact } from "@/components/sections/Contact";
import { JsonLd } from "@/components/seo/JsonLd";

/** Drop your CV at /public/resume.pdf and the "Download résumé" button appears automatically. */
const hasResume = existsSync(join(process.cwd(), "public", profile.resume.replace(/^\//, "")));
const assistantEnabled = Boolean(process.env.OPENAI_API_KEY);

export default async function Home() {
  const github = await getGitHubSnapshot();

  const jsonLd = [
    {
      "@context": "https://schema.org",
      "@type": "ProfilePage",
      "@id": `${site.url}/#profile`,
      url: site.url,
      name: site.title,
      description: site.summary,
      inLanguage: "en",
      dateModified: site.updated,
      isPartOf: { "@id": `${site.url}/#website` },
      mainEntity: { "@id": `${site.url}/#person` },
      primaryImageOfPage: absoluteUrl("/opengraph-image"),
      hasPart: { "@id": `${site.url}/#projects` },
    },
    {
      "@context": "https://schema.org",
      "@type": "ItemList",
      "@id": `${site.url}/#projects`,
      name: `Projects by ${profile.name}`,
      numberOfItems: projects.length,
      itemListElement: projects.map((p, i) => ({
        "@type": "ListItem",
        position: i + 1,
        url: absoluteUrl(`/projects/${p.slug}`),
        name: `${p.title} — ${p.tagline}`,
      })),
    },
    {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      "@id": `${site.url}/#faq`,
      mainEntity: faqs.map((f) => ({
        "@type": "Question",
        name: f.q,
        acceptedAnswer: { "@type": "Answer", text: f.a },
      })),
    },
  ];

  return (
    <>
      <Preloader />
      <Hero hasResume={hasResume} assistant={assistantEnabled} />
      <Ticker />
      <About />
      <Skills />
      <Experience />
      <Projects />
      <Certifications />
      <Faq />
      <Contact github={github} />
      <JsonLd data={jsonLd} />
    </>
  );
}
