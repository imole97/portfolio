import type { MetadataRoute } from "next";
import { siteUrl } from "@/lib/site";

// /sitemap.xml — the portfolio is a single page (skins swap client-side, so there are
// no separate crawlable routes), so one canonical entry.
export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: siteUrl,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 1,
    },
  ];
}
