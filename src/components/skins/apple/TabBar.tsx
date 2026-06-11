"use client";

// iOS floating glass tab bar. (DESIGN-SYSTEM §4.1 iPhone)
// 4 destinations; respects the bottom safe-area inset.

import { sectionMeta, type SectionId } from "@/lib/content";
import { cn } from "@/lib/cn";

const TABS: SectionId[] = ["work", "about", "settings", "contact"];

interface TabBarProps {
  active: SectionId;
  onSelect: (id: SectionId) => void;
}

export function TabBar({ active, onSelect }: Readonly<TabBarProps>) {
  return (
    <div
      className="fixed inset-x-0 bottom-0 z-[300] flex justify-center px-4 pb-[calc(env(safe-area-inset-bottom)+8px)] pt-2"
    >
      <nav
        aria-label="Primary"
        className="glass glass-specular flex w-full max-w-md items-stretch justify-around rounded-[28px] px-2 py-1.5"
      >
        {TABS.map((id) => {
          const meta = sectionMeta[id];
          const isActive = id === active;
          return (
            <button
              key={id}
              onClick={() => onSelect(id)}
              aria-current={isActive ? "page" : undefined}
              aria-label={meta.label}
              className="flex flex-1 flex-col items-center gap-0.5 rounded-2xl px-2 py-1.5 transition-transform active:scale-95"
            >
              <span aria-hidden className="text-xl leading-none">
                {meta.emoji}
              </span>
              <span
                className={cn("text-[10px] font-medium")}
                style={{ color: isActive ? "var(--accent)" : "var(--text-secondary)" }}
              >
                {meta.label}
              </span>
            </button>
          );
        })}
      </nav>
    </div>
  );
}
