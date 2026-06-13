"use client";

// Android Material You shell — an Android home-screen launcher (status bar, At-a-Glance
// widget, app-icon grid, search-pill dock) where tapping a section icon opens it
// full-screen. Runtime dynamic color is extracted from the wallpaper. (DESIGN-SYSTEM §4.2)

import Image from "next/image";
import { useMemo, useState } from "react";
import { type SectionId } from "@/lib/content";
import { useSkin } from "@/components/SkinProvider";
import { DEFAULT_SEED, genRoles, readSeedParam } from "@/lib/material/color";
import { getWallpaper } from "@/lib/wallpapers";
import { MaterialHome } from "./MaterialHome";
import { MaterialApp } from "./MaterialApp";
import { MaterialSearch } from "./MaterialSearch";

export function MaterialShell() {
  const { resolvedTheme, wallpaper } = useSkin();
  const dark = resolvedTheme === "dark"; // follows the Settings appearance override
  const wp = getWallpaper("material", wallpaper);
  // Material You's signature: dynamic color is extracted from the wallpaper. Each
  // wallpaper carries a seed; an explicit ?seed= still wins for the live demo. (§4.2)
  const [seedParam] = useState<string | null>(() => readSeedParam());
  const seed = seedParam ?? wp.seed ?? DEFAULT_SEED;
  // null = home screen; a section id = that app opened full-screen.
  const [open, setOpen] = useState<SectionId | null>(null);
  const [searchOpen, setSearchOpen] = useState(false);

  const roleVars = useMemo(() => genRoles(seed, dark), [seed, dark]);

  const openSection = (id: SectionId) => {
    setSearchOpen(false);
    setOpen(id);
  };

  return (
    <div
      className="relative flex h-screen w-screen overflow-hidden"
      style={{ ...roleVars, background: "var(--md-background)", color: "var(--md-on-background)" }}
    >
      {/* Wallpaper. On the home screen it reads vividly (subtle top/bottom scrims keep
          the status bar + dock legible); inside an app a theme-tinted scrim unifies the
          floating Material surfaces. */}
      <div aria-hidden className="absolute inset-0 z-0">
        <Image src={wp.src} alt="" fill priority sizes="100vw" className="object-cover" />
        {open ? (
          <div
            className="absolute inset-0"
            style={{ background: "color-mix(in srgb, var(--md-background) 38%, transparent)" }}
          />
        ) : (
          <div
            className="absolute inset-0"
            style={{
              background:
                "linear-gradient(to bottom, rgba(0,0,0,0.28), transparent 18%, transparent 72%, rgba(0,0,0,0.32))",
            }}
          />
        )}
      </div>

      {open ? (
        <MaterialApp section={open} onBack={() => setOpen(null)} onOpen={openSection} />
      ) : (
        <MaterialHome onOpen={openSection} onOpenSearch={() => setSearchOpen(true)} />
      )}

      {searchOpen && <MaterialSearch onClose={() => setSearchOpen(false)} onOpen={openSection} />}
    </div>
  );
}
