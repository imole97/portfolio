import type { MetadataRoute } from "next";
import { content } from "@/lib/content";

// Web app manifest — installability + a richer identity in browsers and share sheets.
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: `${content.hero.name} — ${content.hero.role}`,
    short_name: content.hero.name.split(" ")[0],
    description: content.hero.thesis,
    start_url: "/",
    display: "standalone",
    background_color: "#0b0b0d",
    theme_color: "#0b0b0d",
    icons: [
      { src: "/icon.png", sizes: "512x512", type: "image/png", purpose: "any" },
      { src: "/apple-icon.png", sizes: "180x180", type: "image/png" },
    ],
  };
}
