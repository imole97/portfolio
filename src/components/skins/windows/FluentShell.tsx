"use client";

// Windows Fluent shell — Mica app window with a title bar, collapsible
// NavigationView, command bar, and content area. (DESIGN-SYSTEM §4.3)

import { useState } from "react";
import { content, sectionMeta, type SectionId } from "@/lib/content";
import { useSkin } from "@/components/SkinProvider";
import { TitleBar } from "./TitleBar";
import { NavigationView } from "./NavigationView";
import { CommandBar } from "./CommandBar";
import { FLUENT_SECTIONS } from "./sections";

const DESTINATIONS: SectionId[] = ["work", "about", "settings", "contact"];

export function FluentShell() {
  const { formFactor } = useSkin();
  const [active, setActive] = useState<SectionId>("work");
  // Fluent scales down: start as an icon rail on compact widths. (§2 fallback)
  const [expanded, setExpanded] = useState(formFactor === "desktop");

  const Section = FLUENT_SECTIONS[active];

  return (
    <div
      className="flex h-screen w-screen flex-col overflow-hidden"
      style={{ background: "var(--fl-mica)", color: "var(--fl-text)" }}
    >
      <TitleBar />

      <div className="flex min-h-0 flex-1">
        <NavigationView
          destinations={DESTINATIONS}
          active={active}
          expanded={expanded}
          onToggle={() => setExpanded((v) => !v)}
          onSelect={setActive}
        />

        <div className="flex min-w-0 flex-1 flex-col">
          <CommandBar onOpenSection={setActive} />

          <main
            className="min-h-0 flex-1 overflow-auto px-6 py-5"
            style={{ contentVisibility: "auto" }}
          >
            {active === "work" && (
              <header className="mb-5">
                <h1 className="text-2xl font-semibold tracking-tight">
                  Hi, I&apos;m {content.hero.name.split(" ")[0]}
                </h1>
                <p className="mt-1 text-[15px]" style={{ color: "var(--fl-text-secondary)" }}>
                  {content.hero.thesis}
                </p>
              </header>
            )}
            {active !== "work" && (
              <h1 className="mb-5 text-2xl font-semibold tracking-tight">
                {sectionMeta[active].title}
              </h1>
            )}
            <Section />
          </main>
        </div>
      </div>
    </div>
  );
}
