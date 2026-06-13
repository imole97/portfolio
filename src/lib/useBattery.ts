"use client";

// Real battery level via the Battery Status API, shared across skins. Returns null
// where the browser doesn't expose it (Safari, Firefox, most desktops) — skins then
// render nothing rather than faking a value. (§8)

import { useEffect, useState } from "react";

interface BatteryLike {
  level: number;
  addEventListener: (type: string, cb: () => void) => void;
  removeEventListener: (type: string, cb: () => void) => void;
}

export function useBattery(): number | null {
  const [level, setLevel] = useState<number | null>(null);
  useEffect(() => {
    const getBattery = (
      navigator as Navigator & { getBattery?: () => Promise<BatteryLike> }
    ).getBattery;
    if (!getBattery) return;
    let battery: BatteryLike | null = null;
    let cancelled = false;
    const onChange = () => battery && setLevel(Math.round(battery.level * 100));
    getBattery
      .call(navigator)
      .then((b) => {
        if (cancelled) return;
        battery = b;
        onChange();
        b.addEventListener("levelchange", onChange);
      })
      .catch(() => {});
    return () => {
      cancelled = true;
      battery?.removeEventListener("levelchange", onChange);
    };
  }, []);
  return level;
}
