"use client";

// iPad shell — two-pane (sidebar + detail) in landscape; single column with a
// popover sidebar in portrait. (DESIGN-SYSTEM §4.1 iPad)

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { sectionMeta, type SectionId } from "@/lib/content";
import { useSkin } from "@/components/SkinProvider";
import { liquidSettle } from "@/lib/motion/apple";
import { getWallpaper } from "@/lib/wallpapers";
import { useBattery } from "@/lib/useBattery";
import { BatteryGlyph } from "@/components/BatteryGlyph";
import { Sidebar } from "./Sidebar";
import { Spotlight } from "./Spotlight";
import { IPadHome } from "./IPadHome";
import { SECTION_COMPONENTS } from "./sections";

function useOrientation() {
  const [portrait, setPortrait] = useState(
    () =>
      typeof window !== "undefined" &&
      window.matchMedia("(orientation: portrait)").matches,
  );
  useEffect(() => {
    const mq = window.matchMedia("(orientation: portrait)");
    const onChange = () => setPortrait(mq.matches);
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);
  return portrait;
}

export function IPadOSShell() {
  const { reducedMotion, wallpaper } = useSkin();
  const wp = getWallpaper("ipados", wallpaper);
  const battery = useBattery();
  const portrait = useOrientation();
  const [home, setHome] = useState(true); // start on the iPad home screen
  const [active, setActive] = useState<SectionId>("work");
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const detailRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    detailRef.current?.scrollTo({ top: 0 });
    if (contentRef.current) liquidSettle(contentRef.current, { reducedMotion, from: "center" });
  }, [active, reducedMotion]);

  // ⌘K / Ctrl+K opens Spotlight search.
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setSearchOpen((v) => !v);
      }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  function select(id: SectionId) {
    setActive(id);
    setMenuOpen(false);
  }

  // Launch the portfolio app at a section from the home screen / Spotlight.
  function openFromHome(id: SectionId) {
    setActive(id);
    setMenuOpen(false);
    setHome(false);
  }

  const Section = SECTION_COMPONENTS[active];
  const title = sectionMeta[active].title;

  return (
    <main
      className="relative h-screen w-screen overflow-hidden"
      style={{ background: "var(--bg)", color: "var(--text-primary)" }}
    >
      {/* Wallpaper — full-bleed image; the home screen sits directly on it, the app's
          glass panels float over it. */}
      <div aria-hidden className="absolute inset-0 z-0">
        <Image src={wp.src} alt="" fill priority sizes="100vw" className="object-cover" />
        {home && (
          <div
            className="absolute inset-0"
            style={{
              background:
                "linear-gradient(to bottom, rgba(0,0,0,0.28), transparent 16%, transparent 74%, rgba(0,0,0,0.3))",
            }}
          />
        )}
      </div>

      {home ? (
        <IPadHome onOpen={openFromHome} onOpenSearch={() => setSearchOpen(true)} />
      ) : (
        <div className="relative z-10 flex h-full w-full gap-3 p-3">
          {!portrait && (
            <div className="relative z-10">
              <Sidebar active={active} onSelect={select} />
            </div>
          )}

          <section className="glass glass-specular relative z-10 flex min-w-0 flex-1 flex-col overflow-hidden rounded-[var(--radius-card)]">
            {/* Detail toolbar */}
            <header
              className="flex h-12 shrink-0 items-center gap-3 px-4"
              style={{ borderBottom: "1px solid var(--separator)" }}
            >
              <button
                onClick={() => setHome(true)}
                aria-label="Home screen"
                className="grid h-8 w-8 place-items-center rounded-[10px] transition-colors hover:bg-black/5 dark:hover:bg-white/10"
              >
                <HomeGlyph />
              </button>
              {portrait && (
                <button
                  onClick={() => setMenuOpen((v) => !v)}
                  aria-label="Show sections"
                  aria-expanded={menuOpen}
                  className="grid h-8 w-8 place-items-center rounded-[10px] text-lg transition-colors hover:bg-black/5 dark:hover:bg-white/10"
                >
                  ☰
                </button>
              )}
              <h1 className="text-[17px] font-semibold">{title}</h1>

              <div className="ml-auto flex items-center gap-3">
                {battery !== null && (
                  <span className="flex items-center gap-1 text-[13px] font-medium tabular-nums opacity-80">
                    {battery}%
                    <BatteryGlyph level={battery} />
                  </span>
                )}
                <button
                  onClick={() => setSearchOpen(true)}
                  aria-label="Search"
                  className="grid h-8 w-8 place-items-center rounded-[10px] text-[15px] transition-colors hover:bg-black/5 dark:hover:bg-white/10"
                >
                  🔍
                </button>
              </div>
            </header>

            <div ref={detailRef} className="min-h-0 flex-1 overflow-auto p-5">
              <div ref={contentRef}>
                <Section />
              </div>
            </div>

            {/* Portrait popover sidebar, anchored to the toolbar button. (§4.1 Popovers) */}
            {portrait && menuOpen && (
              <>
                <button
                  aria-label="Close menu"
                  className="absolute inset-0 z-[390] cursor-default"
                  onClick={() => setMenuOpen(false)}
                />
                <div className="absolute left-3 top-14 z-[400]">
                  <Sidebar active={active} onSelect={select} />
                </div>
              </>
            )}
          </section>
        </div>
      )}

      <Spotlight
        open={searchOpen}
        onClose={() => setSearchOpen(false)}
        onOpenSection={(id) => {
          openFromHome(id);
          setSearchOpen(false);
        }}
      />
    </main>
  );
}

function HomeGlyph() {
  return (
    <span aria-hidden className="grid grid-cols-2 gap-[3px]">
      {[0, 1, 2, 3].map((i) => (
        <span key={i} className="block h-[6px] w-[6px] rounded-[2px]" style={{ background: "currentColor" }} />
      ))}
    </span>
  );
}
