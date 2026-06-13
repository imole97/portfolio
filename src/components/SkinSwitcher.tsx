"use client";

// Skin switcher. (DESIGN-SYSTEM §2 "Manual override")
// The portfolio's concept is enforced here: every device shows its own skin, and you may
// only preview its same-form-factor peer (phones: iOS↔Android, tablets: iPadOS↔Android,
// desktops: macOS↔Windows). Every other skin is shown but disabled, with a prompt to open
// it on the real device.

import { useState } from "react";
import { useSkin } from "@/components/SkinProvider";
import { peerSkin, skinDevice, type Skin } from "@/lib/resolveSkin";
import { cn } from "@/lib/cn";

const OPTIONS: { skin: Skin; label: string }[] = [
  { skin: "macos", label: "macOS · Liquid Glass" },
  { skin: "ios", label: "iPhone · Liquid Glass" },
  { skin: "ipados", label: "iPad · Liquid Glass" },
  { skin: "material", label: "Android · Material You" },
  { skin: "fluent", label: "Windows · Fluent" },
];

export function SkinSwitcher() {
  const { skin, nativeSkin, formFactor, ready, setSkinOverride } = useSkin();
  const [open, setOpen] = useState(false);

  // Until the device is resolved, there's nothing meaningful to switch between.
  if (!ready || nativeSkin === "neutral") return null;

  const peer = peerSkin(nativeSkin, formFactor);

  return (
    <div
      className="fixed bottom-3 right-3 z-[500] text-[13px]"
      style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
    >
      {open && (
        <div
          role="menu"
          aria-label="Choose a skin"
          className="glass mb-2 w-72 overflow-hidden rounded-2xl p-1.5"
        >
          <p className="px-3 pb-1 pt-1.5 text-[11px] opacity-60">
            This portfolio wears each device&apos;s own skin. You can preview its counterpart;
            other skins open on their real device.
          </p>
          {OPTIONS.map((opt) => {
            const active = skin === opt.skin;
            const allowed = opt.skin === nativeSkin || opt.skin === peer;
            return (
              <button
                key={opt.skin}
                role="menuitemradio"
                aria-checked={active}
                disabled={!allowed}
                onClick={() => {
                  if (!allowed) return;
                  setSkinOverride(opt.skin);
                  setOpen(false);
                }}
                className={cn(
                  "flex w-full items-center justify-between gap-2 rounded-xl px-3 py-2 text-left transition",
                  allowed ? "hover:bg-black/5 dark:hover:bg-white/10" : "cursor-not-allowed",
                  active && "bg-black/5 dark:bg-white/10",
                )}
              >
                <span className={cn("flex flex-col", !allowed && "opacity-45")}>
                  <span>{opt.label}</span>
                  {!allowed && (
                    <span className="text-[11px] opacity-80">Open on {skinDevice(opt.skin)}</span>
                  )}
                </span>
                {active ? (
                  <span className="text-accent">●</span>
                ) : (
                  opt.skin === nativeSkin && (
                    <span className="text-[10px] uppercase tracking-wide opacity-50">Yours</span>
                  )
                )}
              </button>
            );
          })}
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
