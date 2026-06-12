"use client";

// Minimal window manager for the macOS desktop metaphor. (DESIGN-SYSTEM §4.1 macOS)
// Tracks which section-windows are open, their bounds, z-order, and focus.

import { useCallback, useRef, useState } from "react";
import type { SectionId } from "@/lib/content";

export interface WindowState {
  id: SectionId;
  open: boolean;
  minimized: boolean;
  x: number;
  y: number;
  w: number;
  h: number;
  z: number;
}

export interface Bounds {
  x: number;
  y: number;
  w: number;
  h: number;
}

const MIN_W = 320;
const MIN_H = 240;

// Default opening bounds per section, cascaded so windows don't fully overlap.
const DEFAULTS: Record<SectionId, Bounds> = {
  work: { x: 120, y: 90, w: 760, h: 540 },
  about: { x: 200, y: 140, w: 600, h: 460 },
  settings: { x: 260, y: 110, w: 600, h: 480 },
  contact: { x: 320, y: 170, w: 520, h: 420 },
};

export interface WindowManager {
  windows: WindowState[];
  focusedId: SectionId | null;
  openWindow: (id: SectionId) => void;
  closeWindow: (id: SectionId) => void;
  focusWindow: (id: SectionId) => void;
  toggleMinimize: (id: SectionId) => void;
  zoomWindow: (id: SectionId, viewport: { w: number; h: number }) => void;
  setBounds: (id: SectionId, bounds: Partial<Bounds>) => void;
  isOpen: (id: SectionId) => boolean;
}

export function useWindowManager(initial: SectionId[] = ["work"]): WindowManager {
  // Next z to assign; mutated only inside callbacks, never read during render.
  const zCounter = useRef(10 + initial.length);

  const [windows, setWindows] = useState<WindowState[]>(() =>
    initial.map((id, i) => ({
      id,
      open: true,
      minimized: false,
      ...clampToDefaults(id, i),
      z: 11 + i,
    })),
  );

  const [focusedId, setFocusedId] = useState<SectionId | null>(
    initial.length ? initial[initial.length - 1] : null,
  );

  const focusWindow = useCallback((id: SectionId) => {
    setFocusedId(id);
    setWindows((ws) =>
      ws.map((w) => (w.id === id ? { ...w, z: ++zCounter.current, minimized: false } : w)),
    );
  }, []);

  const openWindow = useCallback(
    (id: SectionId) => {
      setWindows((ws) => {
        const existing = ws.find((w) => w.id === id);
        if (existing) {
          return ws.map((w) =>
            w.id === id ? { ...w, open: true, minimized: false, z: ++zCounter.current } : w,
          );
        }
        const cascade = ws.length;
        return [
          ...ws,
          {
            id,
            open: true,
            minimized: false,
            ...clampToDefaults(id, cascade),
            z: ++zCounter.current,
          },
        ];
      });
      setFocusedId(id);
    },
    [],
  );

  const closeWindow = useCallback(
    (id: SectionId) => {
      setWindows((ws) => ws.filter((w) => w.id !== id));
      setFocusedId((prev) => (prev === id ? null : prev));
    },
    [],
  );

  const toggleMinimize = useCallback((id: SectionId) => {
    setWindows((ws) =>
      ws.map((w) => (w.id === id ? { ...w, minimized: !w.minimized } : w)),
    );
  }, []);

  const zoomWindow = useCallback(
    (id: SectionId, viewport: { w: number; h: number }) => {
      setWindows((ws) =>
        ws.map((w) => {
          if (w.id !== id) return w;
          const isZoomed = w.w >= viewport.w - 48 && w.h >= viewport.h - 96;
          if (isZoomed) {
            return { ...w, ...clampToDefaults(id, 0), z: ++zCounter.current };
          }
          return {
            ...w,
            x: 16,
            y: 44,
            w: viewport.w - 32,
            h: viewport.h - 140,
            z: ++zCounter.current,
          };
        }),
      );
      setFocusedId(id);
    },
    [],
  );

  const setBounds = useCallback((id: SectionId, bounds: Partial<Bounds>) => {
    setWindows((ws) =>
      ws.map((w) => {
        if (w.id !== id) return w;
        return {
          ...w,
          x: bounds.x ?? w.x,
          y: Math.max(28, bounds.y ?? w.y),
          w: Math.max(MIN_W, bounds.w ?? w.w),
          h: Math.max(MIN_H, bounds.h ?? w.h),
        };
      }),
    );
  }, []);

  const isOpen = useCallback(
    (id: SectionId) => windows.some((w) => w.id === id && w.open),
    [windows],
  );

  return {
    windows,
    focusedId,
    openWindow,
    closeWindow,
    focusWindow,
    toggleMinimize,
    zoomWindow,
    setBounds,
    isOpen,
  };
}

function clampToDefaults(id: SectionId, cascade: number): Bounds {
  const base = DEFAULTS[id];
  const offset = (cascade % 5) * 28;
  return { ...base, x: base.x + offset, y: base.y + offset };
}

export const WINDOW_MIN = { w: MIN_W, h: MIN_H };
