"use client";

// Settings — Material You styled: Appearance + Wallpaper (with dynamic color). (§4.2)

import Image from "next/image";
import { useSkin, type ThemeMode } from "@/components/SkinProvider";
import { wallpapersFor } from "@/lib/wallpapers";
import { cn } from "@/lib/cn";
import { useRipple } from "../useRipple";

const MODES: { id: ThemeMode; label: string; icon: string }[] = [
  { id: "light", label: "Light", icon: "☀️" },
  { id: "dark", label: "Dark", icon: "🌙" },
  { id: "system", label: "System", icon: "🌗" },
];

export function MaterialSettings() {
  const { theme, setTheme, wallpaper, setWallpaper } = useSkin();
  return (
    <div className="max-w-xl">
      <SectionLabel>Appearance</SectionLabel>

      {/* Material segmented button group. */}
      <div
        className="inline-flex overflow-hidden rounded-[var(--md-radius-full)]"
        style={{ border: "1px solid var(--md-outline)" }}
        role="radiogroup"
        aria-label="Appearance"
      >
        {MODES.map((m) => (
          <Segment
            key={m.id}
            label={m.label}
            icon={m.icon}
            active={theme === m.id}
            onClick={() => setTheme(m.id)}
          />
        ))}
      </div>

      <SectionLabel className="mt-7">Wallpaper</SectionLabel>
      <p className="mb-3 text-[14px]" style={{ color: "var(--md-on-surface-variant)" }}>
        Pick a wallpaper — the app’s dynamic color is generated from it.
      </p>
      <div className="flex flex-wrap gap-3">
        {wallpapersFor("material").map((w) => {
          const active = w.id === wallpaper;
          return (
            <button
              key={w.id}
              onClick={() => setWallpaper(w.id)}
              aria-pressed={active}
              aria-label={`${w.name} wallpaper`}
              className="text-center"
            >
              <span
                className="relative block h-32 w-[4.75rem] overflow-hidden rounded-[var(--md-radius-md)]"
                style={{
                  outline: active
                    ? "3px solid var(--md-primary)"
                    : "1px solid var(--md-outline-variant)",
                  outlineOffset: active ? "2px" : "0",
                }}
              >
                <Image src={w.src} alt="" fill sizes="76px" className="object-cover" />
              </span>
              <span
                className="mt-1.5 block text-[12px] font-medium"
                style={{ color: active ? "var(--md-primary)" : "var(--md-on-surface-variant)" }}
              >
                {w.name}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

function SectionLabel({
  children,
  className,
}: Readonly<{ children: React.ReactNode; className?: string }>) {
  return (
    <h3
      className={cn("mb-2 text-[13px] font-semibold uppercase tracking-wide", className)}
      style={{ color: "var(--md-on-surface-variant)" }}
    >
      {children}
    </h3>
  );
}

function Segment({
  label,
  icon,
  active,
  onClick,
}: Readonly<{ label: string; icon: string; active: boolean; onClick: () => void }>) {
  const onRipple = useRipple<HTMLButtonElement>();
  return (
    <button
      role="radio"
      aria-checked={active}
      onClick={onClick}
      onPointerDown={onRipple}
      className="md-ripple flex items-center gap-2 px-4 py-2.5 text-[14px] font-medium transition-colors"
      style={{
        background: active ? "var(--md-secondary-container)" : "transparent",
        color: active ? "var(--md-on-secondary-container)" : "var(--md-on-surface)",
      }}
    >
      {active && <span aria-hidden>✓</span>}
      <span aria-hidden>{icon}</span>
      {label}
    </button>
  );
}
