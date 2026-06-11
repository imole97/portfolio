"use client";

// Settings — Fluent styled. Appearance only (wallpaper deferred). (§4.3)

import { useSkin, type ThemeMode } from "@/components/SkinProvider";
import { useReveal } from "../useReveal";

const MODES: { id: ThemeMode; label: string; detail: string }[] = [
  { id: "light", label: "Light", detail: "Always use a light theme" },
  { id: "dark", label: "Dark", detail: "Always use a dark theme" },
  { id: "system", label: "Use system setting", detail: "Match your Windows app mode" },
];

export function FluentSettings() {
  const { theme, setTheme } = useSkin();
  return (
    <div className="max-w-2xl">
      <h3 className="mb-1 text-[15px] font-semibold">Appearance</h3>
      <p className="mb-4 text-[13px]" style={{ color: "var(--fl-text-secondary)" }}>
        Select which app theme to display.
      </p>

      <div
        className="fluent-card overflow-hidden"
        role="radiogroup"
        aria-label="App theme"
      >
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
