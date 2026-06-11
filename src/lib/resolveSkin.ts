// Pure, unit-testable skin resolver. (DESIGN-SYSTEM §2)
// resolveSkin(ua, viewport) -> { os, formFactor, skin }

export type OS = "apple" | "android" | "windows" | "other";
export type FormFactor = "mobile" | "tablet" | "desktop";
export type Skin = "macos" | "ios" | "ipados" | "material" | "fluent" | "neutral";

export interface Viewport {
  width: number;
  /** Whether the primary pointer is coarse (touch) — from `(pointer: coarse)`. */
  coarsePointer?: boolean;
}

export interface UAHints {
  /** Raw UA string (fallback parsing). */
  ua: string;
  /** navigator.userAgentData?.platform, when available. */
  platform?: string;
  /** navigator.userAgentData?.mobile, when available. */
  mobile?: boolean;
  /** navigator.maxTouchPoints — distinguishes an iPad (reports as Macintosh) from a Mac. */
  maxTouchPoints?: number;
}

export interface Resolution {
  os: OS;
  formFactor: FormFactor;
  skin: Skin;
}

const BREAKPOINTS = { mobileMax: 767, tabletMax: 1199 } as const;

export function detectOS({ ua, platform }: UAHints): OS {
  const p = (platform ?? "").toLowerCase();
  const u = ua.toLowerCase();

  // Prefer the high-entropy platform hint when present.
  if (p) {
    if (p.includes("mac") || p.includes("ios") || p.includes("iphone") || p.includes("ipad"))
      return "apple";
    if (p.includes("android")) return "android";
    if (p.includes("win")) return "windows";
  }

  // UA-string fallback. Order matters: iPadOS reports as "Macintosh" + touch,
  // and Android UAs also contain "Linux", so test specific tokens first.
  if (/iphone|ipad|ipod/.test(u)) return "apple";
  if (/android/.test(u)) return "android";
  if (/windows|win64|win32/.test(u)) return "windows";
  if (/macintosh|mac os x/.test(u)) return "apple";
  return "other";
}

/**
 * Form factor follows the **device model**, not the window size: a Mac in a narrow
 * window stays a desktop, an iPhone is always mobile. Viewport width is only a
 * last-resort tiebreaker for devices we can't identify from UA/touch signals.
 */
export function detectFormFactor(viewport: Viewport, hints: UAHints): FormFactor {
  const { width, coarsePointer } = viewport;
  const u = hints.ua.toLowerCase();
  const os = detectOS(hints);
  const touch = (hints.maxTouchPoints ?? 0) > 1 || coarsePointer === true;

  // --- Apple: decide by exact device, ignoring window width. ---
  if (os === "apple") {
    if (/iphone|ipod/.test(u)) return "mobile";
    // Real iPads (UA "iPad") and modern iPadOS (reports as "Macintosh" + touch).
    if (/ipad/.test(u) || touch) return "tablet";
    return "desktop"; // Mac
  }

  // --- Known mobile signals win over width. ---
  if (hints.mobile === true) return "mobile";
  if (os === "android") {
    // Android UA carries the "Mobile" token on phones but not on tablets.
    return /\bmobile\b/.test(u) ? "mobile" : "tablet";
  }

  // --- Desktop OS with a real pointer stays desktop at any width. ---
  if (os === "windows" && !touch) return "desktop";

  // --- Fallback: viewport width with a coarse-pointer nuance. ---
  if (width <= BREAKPOINTS.mobileMax) return "mobile";
  if (width <= BREAKPOINTS.tabletMax) return "tablet";
  if (touch && width <= 1366) return "tablet"; // wide touch device, likely a tablet
  return "desktop";
}

/**
 * Maps (os, formFactor) to a concrete skin. Routing is **OS-primary**: a device's
 * real OS picks the skin family, and form factor only splits Apple and resolves
 * unknown OSes by screen type.
 *
 *   apple   + mobile  -> ios       windows + *       -> fluent
 *   apple   + tablet  -> ipados    android + *       -> material
 *   apple   + desktop -> macos     other   + desktop -> fluent
 *                                  other   + mobile/tablet -> material
 */
export function resolveSkinFromParts(os: OS, formFactor: FormFactor): Skin {
  // Apple resolves by device: iPhone -> iOS, iPad -> iPadOS, Mac -> macOS.
  if (os === "apple") {
    if (formFactor === "mobile") return "ios";
    if (formFactor === "tablet") return "ipados";
    return "macos";
  }
  // Android (any form factor) gets Material; it adapts up to expanded layouts.
  if (os === "android") return "material";
  // Windows (any form factor) gets Fluent; it scales down to a compact icon rail.
  if (os === "windows") return "fluent";

  // Unknown / Linux: route by screen type — desktop -> Windows, else Android.
  return formFactor === "desktop" ? "fluent" : "material";
}

export function resolveSkin(hints: UAHints, viewport: Viewport): Resolution {
  const os = detectOS(hints);
  const formFactor = detectFormFactor(viewport, hints);
  const skin = resolveSkinFromParts(os, formFactor);
  return { os, formFactor, skin };
}

/** Reads live browser signals into the shape resolveSkin expects. Client-only. */
export function readBrowserSignals(): { hints: UAHints; viewport: Viewport } {
  const navAny = navigator as Navigator & {
    userAgentData?: { platform?: string; mobile?: boolean };
  };
  return {
    hints: {
      ua: navigator.userAgent,
      platform: navAny.userAgentData?.platform,
      mobile: navAny.userAgentData?.mobile,
      maxTouchPoints: navigator.maxTouchPoints,
    },
    viewport: {
      width: globalThis.innerWidth,
      coarsePointer: globalThis.matchMedia("(pointer: coarse)").matches,
    },
  };
}

export const SKIN_BREAKPOINTS = BREAKPOINTS;
