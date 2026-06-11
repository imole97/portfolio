"use client";

// Settings — iOS grouped-inset-list style. (Display & Brightness + Wallpaper)
// Shared by macOS / iPad / iPhone; the Wallpaper group shows on iPhone only.

import Image from "next/image";
import { useSkin, type ThemeMode } from "@/components/SkinProvider";
import { getWallpaper, wallpaperScope, wallpapersFor } from "@/lib/wallpapers";
import { cn } from "@/lib/cn";

export function AppleSettings() {
  const { skin, theme, resolvedTheme, setTheme, wallpaper, setWallpaper } = useSkin();
  const automatic = theme === "system";
  const scope = wallpaperScope(skin);

  // Light/Dark tiles set an explicit appearance; the Automatic switch returns to system.
  function pickAppearance(mode: Exclude<ThemeMode, "system">) {
    setTheme(mode);
  }

  return (
    <div className="mx-auto max-w-xl pb-2">
      {/* APPEARANCE */}
      <GroupLabel>Appearance</GroupLabel>
      <Group>
        <div className="flex gap-4 p-4">
          <AppearanceTile
            label="Light"
            selected={!automatic && resolvedTheme === "light"}
            onClick={() => pickAppearance("light")}
            variant="light"
          />
          <AppearanceTile
            label="Dark"
            selected={!automatic && resolvedTheme === "dark"}
            onClick={() => pickAppearance("dark")}
            variant="dark"
          />
        </div>
        <Separator />
        <Row
          label="Automatic"
          detail="Match this device's system setting"
          control={
            <IOSSwitch
              checked={automatic}
              onChange={(on) => setTheme(on ? "system" : resolvedTheme)}
              label="Automatic appearance"
            />
          }
        />
      </Group>

      {/* WALLPAPER — iPhone + iPad. */}
      {scope && (
        <>
          <GroupLabel>Wallpaper</GroupLabel>
          <Group>
            <div className="flex gap-3 overflow-x-auto p-4">
              {wallpapersFor(scope).map((w) => {
                const active = w.id === wallpaper;
                // iPhone wallpapers are portrait; iPad/Mac are landscape.
                const portrait = scope === "ios";
                return (
                  <button
                    key={w.id}
                    onClick={() => setWallpaper(w.id)}
                    aria-pressed={active}
                    aria-label={`${w.name} wallpaper`}
                    className="shrink-0 text-center"
                  >
                    <span
                      className={cn(
                        "relative block overflow-hidden rounded-[14px]",
                        portrait ? "h-36 w-[5.5rem] rounded-[18px]" : "h-[5.5rem] w-32",
                        active
                          ? "ring-2 ring-[var(--accent)] ring-offset-2 ring-offset-transparent"
                          : "ring-1 ring-[var(--separator)]",
                      )}
                    >
                      <Image
                        src={w.src}
                        alt=""
                        fill
                        sizes={portrait ? "88px" : "128px"}
                        className="object-cover"
                      />
                    </span>
                    <span className="mt-1.5 block text-[12px] font-medium">{w.name}</span>
                  </button>
                );
              })}
            </div>
          </Group>
          <p className="px-4 pt-1 text-[12px]" style={{ color: "var(--text-secondary)" }}>
            Selected: {getWallpaper(scope, wallpaper).name}
          </p>
        </>
      )}
    </div>
  );
}

function GroupLabel({ children }: { children: React.ReactNode }) {
  return (
    <h3
      className="mb-1.5 mt-5 px-4 text-[12px] font-medium uppercase tracking-wide first:mt-0"
      style={{ color: "var(--text-secondary)" }}
    >
      {children}
    </h3>
  );
}

function Group({ children }: { children: React.ReactNode }) {
  return (
    <div
      className="overflow-hidden rounded-[var(--radius-card)]"
      style={{ background: "var(--glass-bg)", border: "1px solid var(--separator)" }}
    >
      {children}
    </div>
  );
}

function Separator() {
  return <div style={{ height: 1, background: "var(--separator)" }} className="ml-4" />;
}

function Row({
  label,
  detail,
  control,
}: {
  label: string;
  detail?: string;
  control: React.ReactNode;
}) {
  return (
    <div className="flex items-center justify-between gap-3 px-4 py-3">
      <div>
        <p className="text-[15px]">{label}</p>
        {detail && (
          <p className="text-[12px]" style={{ color: "var(--text-secondary)" }}>
            {detail}
          </p>
        )}
      </div>
      {control}
    </div>
  );
}

function AppearanceTile({
  label,
  selected,
  onClick,
  variant,
}: {
  label: string;
  selected: boolean;
  onClick: () => void;
  variant: "light" | "dark";
}) {
  return (
    <button onClick={onClick} aria-pressed={selected} className="flex-1 text-center">
      <span
        className={cn(
          "relative grid h-24 w-full place-items-center overflow-hidden rounded-[14px]",
          selected
            ? "ring-2 ring-[var(--accent)] ring-offset-2 ring-offset-transparent"
            : "ring-1 ring-[var(--separator)]",
        )}
        style={{
          background:
            variant === "light"
              ? "linear-gradient(160deg, #ffffff, #e7ecf6)"
              : "linear-gradient(160deg, #1c1c1e, #000)",
          color: variant === "light" ? "#1c1c1e" : "#fff",
        }}
      >
        <span className="text-[20px] font-semibold">Aa</span>
      </span>
      <span className="mt-1.5 flex items-center justify-center gap-1 text-[13px] font-medium">
        {selected && <span style={{ color: "var(--accent)" }}>✓</span>}
        {label}
      </span>
    </button>
  );
}

/** Native iOS toggle switch. */
function IOSSwitch({
  checked,
  onChange,
  label,
}: {
  checked: boolean;
  onChange: (on: boolean) => void;
  label: string;
}) {
  return (
    <button
      role="switch"
      aria-checked={checked}
      aria-label={label}
      onClick={() => onChange(!checked)}
      className="relative h-[31px] w-[51px] shrink-0 rounded-full transition-colors duration-200"
      style={{ background: checked ? "#34c759" : "rgba(120,120,128,0.32)" }}
    >
      <span
        className="absolute top-[2px] h-[27px] w-[27px] rounded-full bg-white shadow-md transition-all duration-200"
        style={{ left: checked ? 22 : 2 }}
      />
    </button>
  );
}
