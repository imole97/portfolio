"use client";

import { useCallback } from "react";
import { spawnRipple } from "@/lib/motion/material";
import { useSkin } from "@/components/SkinProvider";

/**
 * Returns an `onPointerDown` handler that spawns a Material press ripple inside the
 * event target. Add the `md-ripple` class to the host element. (DESIGN-SYSTEM §4.2)
 * No ref needed — the host is read from `event.currentTarget`.
 */
export function useRipple<T extends HTMLElement>() {
  const { reducedMotion } = useSkin();
  return useCallback(
    (e: React.PointerEvent<T>) => {
      spawnRipple(e.currentTarget, e.clientX, e.clientY, reducedMotion);
    },
    [reducedMotion],
  );
}
