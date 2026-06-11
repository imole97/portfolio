"use client";

// Android Material You shell — adaptive across mobile (bottom nav) and tablet
// (navigation rail), with runtime dynamic color. (DESIGN-SYSTEM §4.2)

import Image from "next/image";
import { useEffect, useMemo, useRef, useState } from "react";
import { content, sectionMeta, type SectionId } from "@/lib/content";
import { useSkin } from "@/components/SkinProvider";
import { DEFAULT_SEED, genRoles, readSeedParam } from "@/lib/material/color";
import { getWallpaper } from "@/lib/wallpapers";
import { TopAppBar } from "./TopAppBar";
import { BottomNav } from "./BottomNav";
import { NavRail } from "./NavRail";
import { FAB } from "./FAB";
import { MATERIAL_SECTIONS } from "./sections";

const DESTINATIONS: SectionId[] = ["work", "about", "settings"];

export function MaterialShell() {
  const { formFactor, resolvedTheme, wallpaper } = useSkin();
  const dark = resolvedTheme === "dark"; // follows the Settings appearance override
  const wp = getWallpaper("material", wallpaper);
  // Material You's signature: dynamic color is extracted from the wallpaper. Each
  // wallpaper carries a seed; an explicit ?seed= still wins for the live demo. (§4.2)
  const [seedParam] = useState<string | null>(() => readSeedParam());
  const seed = seedParam ?? wp.seed ?? DEFAULT_SEED;
  const [active, setActive] = useState<SectionId>("work");
  const scrollRef = useRef<HTMLElement>(null);

  const roleVars = useMemo(() => genRoles(seed, dark), [seed, dark]);

  // Reset scroll when switching destinations.
  useEffect(() => {
    scrollRef.current?.scrollTo({ top: 0 });
  }, [active]);

  const Section = MATERIAL_SECTIONS[active];
  const isTablet = formFactor === "tablet" || formFactor === "desktop";
  const firstName = content.hero.name.split(" ")[0];

  const title = active === "work" ? `Hi, I'm ${firstName}` : sectionMeta[active].title;
  const subtitle = active === "work" ? content.hero.role : undefined;

  const fab = (
    <FAB
      label="Contact"
      icon="✉️"
      extended={!isTablet && active === "work"}
      onClick={() => setActive("contact")}
    />
  );

  const body = (
    <>
      <TopAppBar title={title} subtitle={subtitle} scrollRef={scrollRef} />
      <main
        ref={scrollRef}
        className="relative flex-1 overflow-auto overscroll-contain px-4 pb-28 pt-2"
        style={{ contentVisibility: "auto" }}
      >
        <Section />
      </main>
    </>
  );

  return (
    <div
      className="relative flex h-screen w-screen overflow-hidden"
      style={{ ...roleVars, background: "var(--md-background)", color: "var(--md-on-background)" }}
    >
      {/* Wallpaper — visible behind the floating Material cards; the opaque app bars
          and nav frame it. A theme-tinted scrim keeps surfaces cohesive. */}
      <div aria-hidden className="absolute inset-0 z-0">
        <Image src={wp.src} alt="" fill priority sizes="100vw" className="object-cover" />
        <div
          className="absolute inset-0"
          style={{ background: "color-mix(in srgb, var(--md-background) 38%, transparent)" }}
        />
      </div>

      <div className="relative z-10 flex min-h-0 w-full flex-1">
        {isTablet ? (
          <>
            <NavRail destinations={DESTINATIONS} active={active} onSelect={setActive} fab={fab} />
            <div className="flex min-w-0 flex-1 flex-col">{body}</div>
          </>
        ) : (
          <div className="relative flex min-w-0 flex-1 flex-col">
            {body}
            {/* Floating action button sits above the bottom nav. */}
            <div className="pointer-events-none absolute bottom-20 right-4 z-[310]">
              <div className="pointer-events-auto">{fab}</div>
            </div>
            <BottomNav destinations={DESTINATIONS} active={active} onSelect={setActive} />
          </div>
        )}
      </div>
    </div>
  );
}
