// Wallpaper registry, scoped per skin. (DESIGN-SYSTEM §4.1 — native feel)
// Each skin that supports wallpapers has its own set + default. iPhone and iPad
// ship images; the other skins are a later pass.

export interface Wallpaper {
  id: string;
  name: string;
  src: string;
  /** Average luminance — informs scrim/contrast handling. */
  tone: "dark" | "light";
  /** Material You only: seed hue that drives dynamic color when this wallpaper is set. */
  seed?: string;
}

/** Skins that have a selectable wallpaper (keyed by the skin value). */
export type WallpaperScope = "ios" | "ipados" | "macos" | "material" | "fluent";

const SCOPES: WallpaperScope[] = ["ios", "ipados", "macos", "material", "fluent"];

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
  // Android (Material You): each wallpaper seeds the dynamic-color palette. (§4.2)
  material: [
    { id: "petals", name: "Petals", src: "/wallpapers/androidos/petals.webp", tone: "light", seed: "#5c8a51" },
    { id: "bloom", name: "Bloom", src: "/wallpapers/androidos/bloom.webp", tone: "light", seed: "#c06a3c" },
    { id: "spectrum", name: "Spectrum", src: "/wallpapers/androidos/spectrum.webp", tone: "dark", seed: "#1f8f6f" },
    { id: "mist", name: "Mist", src: "/wallpapers/androidos/mist.webp", tone: "light", seed: "#8f8147" },
    { id: "oneui", name: "One UI", src: "/wallpapers/androidos/oneui.webp", tone: "light", seed: "#6f79a6" },
  ],
  // Windows — a tour through Windows history + scenery. (§4.3)
  fluent: [
    { id: "bloom", name: "Bloom", src: "/wallpapers/win-os/bloom.jpg", tone: "dark" },
    { id: "win7", name: "Windows 7", src: "/wallpapers/win-os/win7.jpg", tone: "light" },
    { id: "bliss", name: "Bliss", src: "/wallpapers/win-os/bliss.jpg", tone: "light" },
    { id: "coast", name: "Coast", src: "/wallpapers/win-os/coast.jpg", tone: "light" },
    { id: "shore", name: "Shore", src: "/wallpapers/win-os/shore.jpg", tone: "light" },
  ],
};

export const DEFAULT_WALLPAPER: Record<WallpaperScope, string> = {
  ios: "aurora",
  ipados: "m2",
  macos: "sonoma",
  material: "petals",
  fluent: "bloom",
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
