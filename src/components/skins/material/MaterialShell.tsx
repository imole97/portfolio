"use client";

// Android Material You shell — adaptive across mobile (bottom nav) and tablet
// (navigation rail), with runtime dynamic color. (DESIGN-SYSTEM §4.2)

import { useEffect, useMemo, useRef, useState } from "react";
import { content, sectionMeta, type SectionId } from "@/lib/content";
import { useSkin } from "@/components/SkinProvider";
import { genRoles, readSeedFromLocation } from "@/lib/material/color";
import { TopAppBar } from "./TopAppBar";
import { BottomNav } from "./BottomNav";
import { NavRail } from "./NavRail";
import { FAB } from "./FAB";
import { MATERIAL_SECTIONS } from "./sections";

const DESTINATIONS: SectionId[] = ["work", "about", "play"];

function useColorScheme() {
  const [dark, setDark] = useState(
    () =>
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-color-scheme: dark)").matches,
  );
  useEffect(() => {
    const mq = window.matchMedia("(prefers-color-scheme: dark)");
    const onChange = () => setDark(mq.matches);
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);
  return dark;
}

export function MaterialShell() {
  const { formFactor } = useSkin();
  const dark = useColorScheme();
  // Seed dynamic color from ?seed= for the live demo (recruiter delight). (§4.2)
  const [seed] = useState<string>(() => readSeedFromLocation());
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
      className="flex h-screen w-screen overflow-hidden"
      style={{ ...roleVars, background: "var(--md-background)", color: "var(--md-on-background)" }}
    >
      {isTablet ? (
        <>
          <NavRail destinations={DESTINATIONS} active={active} onSelect={setActive} fab={fab} />
          <div className="flex min-w-0 flex-1 flex-col">{body}</div>
        </>
      ) : (
        <div className="flex min-w-0 flex-1 flex-col">
          {body}
          {/* Floating action button sits above the bottom nav. */}
          <div className="pointer-events-none absolute bottom-20 right-4 z-[310]">
            <div className="pointer-events-auto">{fab}</div>
          </div>
          <BottomNav destinations={DESTINATIONS} active={active} onSelect={setActive} />
        </div>
      )}
    </div>
  );
}
