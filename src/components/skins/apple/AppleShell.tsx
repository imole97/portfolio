"use client";

// macOS desktop shell — wallpaper + menu bar + dock + draggable glass windows
// + Spotlight ⌘K. (DESIGN-SYSTEM §4.1 macOS)

import Image from "next/image";
import { useCallback, useEffect, useState } from "react";
import { content, sectionMeta, type SectionId } from "@/lib/content";
import { useSkin } from "@/components/SkinProvider";
import { getWallpaper } from "@/lib/wallpapers";
import { useWindowManager } from "@/lib/windowManager";
import { Window } from "./Window";
import { MenuBar } from "./MenuBar";
import { Dock } from "./Dock";
import { Spotlight } from "./Spotlight";
import { SECTION_COMPONENTS } from "./sections";

function useViewport() {
  const [vp, setVp] = useState({ w: 1280, h: 800 });
  useEffect(() => {
    const apply = () => setVp({ w: window.innerWidth, h: window.innerHeight });
    apply();
    window.addEventListener("resize", apply);
    return () => window.removeEventListener("resize", apply);
  }, []);
  return vp;
}

export function AppleShell() {
  const { wallpaper } = useSkin();
  const wp = getWallpaper("macos", wallpaper);
  const manager = useWindowManager(["work"]);
  const viewport = useViewport();
  const [spotlightOpen, setSpotlightOpen] = useState(false);

  // Global ⌘K / Ctrl+K to toggle Spotlight. (DESIGN-SYSTEM §8)
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setSpotlightOpen((v) => !v);
      }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const openSection = useCallback(
    (id: SectionId) => {
      manager.openWindow(id);
      setSpotlightOpen(false);
    },
    [manager],
  );

  const openIds = manager.windows.filter((w) => w.open).map((w) => w.id);

  return (
    <main
      className="relative h-screen w-screen overflow-hidden"
      style={{ background: "var(--bg)" }}
    >
      {/* Desktop wallpaper — full-bleed image behind the menu bar, windows, and dock. */}
      <div aria-hidden className="absolute inset-0 z-0">
        <Image src={wp.src} alt="" fill priority sizes="100vw" className="object-cover" />
      </div>

      <MenuBar focusedId={manager.focusedId} onOpenSpotlight={() => setSpotlightOpen(true)} />

      {/* Desktop greeting — visible when no window covers it. A soft shadow keeps it
          legible over any wallpaper. */}
      <div
        className="pointer-events-none absolute left-1/2 top-[16%] z-[1] -translate-x-1/2 px-6 text-center text-white"
        style={{ textShadow: "0 1px 24px rgba(0,0,0,0.45)" }}
      >
        <p className="text-[13px] uppercase tracking-[0.2em] opacity-80">{content.hero.role}</p>
        <h1 className="mt-2 text-[clamp(2rem,5vw,4rem)] font-semibold tracking-tight">
          {content.hero.name}
        </h1>
        <p className="mx-auto mt-3 max-w-md text-[15px] opacity-90">{content.hero.thesis}</p>
      </div>

      {/* Windows */}
      {manager.windows
        .filter((w) => w.open)
        .map((w) => {
          const Body = SECTION_COMPONENTS[w.id];
          return (
            <Window
              key={w.id}
              state={w}
              title={sectionMeta[w.id].title}
              manager={manager}
              focused={manager.focusedId === w.id}
              viewport={viewport}
            >
              <Body />
            </Window>
          );
        })}

      <Dock onOpen={openSection} openIds={openIds} />

      <Spotlight
        open={spotlightOpen}
        onClose={() => setSpotlightOpen(false)}
        onOpenSection={openSection}
      />
    </main>
  );
}
