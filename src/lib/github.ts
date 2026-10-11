import { cacheLife } from "next/cache";
import { profile } from "@/data/profile";

export type GitHubRepo = {
  name: string;
  description: string | null;
  url: string;
  homepage: string | null;
  language: string | null;
  stars: number;
  updated: string;
};

export type GitHubSnapshot = {
  name: string;
  bio: string | null;
  location: string | null;
  company: string | null;
  followers: number;
  publicRepos: number;
  totalStars: number;
  languages: { name: string; count: number }[];
  repos: GitHubRepo[];
};

type ApiUser = {
  name: string | null;
  bio: string | null;
  location: string | null;
  company: string | null;
  followers: number;
  public_repos: number;
};

type ApiRepo = {
  name: string;
  description: string | null;
  html_url: string;
  homepage: string | null;
  language: string | null;
  stargazers_count: number;
  pushed_at: string;
  fork: boolean;
};

async function gh<T>(path: string): Promise<T> {
  const res = await fetch(`https://api.github.com${path}`, {
    headers: {
      Accept: "application/vnd.github+json",
      "User-Agent": "hamza-kahloon-portfolio",
      ...(process.env.GITHUB_TOKEN ? { Authorization: `Bearer ${process.env.GITHUB_TOKEN}` } : {}),
    },
  });
  if (!res.ok) throw new Error(`GitHub ${path} → ${res.status}`);
  return res.json() as Promise<T>;
}

const fmt = new Intl.DateTimeFormat("en-US", { month: "short", year: "numeric", timeZone: "UTC" });

async function loadSnapshot(user: string): Promise<GitHubSnapshot> {
  "use cache";
  cacheLife("days");

  const [u, repos] = await Promise.all([
    gh<ApiUser>(`/users/${user}`),
    gh<ApiRepo[]>(`/users/${user}/repos?per_page=100&sort=pushed`),
  ]);

  const own = repos.filter((r) => !r.fork && r.name.toLowerCase() !== user.toLowerCase());
  const langCounts = new Map<string, number>();
  for (const r of own) if (r.language) langCounts.set(r.language, (langCounts.get(r.language) ?? 0) + 1);

  return {
    name: u.name ?? user,
    bio: u.bio,
    location: u.location?.trim() || null,
    company: u.company?.trim() || null,
    followers: u.followers,
    publicRepos: u.public_repos,
    totalStars: own.reduce((s, r) => s + r.stargazers_count, 0),
    languages: [...langCounts.entries()].map(([name, count]) => ({ name, count })).sort((a, b) => b.count - a.count).slice(0, 6),
    repos: own
      .filter((r) => r.description)
      .slice(0, 8)
      .map((r) => ({
        name: r.name,
        description: r.description?.replace(/\*\*|__|`/g, "").trim() ?? null,
        url: r.html_url,
        homepage: r.homepage || null,
        language: r.language,
        stars: r.stargazers_count,
        updated: fmt.format(new Date(r.pushed_at)),
      })),
  };
}

/** Live GitHub profile data, cached for a day. Returns null if GitHub is unreachable or rate-limited. */
export async function getGitHubSnapshot(): Promise<GitHubSnapshot | null> {
  try {
    return await loadSnapshot(profile.githubUser);
  } catch {
    return null;
  }
}
