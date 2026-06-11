"use client";

// macOS dock with pointer-distance magnification. (DESIGN-SYSTEM §4.1 macOS, §8)
// Magnify is gated behind (pointer: fine) + reducedMotion inside createDockMagnifier.

import { useEffect, useRef } from "react";
import { sectionMeta, type SectionId } from "@/lib/content";
import { useSkin } from "@/components/SkinProvider";
import { createDockMagnifier } from "@/lib/motion/apple";

const DOCK_ITEMS: SectionId[] = ["work", "about", "play", "contact"];

interface DockProps {
  onOpen: (id: SectionId) => void;
  openIds: SectionId[];
}

export function Dock({ onOpen, openIds }: DockProps) {
  const { reducedMotion } = useSkin();
  const itemRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const magnifier = useRef<ReturnType<typeof createDockMagnifier> | null>(null);

  useEffect(() => {
    const items = itemRefs.current.filter(Boolean) as HTMLElement[];
    magnifier.current = createDockMagnifier(items, { reducedMotion });
    return () => magnifier.current?.reset();
  }, [reducedMotion]);

  return (
    <div
      className="fixed inset-x-0 bottom-3 z-[200] flex justify-center"
      style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
    >
      <nav
        aria-label="Dock"
        onPointerMove={(e) => magnifier.current?.update(e.clientX)}
        onPointerLeave={() => magnifier.current?.reset()}
        className="glass glass-specular flex items-end gap-2 rounded-[26px] px-3 py-2"
      >
        {DOCK_ITEMS.map((id, i) => {
          const meta = sectionMeta[id];
          const isOpen = openIds.includes(id);
          return (
            <button
              key={id}
              ref={(el) => {
                itemRefs.current[i] = el;
              }}
              onClick={() => onOpen(id)}
              aria-label={`Open ${meta.label}`}
              className="relative grid origin-bottom place-items-center"
              style={{ willChange: "transform" }}
            >
              <span
                aria-hidden
                className="grid h-12 w-12 place-items-center rounded-[14px] text-2xl"
                style={{
                  background:
                    "linear-gradient(145deg, rgba(255,255,255,0.5), rgba(255,255,255,0.12))",
                  boxShadow: "inset 0 1px 0 rgba(255,255,255,0.5)",
                }}
              >
                {meta.emoji}
              </span>
              <span
                aria-hidden
                className="mt-1 h-1 w-1 rounded-full bg-current transition-opacity"
                style={{ opacity: isOpen ? 0.7 : 0 }}
              />
            </button>
          );
        })}
      </nav>
    </div>
  );
}
