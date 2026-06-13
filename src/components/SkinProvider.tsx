"use client";

// SkinContext + provider. (DESIGN-SYSTEM §2, §8)
// SSR renders a neutral skin; the real skin resolves on mount (no hydration flash),
// honoring a localStorage override and prefers-reduced-motion.

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import {
  peerSkin,
  readBrowserSignals,
  resolveSkin,
  type FormFactor,
  type OS,
  type Skin,
} from "@/lib/resolveSkin";
import { DEFAULT_WALLPAPER, wallpaperScope } from "@/lib/wallpapers";

const OVERRIDE_KEY = "portfolio:skin-override";
const THEME_KEY = "portfolio:theme";
const WALLPAPER_KEY = "portfolio:wallpapers";

export type ThemeMode = "system" | "light" | "dark";

export interface SkinContextValue {
  /** Concrete skin to render. "neutral" until mounted. */
  skin: Skin;
  /** The device's own (auto-detected) skin — the enforced default. */
  nativeSkin: Skin;
  os: OS;
  formFactor: FormFactor;
  /** True once the client has resolved the real skin (drives the fade-in). */
  ready: boolean;
  reducedMotion: boolean;
  /** Force a skin (persisted) or pass null to clear the override. */
  setSkinOverride: (skin: Skin | null) => void;
  override: Skin | null;
  /** Appearance preference: follow system, or force light/dark (persisted). */
  theme: ThemeMode;
  /** The effective light/dark after resolving "system". */
  resolvedTheme: "light" | "dark";
  setTheme: (theme: ThemeMode) => void;
  /** Selected wallpaper id for the active skin ("" if the skin has none). Persisted per skin. */
  wallpaper: string;
  setWallpaper: (id: string) => void;
}

const SkinContext = createContext<SkinContextValue | null>(null);

export function useSkin(): SkinContextValue {
  const ctx = useContext(SkinContext);
  if (!ctx) throw new Error("useSkin must be used within <SkinProvider>");
  return ctx;
}

function dataSkinFor(skin: Skin): string {
  // The CSS variable blocks are keyed by OS family, not by exact skin.
  switch (skin) {
    case "macos":
    case "ios":
    case "ipados":
      return "apple";
    case "material":
      return "android";
    case "fluent":
      return "windows";
    default:
      return "neutral";
  }
}

export function SkinProvider({ children }: { children: ReactNode }) {
  const [skin, setSkin] = useState<Skin>("neutral");
  const [nativeSkin, setNativeSkin] = useState<Skin>("neutral");
  const [os, setOS] = useState<OS>("other");
  const [formFactor, setFormFactor] = useState<FormFactor>("desktop");
  const [ready, setReady] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);
  const [override, setOverride] = useState<Skin | null>(null);
  const [theme, setThemeState] = useState<ThemeMode>("system");
  const [systemDark, setSystemDark] = useState(false);
  // Wallpaper selection per skin scope, e.g. { ios: "neon", ipados: "air" }.
  const [wallpapers, setWallpapers] = useState<Record<string, string>>({});

  // Resolve on mount.
  useEffect(() => {
    const read = (key: string) => {
      try {
        return localStorage.getItem(key);
      } catch {
        return null;
      }
    };
    const stored = read(OVERRIDE_KEY) as Skin | null;
    const storedTheme = read(THEME_KEY) as ThemeMode | null;
    const storedWallpapers = (() => {
      try {
        return JSON.parse(read(WALLPAPER_KEY) ?? "{}") as Record<string, string>;
      } catch {
        return {};
      }
    })();

    const { hints, viewport } = readBrowserSignals();
    const resolved = resolveSkin(hints, viewport);

    // Enforce the concept: a device may only run its own skin or its same-form-factor
    // peer. Any other stored override (e.g. stale, or copied from another device) is
    // ignored and cleared, falling back to the device's own skin.
    const peer = peerSkin(resolved.skin, resolved.formFactor);
    const allowedOverride = stored && (stored === resolved.skin || stored === peer) ? stored : null;
    if (stored && !allowedOverride) {
      try {
        localStorage.removeItem(OVERRIDE_KEY);
      } catch {
        /* storage may be unavailable */
      }
    }

    // Hydration-safe: SSR paints the neutral skin, the real skin resolves here on
    // mount. The synchronous setState is intentional and batched in one commit.
    /* eslint-disable react-hooks/set-state-in-effect */
    setOS(resolved.os);
    setFormFactor(resolved.formFactor);
    setNativeSkin(resolved.skin);
    setOverride(allowedOverride);
    setSkin(allowedOverride ?? resolved.skin);
    if (storedTheme) setThemeState(storedTheme);
    setWallpapers(storedWallpapers);
    setReady(true);
    /* eslint-enable react-hooks/set-state-in-effect */
  }, []);

  // Track reduced-motion + system color-scheme preferences live.
  useEffect(() => {
    const motion = window.matchMedia("(prefers-reduced-motion: reduce)");
    const dark = window.matchMedia("(prefers-color-scheme: dark)");
    const applyMotion = () => setReducedMotion(motion.matches);
    const applyDark = () => setSystemDark(dark.matches);
    applyMotion();
    applyDark();
    motion.addEventListener("change", applyMotion);
    dark.addEventListener("change", applyDark);
    return () => {
      motion.removeEventListener("change", applyMotion);
      dark.removeEventListener("change", applyDark);
    };
  }, []);

  const resolvedTheme: "light" | "dark" =
    theme === "system" ? (systemDark ? "dark" : "light") : theme;

  // Reflect the appearance override onto <html data-theme>; absent = follow system.
  useEffect(() => {
    if (theme === "system") delete document.documentElement.dataset.theme;
    else document.documentElement.dataset.theme = theme;
  }, [theme]);

  // Re-resolve on resize (form factor can change) unless an override is set.
  useEffect(() => {
    if (override) return;
    const onResize = () => {
      const { hints, viewport } = readBrowserSignals();
      const resolved = resolveSkin(hints, viewport);
      setFormFactor(resolved.formFactor);
      setNativeSkin(resolved.skin);
      setSkin(resolved.skin);
    };
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, [override]);

  // Reflect the active skin onto <html data-skin> for CSS variable scoping.
  useEffect(() => {
    document.documentElement.dataset.skin = dataSkinFor(skin);
  }, [skin]);

  const setSkinOverride = (next: Skin | null) => {
    // Enforce the concept: only the device's own skin or its same-form-factor peer is
    // selectable. Anything else is rejected.
    const peer = peerSkin(nativeSkin, formFactor);
    if (next && next !== nativeSkin && next !== peer) return;
    // Choosing the device's own skin is just the default — store no override.
    const value = next === nativeSkin ? null : next;
    try {
      if (value) localStorage.setItem(OVERRIDE_KEY, value);
      else localStorage.removeItem(OVERRIDE_KEY);
    } catch {
      /* storage may be unavailable; in-memory state still updates */
    }
    setOverride(value);
    setSkin(value ?? nativeSkin);
  };

  const setTheme = (next: ThemeMode) => {
    try {
      localStorage.setItem(THEME_KEY, next);
    } catch {
      /* storage may be unavailable; in-memory state still updates */
    }
    setThemeState(next);
  };

  // Resolve the active skin's wallpaper (its saved choice, or the scope's default).
  const scope = wallpaperScope(skin);
  const wallpaper = scope ? (wallpapers[scope] ?? DEFAULT_WALLPAPER[scope]) : "";

  const setWallpaper = useCallback(
    (id: string) => {
      if (!scope) return;
      setWallpapers((prev) => {
        const next = { ...prev, [scope]: id };
        try {
          localStorage.setItem(WALLPAPER_KEY, JSON.stringify(next));
        } catch {
          /* storage may be unavailable; in-memory state still updates */
        }
        return next;
      });
    },
    [scope],
  );

  const value = useMemo<SkinContextValue>(
    () => ({
      skin,
      nativeSkin,
      os,
      formFactor,
      ready,
      reducedMotion,
      setSkinOverride,
      override,
      theme,
      resolvedTheme,
      setTheme,
      wallpaper,
      setWallpaper,
    }),
    [
      skin,
      nativeSkin,
      os,
      formFactor,
      ready,
      reducedMotion,
      override,
      theme,
      resolvedTheme,
      wallpaper,
      setWallpaper,
    ],
  );

  return <SkinContext.Provider value={value}>{children}</SkinContext.Provider>;
}
