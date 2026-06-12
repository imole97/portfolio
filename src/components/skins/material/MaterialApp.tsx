"use client";

// A section opened full-screen from the home screen — top app bar with a back
// affordance, the section content, and (on Work) the extended Contact FAB. No bottom
// nav: you return to the launcher with Back. (§4.2)

import { useEffect, useRef } from "react";
import { content, sectionMeta, type SectionId } from "@/lib/content";
import { useSkin } from "@/components/SkinProvider";
import { appOpen } from "@/lib/motion/material";
import { TopAppBar } from "./TopAppBar";
import { FAB } from "./FAB";
import { useRipple } from "./useRipple";
import { MATERIAL_SECTIONS } from "./sections";

interface MaterialAppProps {
  section: SectionId;
  onBack: () => void;
  onOpen: (id: SectionId) => void;
}

export function MaterialApp({ section, onBack, onOpen }: Readonly<MaterialAppProps>) {
  const { reducedMotion } = useSkin();
  const scrollRef = useRef<HTMLElement>(null);
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: 0 });
    if (rootRef.current) appOpen(rootRef.current, { reducedMotion });
  }, [section, reducedMotion]);

  // Back gesture / system Back closes the app.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onBack();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onBack]);

  const Section = MATERIAL_SECTIONS[section];
  const firstName = content.hero.name.split(" ")[0];
  const title = section === "work" ? `Hi, I'm ${firstName}` : sectionMeta[section].title;
  const subtitle = section === "work" ? content.hero.role : undefined;

  return (
    <div ref={rootRef} className="relative z-10 flex h-full w-full flex-col" style={{ willChange: "transform" }}>
      <TopAppBar
        title={title}
        subtitle={subtitle}
        scrollRef={scrollRef}
        leading={<BackButton onBack={onBack} />}
      />
      <main
        ref={scrollRef}
        className="relative flex-1 overflow-auto overscroll-contain px-4 pb-28 pt-2"
        style={{ contentVisibility: "auto" }}
      >
        <Section />
      </main>

      {section === "work" && (
        <div className="absolute bottom-6 right-4 z-[310]">
          <FAB label="Contact" icon="✉️" extended onClick={() => onOpen("contact")} />
        </div>
      )}
    </div>
  );
}

function BackButton({ onBack }: Readonly<{ onBack: () => void }>) {
  const onRipple = useRipple<HTMLButtonElement>();
  return (
    <button
      onPointerDown={onRipple}
      onClick={onBack}
      aria-label="Back to home screen"
      className="md-ripple grid h-10 w-10 shrink-0 place-items-center rounded-[var(--md-radius-full)] text-[22px] leading-none transition-colors hover:bg-[var(--md-surface-container-high)]"
      style={{ color: "var(--md-on-surface)" }}
    >
      ←
    </button>
  );
}
