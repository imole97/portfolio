"use client";

// iPhone shell — single column, collapsing large title, floating glass tab bar.
// (DESIGN-SYSTEM §4.1 iPhone) Reuses the shared glass section components + motion.

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { content, sectionMeta, type SectionId } from "@/lib/content";
import { useSkin } from "@/components/SkinProvider";
import { liquidSettle } from "@/lib/motion/apple";
import { getWallpaper } from "@/lib/wallpapers";
import { TabBar } from "./TabBar";
import { SECTION_COMPONENTS } from "./sections";

export function IOSShell() {
  const { reducedMotion, wallpaper } = useSkin();
  const wp = getWallpaper("ios", wallpaper);
  const [active, setActive] = useState<SectionId>("work");
  const [collapsed, setCollapsed] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const ticking = useRef(false);

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

      {/* Compact nav bar — small title fades in once the large title scrolls away. */}
      <header
        className="glass absolute inset-x-0 top-0 z-[200] flex items-end justify-center pb-2"
        style={{
          borderRadius: 0,
          borderBottom: collapsed ? "1px solid var(--separator)" : "1px solid transparent",
          paddingTop: "calc(env(safe-area-inset-top) + 8px)",
          background: collapsed ? "var(--glass-bg)" : "transparent",
          boxShadow: "none",
          transition: "background 200ms ease, border-color 200ms ease",
        }}
      >
        <span
          className="text-[17px] font-semibold transition-opacity duration-200"
          style={{ opacity: collapsed ? 1 : 0 }}
        >
          {title}
        </span>
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
    </main>
  );
}
