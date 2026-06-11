"use client";

// macOS desktop shell — wallpaper + menu bar + dock + draggable glass windows
// + Spotlight ⌘K. (DESIGN-SYSTEM §4.1 macOS)

import { useCallback, useEffect, useState } from "react";
import { content, sectionMeta, type SectionId } from "@/lib/content";
import { useWindowManager } from "./windowManager";
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
      style={{ background: "var(--wallpaper)" }}
    >
      <MenuBar focusedId={manager.focusedId} onOpenSpotlight={() => setSpotlightOpen(true)} />

      {/* Desktop greeting — visible when no window covers it. */}
      <div className="pointer-events-none absolute left-1/2 top-[16%] -translate-x-1/2 px-6 text-center">
        <p className="text-[13px] uppercase tracking-[0.2em] text-[var(--text-secondary)]">
          {content.hero.role}
        </p>
        <h1 className="mt-2 text-[clamp(2rem,5vw,4rem)] font-semibold tracking-tight">
          {content.hero.name}
        </h1>
        <p className="mx-auto mt-3 max-w-md text-[15px] text-[var(--text-secondary)]">
          {content.hero.thesis}
        </p>
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
