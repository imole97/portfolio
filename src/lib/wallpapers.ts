// Wallpaper registry, scoped per skin. (DESIGN-SYSTEM §4.1 — native feel)
// Each skin that supports wallpapers has its own set + default. iPhone and iPad
// ship images; the other skins are a later pass.

export interface Wallpaper {
  id: string;
  name: string;
  src: string;
  /** Average luminance — informs scrim/contrast handling. */
  tone: "dark" | "light";
}

/** Skins that have a selectable wallpaper. */
export type WallpaperScope = "ios" | "ipados" | "macos";

const SCOPES: WallpaperScope[] = ["ios", "ipados", "macos"];

export const WALLPAPERS: Record<WallpaperScope, Wallpaper[]> = {
  ios: [
    { id: "aurora", name: "Aurora", src: "/wallpapers/ios/aurora.png", tone: "dark" },
    { id: "neon", name: "Neon", src: "/wallpapers/ios/neon.webp", tone: "dark" },
  ],
  ipados: [
    { id: "m2", name: "Sequoia", src: "/wallpapers/ipados/m2.webp", tone: "dark" },
    { id: "air", name: "Air", src: "/wallpapers/ipados/air.png", tone: "light" },
  ],
  macos: [
    { id: "sonoma", name: "Sonoma", src: "/wallpapers/macos/sonoma.jpeg", tone: "dark" },
    { id: "ventura", name: "Ventura", src: "/wallpapers/macos/ventura.jpg", tone: "light" },
    { id: "bigsur", name: "Big Sur", src: "/wallpapers/macos/bigsur.jpg", tone: "light" },
  ],
};

export const DEFAULT_WALLPAPER: Record<WallpaperScope, string> = {
  ios: "aurora",
  ipados: "m2",
  macos: "sonoma",
};

/** Narrow a skin to a wallpaper scope, or null if the skin has no wallpapers. */
export function wallpaperScope(skin: string): WallpaperScope | null {
  return (SCOPES as string[]).includes(skin) ? (skin as WallpaperScope) : null;
}

export function wallpapersFor(scope: WallpaperScope): Wallpaper[] {
  return WALLPAPERS[scope];
}

export function getWallpaper(scope: WallpaperScope, id: string): Wallpaper {
  const list = WALLPAPERS[scope];
  return list.find((w) => w.id === id) ?? list[0];
}
