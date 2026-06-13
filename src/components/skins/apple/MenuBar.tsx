"use client";

// Translucent macOS menu bar. (DESIGN-SYSTEM §4.1 macOS layout sketch)

import { useEffect, useState } from "react";
import { content, sectionMeta, type SectionId } from "@/lib/content";
import { useBattery } from "@/lib/useBattery";
import { BatteryGlyph } from "@/components/BatteryGlyph";

interface MenuBarProps {
  focusedId: SectionId | null;
  onOpenSpotlight: () => void;
}

export function MenuBar({ focusedId, onOpenSpotlight }: Readonly<MenuBarProps>) {
  const clock = useClock();
  const battery = useBattery();
  const appName = focusedId ? sectionMeta[focusedId].label : "Finder";

  return (
    <header
      className="glass fixed inset-x-0 top-0 z-[300] flex h-7 items-center justify-between px-3 text-[13px]"
      style={{ borderRadius: 0, borderBottom: "1px solid var(--separator)" }}
      role="banner"
    >
      <nav className="flex items-center gap-4" aria-label="Menu bar">
        <span className="text-[15px] leading-none"></span>
        <span className="font-semibold">{content.hero.name.split(" ")[0]}</span>
        <span className="hidden font-medium opacity-80 sm:inline">{appName}</span>
        <span className="hidden opacity-60 md:inline">File</span>
        <span className="hidden opacity-60 md:inline">View</span>
      </nav>

      <div className="flex items-center gap-3">
        <button
          onClick={onOpenSpotlight}
          aria-label="Open search (Command K)"
          className="flex items-center gap-1 opacity-80 transition-opacity hover:opacity-100"
        >
          <span aria-hidden>🔍</span>
          <kbd className="hidden rounded bg-black/10 px-1.5 text-[11px] dark:bg-white/15 sm:inline">
            ⌘K
          </kbd>
        </button>
        {battery !== null && (
          <span className="flex items-center gap-1 tabular-nums opacity-80">
            {battery}%
            <BatteryGlyph level={battery} />
          </span>
        )}
        <time className="tabular-nums opacity-80" suppressHydrationWarning>
          {clock}
        </time>
      </div>
    </header>
  );
}

function useClock() {
  const [now, setNow] = useState(() => formatTime(new Date()));
  useEffect(() => {
    const id = setInterval(() => setNow(formatTime(new Date())), 1000 * 30);
    return () => clearInterval(id);
  }, []);
  return now;
}

function formatTime(d: Date) {
  return d.toLocaleTimeString([], { hour: "numeric", minute: "2-digit" });
}
