"use client";

// iPhone shell — single column, collapsing large title, floating glass tab bar.
// (DESIGN-SYSTEM §4.1 iPhone) Reuses the shared glass section components + motion.

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { content, sectionMeta, type SectionId } from "@/lib/content";
import { useSkin } from "@/components/SkinProvider";
import { liquidSettle } from "@/lib/motion/apple";
import { getWallpaper } from "@/lib/wallpapers";
import { useBattery } from "@/lib/useBattery";
import { BatteryGlyph } from "@/components/BatteryGlyph";
import { TabBar } from "./TabBar";
import { Spotlight } from "./Spotlight";
import { SECTION_COMPONENTS } from "./sections";

export function IOSShell() {
  const { reducedMotion, wallpaper } = useSkin();
  const wp = getWallpaper("ios", wallpaper);
  const battery = useBattery();
  const [active, setActive] = useState<SectionId>("work");
  const [collapsed, setCollapsed] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const ticking = useRef(false);

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

  // iOS large-title collapse tied to scroll. (§4.1 Motion)
  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    const onScroll = () => {
      if (ticking.current) return;
      ticking.current = true;
      requestAnimationFrame(() => {
        setCollapsed(el.scrollTop > 36);
        ticking.current = false;
      });
    };
    el.addEventListener("scroll", onScroll, { passive: true });
    return () => el.removeEventListener("scroll", onScroll);
  }, []);

  // Animate content in on tab change; reset scroll + collapse.
  useEffect(() => {
    scrollRef.current?.scrollTo({ top: 0 });
    if (contentRef.current) liquidSettle(contentRef.current, { reducedMotion, from: "bottom" });
  }, [active, reducedMotion]);

  const Section = SECTION_COMPONENTS[active];
  const title = sectionMeta[active].title;

  return (
    <main
      className="relative flex h-screen w-screen flex-col overflow-hidden"
      style={{ background: "var(--bg)", color: "var(--text-primary)" }}
    >
      {/* Wallpaper — full-bleed image with a theme-aware frosted scrim for legibility. */}
      <div aria-hidden className="absolute inset-0 z-0">
        <Image
          src={wp.src}
          alt=""
          fill
          priority
          sizes="100vw"
          className="object-cover"
        />
        <div
          className="absolute inset-0"
          style={{ background: "color-mix(in srgb, var(--bg) 55%, transparent)" }}
        />
      </div>

      {/* Compact nav bar — battery (left, real only), small title (center, fades in once
          the large title scrolls away), search (right). */}
      <header
        className="glass absolute inset-x-0 top-0 z-[200] flex items-end justify-between gap-2 px-4 pb-2"
        style={{
          borderRadius: 0,
          borderBottom: collapsed ? "1px solid var(--separator)" : "1px solid transparent",
          paddingTop: "calc(env(safe-area-inset-top) + 8px)",
          background: collapsed ? "var(--glass-bg)" : "transparent",
          boxShadow: "none",
          transition: "background 200ms ease, border-color 200ms ease",
        }}
      >
        <div className="flex min-w-[4rem] items-center">
          {battery !== null && (
            <span className="flex items-center gap-1 text-[13px] font-medium tabular-nums">
              {battery}%
              <BatteryGlyph level={battery} />
            </span>
          )}
        </div>
        <span
          className="text-[17px] font-semibold transition-opacity duration-200"
          style={{ opacity: collapsed ? 1 : 0 }}
        >
          {title}
        </span>
        <div className="flex min-w-[4rem] justify-end">
          <button
            onClick={() => setSearchOpen(true)}
            aria-label="Search"
            className="grid h-8 w-8 place-items-center rounded-full text-[15px] transition-colors hover:bg-black/5 dark:hover:bg-white/10"
          >
            🔍
          </button>
        </div>
      </header>

      <div
        ref={scrollRef}
        className="relative z-10 flex-1 overflow-auto overscroll-contain px-4 pb-32"
        style={{ paddingTop: "calc(env(safe-area-inset-top) + 52px)" }}
      >
        {/* Large title (scrolls away). */}
        <h1 className="mb-4 text-[34px] font-bold tracking-tight">{title}</h1>

        {active === "work" && (
          <p className="mb-5 text-[15px]" style={{ color: "var(--text-secondary)" }}>
            {content.hero.thesis}
          </p>
        )}

        <div ref={contentRef}>
          <Section />
        </div>
      </div>

      <TabBar active={active} onSelect={setActive} />

      <Spotlight
        open={searchOpen}
        onClose={() => setSearchOpen(false)}
        onOpenSection={(id) => {
          setActive(id);
          setSearchOpen(false);
        }}
      />
    </main>
  );
}
