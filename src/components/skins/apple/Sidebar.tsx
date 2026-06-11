"use client";

// iPad floating glass sidebar. (DESIGN-SYSTEM §4.1 iPad)
// Subtle pointer-hover state; gated behind (pointer: fine) via CSS hover.

import { content, sectionMeta, type SectionId } from "@/lib/content";

const ITEMS: SectionId[] = ["work", "about", "play", "contact"];

interface SidebarProps {
  active: SectionId;
  onSelect: (id: SectionId) => void;
}

export function Sidebar({ active, onSelect }: Readonly<SidebarProps>) {
  return (
    <nav
      aria-label="Primary"
      className="glass glass-specular flex w-60 shrink-0 flex-col gap-1 rounded-[var(--radius-card)] p-2.5"
    >
      <div className="px-2.5 pb-2 pt-1.5">
        <p className="text-[13px]" style={{ color: "var(--text-secondary)" }}>
          {content.hero.role}
        </p>
        <p className="text-[17px] font-semibold">{content.hero.name}</p>
      </div>

      {ITEMS.map((id) => {
        const meta = sectionMeta[id];
        const isActive = id === active;
        return (
          <button
            key={id}
            onClick={() => onSelect(id)}
            aria-current={isActive ? "page" : undefined}
            className="flex items-center gap-3 rounded-[12px] px-2.5 py-2 text-left text-[15px] transition-colors hover:bg-black/5 dark:hover:bg-white/10"
            style={{
              background: isActive ? "var(--accent)" : "transparent",
              color: isActive ? "#fff" : "var(--text-primary)",
            }}
          >
            <span aria-hidden className="text-lg leading-none">
              {meta.emoji}
            </span>
            <span className="font-medium">{meta.label}</span>
          </button>
        );
      })}
    </nav>
  );
}
