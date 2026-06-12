"use client";

// Settings — Fluent styled: Appearance + Background (wallpaper). (§4.3)

import Image from "next/image";
import { useSkin, type ThemeMode } from "@/components/SkinProvider";
import { wallpapersFor } from "@/lib/wallpapers";
import { useReveal } from "../useReveal";

const MODES: { id: ThemeMode; label: string; detail: string }[] = [
  { id: "light", label: "Light", detail: "Always use a light theme" },
  { id: "dark", label: "Dark", detail: "Always use a dark theme" },
  { id: "system", label: "Use system setting", detail: "Match your Windows app mode" },
];

export function FluentSettings() {
  const { theme, setTheme, wallpaper, setWallpaper } = useSkin();
  return (
    <div className="max-w-2xl">
      <h3 className="mb-1 text-[15px] font-semibold">Appearance</h3>
      <p className="mb-4 text-[13px]" style={{ color: "var(--fl-text-secondary)" }}>
        Select which app theme to display.
      </p>

      <div className="fluent-card overflow-hidden" role="radiogroup" aria-label="App theme">
        {MODES.map((m, i) => (
          <Option
            key={m.id}
            label={m.label}
            detail={m.detail}
            active={theme === m.id}
            first={i === 0}
            onClick={() => setTheme(m.id)}
          />
        ))}
      </div>

      <h3 className="mb-1 mt-7 text-[15px] font-semibold">Background</h3>
      <p className="mb-4 text-[13px]" style={{ color: "var(--fl-text-secondary)" }}>
        Choose a picture for your desktop.
      </p>

      <div className="flex flex-wrap gap-3">
        {wallpapersFor("fluent").map((w) => {
          const active = w.id === wallpaper;
          return (
            <button
              key={w.id}
              onClick={() => setWallpaper(w.id)}
              aria-pressed={active}
              aria-label={`${w.name} background`}
              className="text-left"
            >
              <span
                className="relative block h-[4.75rem] w-32 overflow-hidden rounded-[var(--fl-radius-sm)]"
                style={{
                  outline: active
                    ? "2px solid var(--fl-accent)"
                    : "1px solid var(--fl-stroke-strong)",
                  outlineOffset: active ? "2px" : "0",
                }}
              >
                <Image src={w.src} alt="" fill sizes="128px" className="object-cover" />
              </span>
              <span
                className="mt-1.5 block text-[12px] font-medium"
                style={{ color: active ? "var(--fl-accent)" : "var(--fl-text-secondary)" }}
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

function Option({
  label,
  detail,
  active,
  first,
  onClick,
}: Readonly<{
  label: string;
  detail: string;
  active: boolean;
  first: boolean;
  onClick: () => void;
}>) {
  const reveal = useReveal<HTMLButtonElement>();
  return (
    <button
      {...reveal}
      role="radio"
      aria-checked={active}
      onClick={onClick}
      className="reveal flex w-full items-center gap-3 px-4 py-3 text-left transition-colors hover:bg-[var(--fl-subtle-hover)]"
      style={{ borderTop: first ? undefined : "1px solid var(--fl-stroke)" }}
    >
      {/* Radio indicator */}
      <span
        aria-hidden
        className="grid h-5 w-5 shrink-0 place-items-center rounded-full"
        style={{
          border: `1.5px solid ${active ? "var(--fl-accent)" : "var(--fl-text-secondary)"}`,
        }}
      >
        {active && (
          <span className="h-2.5 w-2.5 rounded-full" style={{ background: "var(--fl-accent)" }} />
        )}
      </span>
      <span>
        <span className="block text-[14px] font-medium">{label}</span>
        <span className="block text-[12px]" style={{ color: "var(--fl-text-secondary)" }}>
          {detail}
        </span>
      </span>
    </button>
  );
}
