"use client";

// Picks and lazily loads the resolved skin's shell. (DESIGN-SYSTEM §6, §9)
// Skins are code-split via dynamic import() so a visitor only downloads the
// components for the skin they actually see.

import dynamic from "next/dynamic";
import { useSkin } from "@/components/SkinProvider";
import { NeutralFallback } from "@/components/NeutralFallback";
import { SkinSwitcher } from "@/components/SkinSwitcher";

// Each skin is behind its own dynamic import so bundles stay separate. (§9)
const AppleShell = dynamic(
  () => import("@/components/skins/apple/AppleShell").then((m) => m.AppleShell),
  { ssr: false, loading: () => <NeutralFallback /> },
);
const IOSShell = dynamic(
  () => import("@/components/skins/apple/IOSShell").then((m) => m.IOSShell),
  { ssr: false, loading: () => <NeutralFallback /> },
);
const IPadOSShell = dynamic(
  () => import("@/components/skins/apple/IPadOSShell").then((m) => m.IPadOSShell),
  { ssr: false, loading: () => <NeutralFallback /> },
);
const MaterialShell = dynamic(
  () => import("@/components/skins/material/MaterialShell").then((m) => m.MaterialShell),
  { ssr: false, loading: () => <NeutralFallback /> },
);
const FluentShell = dynamic(
  () => import("@/components/skins/windows/FluentShell").then((m) => m.FluentShell),
  { ssr: false, loading: () => <NeutralFallback /> },
);

export function ConcreteAppShell() {
  const { skin, ready } = useSkin();

  // Neutral SSR + first paint, then fade the resolved skin in.
  if (!ready) return <NeutralFallback />;

  const Shell = (() => {
    switch (skin) {
      case "material":
        return MaterialShell;
      case "fluent":
        return FluentShell;
      case "ios":
        return IOSShell;
      case "ipados":
        return IPadOSShell;
      case "macos":
      default:
        return AppleShell;
    }
  })();

  return (
    <div className="skin-root" data-ready={ready} aria-hidden={!ready}>
      <Shell />
      <SkinSwitcher />
    </div>
  );
}
