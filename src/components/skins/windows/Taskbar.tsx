"use client";

// Windows 11 taskbar — full-width acrylic bar, centered app cluster, right system tray.
// (DESIGN-SYSTEM §4.3)

import { useEffect, useState } from "react";
import { sectionMeta, type SectionId } from "@/lib/content";
import { useBattery } from "@/lib/useBattery";
import { BatteryGlyph } from "@/components/BatteryGlyph";
import { useReveal } from "./useReveal";

const PINNED: SectionId[] = ["work", "about", "settings", "contact"];

interface TaskbarProps {
  startOpen: boolean;
  onToggleStart: () => void;
  onOpenSearch: () => void;
  onOpenSection: (id: SectionId) => void;
  openIds: SectionId[];
}

export function Taskbar({
  startOpen,
  onToggleStart,
  onOpenSearch,
  onOpenSection,
  openIds,
}: Readonly<TaskbarProps>) {
  const { time, date } = useClock();
  const battery = useBattery();

  return (
    <div
      className="acrylic absolute inset-x-0 bottom-0 z-[300] flex h-12 items-center px-2"
      style={{ borderTop: "1px solid var(--fl-stroke)", borderRadius: 0 }}
    >
      {/* Centered app cluster */}
      <nav aria-label="Taskbar" className="mx-auto flex items-center gap-1">
        <TaskButton label="Start" active={startOpen} onClick={onToggleStart}>
          <WindowsLogo />
        </TaskButton>
        <TaskButton label="Search" onClick={onOpenSearch}>
          <span aria-hidden className="text-[15px]">🔍</span>
        </TaskButton>
        <span className="mx-1 h-6 w-px" style={{ background: "var(--fl-stroke)" }} aria-hidden />
        {PINNED.map((id) => (
          <TaskButton
            key={id}
            label={sectionMeta[id].label}
            running={openIds.includes(id)}
            onClick={() => onOpenSection(id)}
          >
            <span aria-hidden className="text-[18px] leading-none">
              {sectionMeta[id].emoji}
            </span>
          </TaskButton>
        ))}
      </nav>

      {/* System tray */}
      <div
        className="absolute right-2 flex items-center gap-3 pr-1 text-[12px]"
        style={{ color: "var(--fl-text)" }}
      >
        <span aria-hidden className="flex items-center gap-2 opacity-80">
          <span>⌃</span>
          <span>📶</span>
          <span>🔊</span>
        </span>
        {battery !== null && (
          <span className="flex items-center gap-1 tabular-nums opacity-80">
            {battery}%
            <BatteryGlyph level={battery} />
          </span>
        )}
        <div className="text-right leading-tight" aria-label={`${time} ${date}`}>
          <div className="tabular-nums" suppressHydrationWarning>{time}</div>
          <div className="tabular-nums" suppressHydrationWarning>{date}</div>
        </div>
      </div>
    </div>
  );
}

function TaskButton({
  label,
  active,
  running,
  onClick,
  children,
}: Readonly<{
  label: string;
  active?: boolean;
  running?: boolean;
  onClick: () => void;
  children: React.ReactNode;
}>) {
  const reveal = useReveal<HTMLButtonElement>();
  return (
    <button
      {...reveal}
      onClick={onClick}
      aria-label={label}
      aria-pressed={active}
      className="reveal relative grid h-10 w-10 place-items-center rounded-[var(--fl-radius-sm)] transition-colors hover:bg-[var(--fl-subtle-hover)]"
      style={{ background: active ? "var(--fl-subtle-hover)" : "transparent" }}
    >
      {children}
      {running && (
        <span
          aria-hidden
          className="absolute bottom-0.5 h-[3px] w-3 rounded-full"
          style={{ background: "var(--fl-accent)" }}
        />
      )}
    </button>
  );
}

function WindowsLogo() {
  return (
    <span aria-hidden className="grid grid-cols-2 gap-[2px]">
      {[0, 1, 2, 3].map((i) => (
        <span
          key={i}
          className="block h-[7px] w-[7px] rounded-[1px]"
          style={{ background: "var(--fl-accent)" }}
        />
      ))}
    </span>
  );
}

function useClock() {
  const [now, setNow] = useState(() => new Date());
  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 1000 * 30);
    return () => clearInterval(id);
  }, []);
  return {
    time: now.toLocaleTimeString([], { hour: "numeric", minute: "2-digit" }),
    date: now.toLocaleDateString([], { month: "numeric", day: "numeric", year: "numeric" }),
  };
}
