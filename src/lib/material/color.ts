// Material You dynamic color. (DESIGN-SYSTEM §4.2)
// A lightweight tonal-palette generator: seed a hue, derive Material 3 role
// colors for light/dark. This is an HSL approximation of M3's HCT tonal system —
// good enough for a live "dynamic color" demo without pulling in a color library.

export const DEFAULT_SEED = "#6750A4";

export interface MaterialRoles {
  [cssVar: string]: string;
}

function hexToHsl(hex: string): { h: number; s: number; l: number } {
  let clean = hex.replace("#", "");
  if (clean.length === 3) clean = clean.split("").map((c) => c + c).join("");
  const r = parseInt(clean.slice(0, 2), 16) / 255;
  const g = parseInt(clean.slice(2, 4), 16) / 255;
  const b = parseInt(clean.slice(4, 6), 16) / 255;
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  const d = max - min;
  let h = 0;
  if (d !== 0) {
    if (max === r) h = ((g - b) / d) % 6;
    else if (max === g) h = (b - r) / d + 2;
    else h = (r - g) / d + 4;
    h *= 60;
    if (h < 0) h += 360;
  }
  const l = (max + min) / 2;
  const s = d === 0 ? 0 : d / (1 - Math.abs(2 * l - 1));
  return { h, s, l };
}

const hsl = (h: number, s: number, l: number) => `hsl(${h.toFixed(0)} ${s}% ${l}%)`;

/**
 * Generate the full set of Material role CSS variables for a seed color + mode.
 * Tertiary is derived by rotating the hue, the way M3 fans out related palettes.
 */
export function genRoles(seedHex: string, dark: boolean): MaterialRoles {
  const { h } = hexToHsl(seedHex);
  const ht = (h + 60) % 360; // tertiary hue rotation
  const P = 48; // primary chroma
  const N = 10; // neutral chroma (surfaces are nearly desaturated)
  const NV = 18; // neutral-variant chroma

  if (dark) {
    return {
      "--md-primary": hsl(h, P, 80),
      "--md-on-primary": hsl(h, P, 20),
      "--md-primary-container": hsl(h, P - 8, 30),
      "--md-on-primary-container": hsl(h, P, 90),
      "--md-secondary-container": hsl(h, NV, 30),
      "--md-on-secondary-container": hsl(h, NV, 90),
      "--md-tertiary": hsl(ht, P, 80),
      "--md-tertiary-container": hsl(ht, P - 8, 30),
      "--md-on-tertiary-container": hsl(ht, P, 90),
      "--md-background": hsl(h, N, 7),
      "--md-on-background": hsl(h, N, 90),
      "--md-surface": hsl(h, N, 8),
      "--md-surface-container": hsl(h, N, 12),
      "--md-surface-container-high": hsl(h, N, 17),
      "--md-surface-variant": hsl(h, NV, 28),
      "--md-on-surface": hsl(h, N, 92),
      "--md-on-surface-variant": hsl(h, N, 80),
      "--md-outline": hsl(h, N, 60),
      "--md-outline-variant": hsl(h, NV, 30),
    };
  }

  return {
    "--md-primary": hsl(h, P, 40),
    "--md-on-primary": hsl(h, 20, 99),
    "--md-primary-container": hsl(h, P, 90),
    "--md-on-primary-container": hsl(h, P + 12, 12),
    "--md-secondary-container": hsl(h, NV, 90),
    "--md-on-secondary-container": hsl(h, NV + 6, 16),
    "--md-tertiary": hsl(ht, P, 40),
    "--md-tertiary-container": hsl(ht, P, 90),
    "--md-on-tertiary-container": hsl(ht, P + 12, 12),
    "--md-background": hsl(h, N, 98),
    "--md-on-background": hsl(h, N, 12),
    "--md-surface": hsl(h, N, 98),
    "--md-surface-container": hsl(h, N, 94),
    "--md-surface-container-high": hsl(h, N, 92),
    "--md-surface-variant": hsl(h, NV, 90),
    "--md-on-surface": hsl(h, N, 12),
    "--md-on-surface-variant": hsl(h, N, 30),
    "--md-outline": hsl(h, N, 50),
    "--md-outline-variant": hsl(h, NV, 80),
  };
}

/** Read an optional ?seed= override for the live dynamic-color demo. */
export function readSeedFromLocation(): string {
  if (typeof window === "undefined") return DEFAULT_SEED;
  const param = new URLSearchParams(window.location.search).get("seed");
  if (param && /^#?[0-9a-fA-F]{6}$/.test(param)) {
    return param.startsWith("#") ? param : `#${param}`;
  }
  return DEFAULT_SEED;
}
