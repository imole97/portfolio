"use client";

// Mica title bar with caption buttons. (DESIGN-SYSTEM §4.3 layout sketch)
// Caption buttons are decorative (this is a web app), but complete the illusion.

import { content } from "@/lib/content";

export function TitleBar() {
  return (
    <header
      className="flex h-8 shrink-0 items-center justify-between pl-3 text-[12px]"
      style={{ color: "var(--fl-text-secondary)" }}
      role="banner"
    >
      <div className="flex items-center gap-2">
        <span aria-hidden>🪟</span>
        <span>{content.hero.name} — Portfolio</span>
      </div>
      <div className="flex items-stretch" aria-hidden>
        <CaptionButton glyph="—" label="Minimize" />
        <CaptionButton glyph="▢" label="Maximize" />
        <CaptionButton glyph="✕" label="Close" danger />
      </div>
    </header>
  );
}

function CaptionButton({
  glyph,
  label,
  danger,
}: Readonly<{ glyph: string; label: string; danger?: boolean }>) {
  return (
    <button
      tabIndex={-1}
      aria-label={label}
      className="grid h-8 w-12 place-items-center text-[11px] transition-colors"
      style={{ color: "var(--fl-text-secondary)" }}
      onMouseEnter={(e) => {
        e.currentTarget.style.background = danger ? "#c42b1c" : "var(--fl-subtle-hover)";
        if (danger) e.currentTarget.style.color = "#fff";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.background = "transparent";
        e.currentTarget.style.color = "var(--fl-text-secondary)";
      }}
    >
      {glyph}
    </button>
  );
}
