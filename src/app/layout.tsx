import type { Metadata, Viewport } from "next";
import { JetBrains_Mono, Manrope, Mrs_Saint_Delafield, Sora } from "next/font/google";
import "./globals.css";
import { profile } from "@/data/profile";
import { allSkills } from "@/data/skills";
import { certifications } from "@/data/certifications";
import { absoluteUrl, site } from "@/lib/site";
import { SmoothScroll } from "@/components/providers/SmoothScroll";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { CommandPalette } from "@/components/layout/CommandPalette";
import { Cursor } from "@/components/ui/Cursor";
import { ScrollProgress } from "@/components/ui/ScrollProgress";
import { JsonLd } from "@/components/seo/JsonLd";
import { SoundEffects } from "@/components/ui/SoundEffects";
import { WelcomeVoice } from "@/components/ui/WelcomeVoice";
import { Assistant } from "@/components/assistant/Assistant";

const display = Sora({ subsets: ["latin"], variable: "--font-sora", display: "swap" });
const sans = Manrope({ subsets: ["latin"], variable: "--font-manrope", display: "swap" });
const mono = JetBrains_Mono({ subsets: ["latin"], variable: "--font-jetbrains", display: "swap" });
const script = Mrs_Saint_Delafield({ subsets: ["latin"], weight: "400", variable: "--font-script-face", display: "swap" });

/** The AI assistant only appears when an OpenAI key is configured on the server. */
const assistantEnabled = Boolean(process.env.OPENAI_API_KEY);

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: { default: site.title, template: `%s · ${site.name}` },
  description: site.description,
  applicationName: `${site.name} — Portfolio`,
  authors: [{ name: profile.name, url: site.url }],
  creator: profile.name,
  publisher: profile.name,
  keywords: [...site.keywords],
  category: "technology",
  alternates: {
    canonical: "/",
    types: {
      "text/markdown": [
        { url: "/llms.txt", title: "llms.txt — site guide for AI assistants" },
        { url: "/llms-full.txt", title: "Full profile in Markdown" },
      ],
    },
  },
  formatDetection: { telephone: false, email: false, address: false },
  openGraph: {
    type: "profile",
    locale: site.locale,
    url: "/",
    siteName: `${site.name} — Portfolio`,
    title: site.title,
    description: site.description,
    firstName: profile.firstName,
    lastName: profile.lastName,
    username: profile.githubUser,
  },
  twitter: {
    card: "summary_large_image",
    title: site.title,
    description: site.description,
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, "max-image-preview": "large", "max-snippet": -1, "max-video-preview": -1 },
  },
  ...(process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION
    ? { verification: { google: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION } }
    : {}),
};

export const viewport: Viewport = {
  themeColor: "#ffffff",
  colorScheme: "light",
  width: "device-width",
  initialScale: 1,
};

const personLd = {
  "@context": "https://schema.org",
  "@type": "Person",
  "@id": `${site.url}/#person`,
  name: profile.name,
  alternateName: profile.fullName,
  givenName: profile.firstName,
  familyName: profile.lastName,
  jobTitle: profile.title,
  description: site.summary,
  url: site.url,
  image: absoluteUrl(profile.headshot),
  email: `mailto:${profile.email}`,
  telephone: profile.phone.replace(/\s/g, ""),
  address: { "@type": "PostalAddress", addressLocality: "Lahore", addressRegion: "Punjab", addressCountry: "PK" },
  worksFor: { "@type": "Organization", name: profile.company },
  hasOccupation: {
    "@type": "Occupation",
    name: profile.title,
    occupationLocation: { "@type": "City", name: "Lahore" },
    skills: allSkills.join(", "),
  },
  alumniOf: { "@type": "CollegeOrUniversity", name: profile.education.school },
  knowsAbout: allSkills,
  hasCredential: certifications.map((c) => ({
    "@type": "EducationalOccupationalCredential",
    name: c.title,
    credentialCategory: "certificate",
    recognizedBy: { "@type": "Organization", name: c.issuer },
    ...(c.year ? { dateCreated: c.year } : {}),
  })),
  sameAs: [profile.github, profile.linkedin],
};

const websiteLd = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  "@id": `${site.url}/#website`,
  url: site.url,
  name: `${site.name} — Portfolio`,
  description: site.summary,
  inLanguage: "en",
  author: { "@id": `${site.url}/#person` },
};

/** Runs before paint: skip the intro overlay on repeat visits in the same tab session. */
const introScript = `try{if(sessionStorage.getItem('hk-intro')==='1')document.documentElement.classList.add('intro-seen')}catch(e){}`;

export default function RootLayout({ children, modal }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      dir="ltr"
      suppressHydrationWarning
      className={`${display.variable} ${sans.variable} ${mono.variable} ${script.variable} antialiased`}
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: introScript }} />
      </head>
      <body className="min-h-svh bg-paper text-ink">
        <a
          href="#main"
          className="fixed left-4 top-4 z-[200] -translate-y-24 rounded-full bg-ink px-4 py-2 text-sm font-semibold text-paper transition-transform focus:translate-y-0"
        >
          Skip to content
        </a>
        <SmoothScroll>
          <ScrollProgress />
          <Navbar />
          <div id="main">{children}</div>
          <Footer />
          {modal}
          <CommandPalette assistant={assistantEnabled} />
          <Cursor />
          <SoundEffects />
          <WelcomeVoice />
          {assistantEnabled && <Assistant />}
        </SmoothScroll>
        <div className="grain" aria-hidden />
        <JsonLd data={[personLd, websiteLd]} />
      </body>
    </html>
  );
}
