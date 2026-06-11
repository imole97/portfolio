"use client";

// Subtle, persistent skin switcher. (DESIGN-SYSTEM §2 "Manual override")
// A single corner pill, default closed. Pass 1 only ships the macOS skin; the
// other skins are listed as "soon" so the mechanism is visible without faking them.

import { useState } from "react";
import { useSkin } from "@/components/SkinProvider";
import type { Skin } from "@/lib/resolveSkin";
import { cn } from "@/lib/cn";

const OPTIONS: { skin: Skin; label: string; ready: boolean }[] = [
  { skin: "macos", label: "macOS · Liquid Glass", ready: true },
  { skin: "ios", label: "iPhone · Liquid Glass", ready: true },
  { skin: "ipados", label: "iPad · Liquid Glass", ready: true },
  { skin: "material", label: "Android · Material You", ready: true },
  { skin: "fluent", label: "Windows · Fluent", ready: true },
];

export function SkinSwitcher() {
  const { skin, override, setSkinOverride } = useSkin();
  const [open, setOpen] = useState(false);

  return (
    <div
      className="fixed bottom-3 right-3 z-[500] text-[13px]"
      style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
    >
      {open && (
        <div
          role="menu"
          aria-label="Choose a skin"
          className="glass mb-2 w-60 overflow-hidden rounded-2xl p-1.5"
        >
          {OPTIONS.map((opt) => {
            const active = skin === opt.skin;
            return (
              <button
                key={opt.skin}
                role="menuitemradio"
                aria-checked={active}
                disabled={!opt.ready}
                onClick={() => {
                  if (!opt.ready) return;
                  setSkinOverride(opt.skin);
                  setOpen(false);
                }}
                className={cn(
                  "flex w-full items-center justify-between gap-2 rounded-xl px-3 py-2 text-left transition",
                  opt.ready ? "hover:bg-black/5 dark:hover:bg-white/10" : "opacity-40",
                  active && "bg-black/5 dark:bg-white/10",
                )}
              >
                <span>{opt.label}</span>
                {active && <span className="text-accent">●</span>}
                {!opt.ready && <span className="text-xs opacity-60">soon</span>}
              </button>
            );
          })}
          {override && (
            <button
              onClick={() => {
                setSkinOverride(null);
                setOpen(false);
              }}
              className="mt-1 w-full rounded-xl px-3 py-2 text-left text-xs opacity-60 hover:bg-black/5 dark:hover:bg-white/10"
            >
              Reset to auto-detected
            </button>
          )}
        </div>
      )}

      <button
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        aria-label="Skin switcher"
        className="glass flex items-center gap-2 rounded-full px-3.5 py-2 font-medium transition active:scale-95"
      >
        <span aria-hidden>🎚️</span>
        <span className="hidden sm:inline">Skin</span>
      </button>
    </div>
  );
}
