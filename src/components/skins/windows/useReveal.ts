"use client";

import { useCallback, useMemo } from "react";
import { useSkin } from "@/components/SkinProvider";

/**
 * Fluent reveal highlight: a soft radial glow follows the pointer over the surface.
 * Spread the returned handlers onto an element with the `reveal` class. Disabled under
 * reducedMotion or a coarse pointer. (DESIGN-SYSTEM §4.3, §8)
 */
export function useReveal<T extends HTMLElement>() {
  const { reducedMotion } = useSkin();

  const enabled = useMemo(
    () =>
      !reducedMotion &&
      typeof window !== "undefined" &&
      window.matchMedia("(pointer: fine)").matches,
    [reducedMotion],
  );

  const onPointerMove = useCallback(
    (e: React.PointerEvent<T>) => {
      if (!enabled) return;
      const el = e.currentTarget;
      const rect = el.getBoundingClientRect();
      el.style.setProperty("--reveal-x", `${e.clientX - rect.left}px`);
      el.style.setProperty("--reveal-y", `${e.clientY - rect.top}px`);
      el.dataset.reveal = "on";
    },
    [enabled],
  );

  const onPointerLeave = useCallback(
    (e: React.PointerEvent<T>) => {
      e.currentTarget.dataset.reveal = "off";
    },
    [],
  );

  return enabled ? { onPointerMove, onPointerLeave } : {};
}
