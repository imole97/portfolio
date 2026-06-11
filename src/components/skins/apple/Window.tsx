"use client";

// A draggable, resizable liquid-glass window with traffic-light controls.
// (DESIGN-SYSTEM §4.1 macOS) Focus dimming + z-order come from the manager.

import { useEffect, useRef, type ReactNode } from "react";
import { useSkin } from "@/components/SkinProvider";
import { liquidSettle, windowExit } from "@/lib/motion/apple";
import { cn } from "@/lib/cn";
import type { SectionId } from "@/lib/content";
import type { WindowManager, WindowState } from "./windowManager";

interface WindowProps {
  state: WindowState;
  title: string;
  manager: WindowManager;
  focused: boolean;
  viewport: { w: number; h: number };
  children: ReactNode;
}

type DragMode =
  | { kind: "move"; startX: number; startY: number; ox: number; oy: number }
  | { kind: "resize"; startX: number; startY: number; ow: number; oh: number };

export function Window({
  state,
  title,
  manager,
  focused,
  viewport,
  children,
}: WindowProps) {
  const { reducedMotion } = useSkin();
  const rootRef = useRef<HTMLElement>(null);
  const dragRef = useRef<DragMode | null>(null);

  // Entrance — liquid settle on mount.
  useEffect(() => {
    if (rootRef.current) liquidSettle(rootRef.current, { reducedMotion, from: "center" });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Pointer drag/resize handlers.
  useEffect(() => {
    function onMove(e: PointerEvent) {
      const d = dragRef.current;
      if (!d) return;
      if (d.kind === "move") {
        manager.setBounds(state.id, {
          x: d.ox + (e.clientX - d.startX),
          y: d.oy + (e.clientY - d.startY),
        });
      } else {
        manager.setBounds(state.id, {
          w: d.ow + (e.clientX - d.startX),
          h: d.oh + (e.clientY - d.startY),
        });
      }
    }
    function onUp() {
      dragRef.current = null;
    }
    window.addEventListener("pointermove", onMove);
    window.addEventListener("pointerup", onUp);
    return () => {
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerup", onUp);
    };
  }, [manager, state.id]);

  function startMove(e: React.PointerEvent) {
    if ((e.target as HTMLElement).closest("[data-traffic]")) return;
    manager.focusWindow(state.id);
    dragRef.current = {
      kind: "move",
      startX: e.clientX,
      startY: e.clientY,
      ox: state.x,
      oy: state.y,
    };
  }

  function startResize(e: React.PointerEvent) {
    e.stopPropagation();
    manager.focusWindow(state.id);
    dragRef.current = {
      kind: "resize",
      startX: e.clientX,
      startY: e.clientY,
      ow: state.w,
      oh: state.h,
    };
  }

  function close() {
    if (rootRef.current) {
      windowExit(rootRef.current, { reducedMotion }).then(() => manager.closeWindow(state.id));
    } else {
      manager.closeWindow(state.id);
    }
  }

  // Esc closes the focused window. (DESIGN-SYSTEM §8)
  useEffect(() => {
    if (!focused) return;
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") close();
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [focused]);

  if (state.minimized) return null;

  return (
    <section
      ref={rootRef}
      role="dialog"
      aria-label={title}
      aria-modal={false}
      onPointerDown={() => manager.focusWindow(state.id)}
      className={cn(
        "glass glass-specular absolute flex flex-col overflow-hidden rounded-[var(--radius-card)]",
        "text-[var(--text-primary)] transition-[filter,opacity] duration-200",
        !focused && "brightness-[0.97] saturate-[0.9]",
      )}
      style={{
        left: state.x,
        top: state.y,
        width: state.w,
        height: state.h,
        zIndex: 100 + state.z,
        contentVisibility: "auto",
      }}
    >
      {/* Title bar */}
      <header
        onPointerDown={startMove}
        onDoubleClick={() => manager.zoomWindow(state.id, viewport)}
        className="relative flex h-10 shrink-0 cursor-grab items-center gap-2 px-3 active:cursor-grabbing"
        style={{ borderBottom: "1px solid var(--separator)" }}
      >
        <div data-traffic className="flex items-center gap-2">
          <TrafficLight color="#ff5f57" label="Close window" onClick={close} glyph="×" />
          <TrafficLight
            color="#febc2e"
            label="Minimize window"
            onClick={() => manager.toggleMinimize(state.id)}
            glyph="–"
          />
          <TrafficLight
            color="#28c840"
            label="Zoom window"
            onClick={() => manager.zoomWindow(state.id, viewport)}
            glyph="+"
          />
        </div>
        <span className="pointer-events-none absolute left-1/2 -translate-x-1/2 text-[13px] font-semibold opacity-80">
          {title}
        </span>
        {/* Leading-edge shimmer target for the liquid-settle entrance. */}
        <span
          data-shimmer
          aria-hidden
          className="pointer-events-none absolute inset-y-0 left-0 w-1/3"
          style={{
            background:
              "linear-gradient(90deg, transparent, rgba(255,255,255,0.45), transparent)",
            opacity: 0,
          }}
        />
      </header>

      {/* Content */}
      <div className="min-h-0 flex-1 overflow-auto overscroll-contain p-5">{children}</div>

      {/* Resize handle (bottom-right) */}
      <button
        aria-label="Resize window"
        onPointerDown={startResize}
        className="absolute bottom-0 right-0 h-5 w-5 cursor-nwse-resize"
        style={{ touchAction: "none" }}
      >
        <span
          aria-hidden
          className="absolute bottom-1 right-1 h-2.5 w-2.5 rounded-[2px] opacity-40"
          style={{ borderRight: "2px solid currentColor", borderBottom: "2px solid currentColor" }}
        />
      </button>
    </section>
  );
}

function TrafficLight({
  color,
  label,
  onClick,
  glyph,
}: {
  color: string;
  label: string;
  onClick: () => void;
  glyph: string;
}) {
  return (
    <button
      aria-label={label}
      onClick={onClick}
      className="group grid h-3.5 w-3.5 place-items-center rounded-full text-[9px] font-bold leading-none text-black/50"
      style={{ background: color }}
    >
      <span className="opacity-0 transition-opacity group-hover:opacity-100">{glyph}</span>
    </button>
  );
}

export type { SectionId };
