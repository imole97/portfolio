"use client";

// Windows 11 desktop — wallpaper, draggable Fluent windows, centered taskbar, and
// a Start menu. The Windows analog of the macOS desktop. (DESIGN-SYSTEM §4.3)

import Image from "next/image";
import { useCallback, useEffect, useState } from "react";
import { content, sectionMeta, type SectionId } from "@/lib/content";
import { useSkin } from "@/components/SkinProvider";
import { useWindowManager } from "@/lib/windowManager";
import { getWallpaper } from "@/lib/wallpapers";
import { FluentWindow } from "./FluentWindow";
import { Taskbar } from "./Taskbar";
import { StartMenu } from "./StartMenu";
import { FLUENT_SECTIONS } from "./sections";

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

export function FluentShell() {
  const { wallpaper } = useSkin();
  const wp = getWallpaper("fluent", wallpaper);
  const manager = useWindowManager(["work"]);
  const viewport = useViewport();
  const [startOpen, setStartOpen] = useState(false);

  // Win / ⌘+K / Ctrl+K toggles the Start menu. (DESIGN-SYSTEM §8)
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Meta" || ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k")) {
        e.preventDefault();
        setStartOpen((v) => !v);
      }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const openSection = useCallback(
    (id: SectionId) => {
      manager.openWindow(id);
      setStartOpen(false);
    },
    [manager],
  );

  const openIds = manager.windows.map((w) => w.id);

  return (
    <main
      className="relative h-screen w-screen overflow-hidden"
      style={{ background: "#16407f", color: "var(--fl-text)" }}
    >
      {/* Desktop wallpaper — the acrylic taskbar / Start menu blur it for the Mica look. */}
      <div aria-hidden className="absolute inset-0 z-0">
        <Image src={wp.src} alt="" fill priority sizes="100vw" className="object-cover" />
      </div>

      {/* Desktop greeting — visible behind any windows. */}
      <div
        className="pointer-events-none absolute left-1/2 top-[14%] z-[1] -translate-x-1/2 px-6 text-center text-white"
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
          const Body = FLUENT_SECTIONS[w.id];
          return (
            <FluentWindow
              key={w.id}
              state={w}
              title={sectionMeta[w.id].title}
              icon={sectionMeta[w.id].emoji}
              manager={manager}
              focused={manager.focusedId === w.id}
              viewport={viewport}
            >
              <Body />
            </FluentWindow>
          );
        })}

      {startOpen && <StartMenu onClose={() => setStartOpen(false)} onOpenSection={openSection} />}

      <Taskbar
        startOpen={startOpen}
        onToggleStart={() => setStartOpen((v) => !v)}
        onOpenSearch={() => setStartOpen(true)}
        onOpenSection={openSection}
        openIds={openIds}
      />
    </main>
  );
}
