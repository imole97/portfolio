"use client";

// iPad shell — two-pane (sidebar + detail) in landscape; single column with a
// popover sidebar in portrait. (DESIGN-SYSTEM §4.1 iPad)

import { useEffect, useRef, useState } from "react";
import { sectionMeta, type SectionId } from "@/lib/content";
import { useSkin } from "@/components/SkinProvider";
import { liquidSettle } from "@/lib/motion/apple";
import { Sidebar } from "./Sidebar";
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
  const { reducedMotion } = useSkin();
  const portrait = useOrientation();
  const [active, setActive] = useState<SectionId>("work");
  const [menuOpen, setMenuOpen] = useState(false);
  const detailRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    detailRef.current?.scrollTo({ top: 0 });
    if (contentRef.current) liquidSettle(contentRef.current, { reducedMotion, from: "center" });
  }, [active, reducedMotion]);

  function select(id: SectionId) {
    setActive(id);
    setMenuOpen(false);
  }

  const Section = SECTION_COMPONENTS[active];
  const title = sectionMeta[active].title;

  return (
    <main
      className="relative flex h-screen w-screen gap-3 overflow-hidden p-3"
      style={{ background: "var(--wallpaper)", color: "var(--text-primary)" }}
    >
      {!portrait && <Sidebar active={active} onSelect={select} />}

      <section className="glass glass-specular relative flex min-w-0 flex-1 flex-col overflow-hidden rounded-[var(--radius-card)]">
        {/* Detail toolbar */}
        <header
          className="flex h-12 shrink-0 items-center gap-3 px-4"
          style={{ borderBottom: "1px solid var(--separator)" }}
        >
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
    </main>
  );
}
