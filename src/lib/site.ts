// Canonical site URL + shared SEO constants. One source of truth for anything that
// needs an absolute URL (metadataBase, canonical, OG/Twitter images, sitemap, robots,
// JSON-LD). Set NEXT_PUBLIC_SITE_URL to your production domain; on Vercel the project
// production URL is used automatically, and dev falls back to localhost.

import { content } from "@/lib/content";

// The production domain. NEXT_PUBLIC_SITE_URL overrides it (e.g. for preview deploys);
// otherwise this is the canonical URL used everywhere metadata needs an absolute link.
const PRODUCTION_URL = "https://www.imole.dev";

function resolveSiteUrl(): string {
  const explicit = process.env.NEXT_PUBLIC_SITE_URL;
  if (explicit) return explicit.replace(/\/$/, "");
  return PRODUCTION_URL;
}

export const siteUrl = resolveSiteUrl();

export const OG_IMAGE = {
  url: "/og-image.png",
  width: 1200,
  height: 630,
  alt: `${content.hero.name} — ${content.hero.role}`,
} as const;

/** A focused keyword set drawn from the real skill spine, not stuffing. */
export const seoKeywords = [
  content.hero.name,
  "Frontend Engineer",
  "Lead Frontend Engineer",
  "React Developer",
  "Next.js Developer",
  "TypeScript Engineer",
  "Web Performance",
  "Design Systems",
  "Lagos, Nigeria",
  ...content.about.skillGroups.flatMap((g) => g.items).slice(0, 16),
];
