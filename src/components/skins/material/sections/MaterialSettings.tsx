"use client";

// Settings — Material You styled. Appearance only (wallpaper deferred). (§4.2)

import { useSkin, type ThemeMode } from "@/components/SkinProvider";
import { useRipple } from "../useRipple";

const MODES: { id: ThemeMode; label: string; icon: string }[] = [
  { id: "light", label: "Light", icon: "☀️" },
  { id: "dark", label: "Dark", icon: "🌙" },
  { id: "system", label: "System", icon: "🌗" },
];

export function MaterialSettings() {
  const { theme, setTheme } = useSkin();
  return (
    <div className="max-w-xl">
      <h3
        className="mb-2 text-[13px] font-semibold uppercase tracking-wide"
        style={{ color: "var(--md-on-surface-variant)" }}
      >
        Appearance
      </h3>

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

      <p className="mt-3 text-[14px]" style={{ color: "var(--md-on-surface-variant)" }}>
        Choose how the portfolio looks. “System” follows your device’s light/dark setting.
      </p>
    </div>
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
