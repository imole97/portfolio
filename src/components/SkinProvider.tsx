"use client";

// SkinContext + provider. (DESIGN-SYSTEM §2, §8)
// SSR renders a neutral skin; the real skin resolves on mount (no hydration flash),
// honoring a localStorage override and prefers-reduced-motion.

import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import {
  readBrowserSignals,
  resolveSkin,
  type FormFactor,
  type OS,
  type Skin,
} from "@/lib/resolveSkin";

const OVERRIDE_KEY = "portfolio:skin-override";

export interface SkinContextValue {
  /** Concrete skin to render. "neutral" until mounted. */
  skin: Skin;
  os: OS;
  formFactor: FormFactor;
  /** True once the client has resolved the real skin (drives the fade-in). */
  ready: boolean;
  reducedMotion: boolean;
  /** Force a skin (persisted) or pass null to clear the override. */
  setSkinOverride: (skin: Skin | null) => void;
  override: Skin | null;
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
  const [os, setOS] = useState<OS>("other");
  const [formFactor, setFormFactor] = useState<FormFactor>("desktop");
  const [ready, setReady] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);
  const [override, setOverride] = useState<Skin | null>(null);

  // Resolve on mount.
  useEffect(() => {
    const stored = (() => {
      try {
        return localStorage.getItem(OVERRIDE_KEY) as Skin | null;
      } catch {
        return null;
      }
    })();

    const { hints, viewport } = readBrowserSignals();
    const resolved = resolveSkin(hints, viewport);

    // Hydration-safe: SSR paints the neutral skin, the real skin resolves here on
    // mount. The synchronous setState is intentional and batched in one commit.
    /* eslint-disable react-hooks/set-state-in-effect */
    setOS(resolved.os);
    setFormFactor(resolved.formFactor);
    setOverride(stored);
    setSkin(stored ?? resolved.skin);
    setReady(true);
    /* eslint-enable react-hooks/set-state-in-effect */
  }, []);

  // Track reduced-motion preference live.
  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const apply = () => setReducedMotion(mq.matches);
    apply();
    mq.addEventListener("change", apply);
    return () => mq.removeEventListener("change", apply);
  }, []);

  // Re-resolve on resize (form factor can change) unless an override is set.
  useEffect(() => {
    if (override) return;
    const onResize = () => {
      const { hints, viewport } = readBrowserSignals();
      const resolved = resolveSkin(hints, viewport);
      setFormFactor(resolved.formFactor);
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
    try {
      if (next) localStorage.setItem(OVERRIDE_KEY, next);
      else localStorage.removeItem(OVERRIDE_KEY);
    } catch {
      /* storage may be unavailable; in-memory state still updates */
    }
    setOverride(next);
    if (next) {
      setSkin(next);
    } else {
      const { hints, viewport } = readBrowserSignals();
      setSkin(resolveSkin(hints, viewport).skin);
    }
  };

  const value = useMemo<SkinContextValue>(
    () => ({ skin, os, formFactor, ready, reducedMotion, setSkinOverride, override }),
    [skin, os, formFactor, ready, reducedMotion, override],
  );

  return <SkinContext.Provider value={value}>{children}</SkinContext.Provider>;
}
