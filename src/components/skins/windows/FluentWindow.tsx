"use client";

// A draggable, resizable Windows 11 window with caption buttons. (DESIGN-SYSTEM §4.3)
// Mica title bar; focus dimming + z-order come from the shared window manager.

import { useEffect, useRef, type ReactNode } from "react";
import { useSkin } from "@/components/SkinProvider";
import { entranceSlide } from "@/lib/motion/fluent";
import { cn } from "@/lib/cn";
import type { WindowManager, WindowState } from "@/lib/windowManager";
import { useReveal } from "./useReveal";

interface FluentWindowProps {
  state: WindowState;
  title: string;
  icon: string;
  manager: WindowManager;
  focused: boolean;
  viewport: { w: number; h: number };
  children: ReactNode;
}

type DragMode =
  | { kind: "move"; startX: number; startY: number; ox: number; oy: number }
  | { kind: "resize"; startX: number; startY: number; ow: number; oh: number };

export function FluentWindow({
  state,
  title,
  icon,
  manager,
  focused,
  viewport,
  children,
}: Readonly<FluentWindowProps>) {
  const { reducedMotion } = useSkin();
  const rootRef = useRef<HTMLElement>(null);
  const dragRef = useRef<DragMode | null>(null);

  // Entrance — subtle Fluent slide-up + fade.
  useEffect(() => {
    if (rootRef.current) entranceSlide(rootRef.current, { reducedMotion });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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
    if ((e.target as HTMLElement).closest("[data-caption]")) return;
    manager.focusWindow(state.id);
    dragRef.current = { kind: "move", startX: e.clientX, startY: e.clientY, ox: state.x, oy: state.y };
  }

  function startResize(e: React.PointerEvent) {
    e.stopPropagation();
    manager.focusWindow(state.id);
    dragRef.current = { kind: "resize", startX: e.clientX, startY: e.clientY, ow: state.w, oh: state.h };
  }

  // Esc closes the focused window. (DESIGN-SYSTEM §8)
  useEffect(() => {
    if (!focused) return;
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") manager.closeWindow(state.id);
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [focused, manager, state.id]);

  if (state.minimized) return null;

  return (
    <section
      ref={rootRef}
      role="dialog"
      aria-label={title}
      aria-modal={false}
      onPointerDown={() => manager.focusWindow(state.id)}
      className={cn(
        "absolute flex flex-col overflow-hidden rounded-[var(--fl-radius)]",
        "transition-[filter,opacity] duration-200",
        !focused && "brightness-[0.99] saturate-[0.97]",
      )}
      style={{
        left: state.x,
        top: state.y,
        width: state.w,
        height: state.h,
        zIndex: 100 + state.z,
        contentVisibility: "auto",
        background: "var(--fl-card)",
        color: "var(--fl-text)",
        border: "1px solid var(--fl-stroke-strong)",
        boxShadow: focused
          ? "0 16px 48px -12px rgba(0,0,0,0.45)"
          : "0 8px 24px -12px rgba(0,0,0,0.35)",
      }}
    >
      {/* Mica title bar */}
      <header
        onPointerDown={startMove}
        onDoubleClick={() => manager.zoomWindow(state.id, viewport)}
        className="relative flex h-9 shrink-0 cursor-default items-center gap-2 pl-3"
        style={{ background: "var(--fl-mica)" }}
      >
        <span aria-hidden className="text-[13px] leading-none">
          {icon}
        </span>
        <span className="text-[12px] font-medium" style={{ color: "var(--fl-text-secondary)" }}>
          {title}
        </span>

        <div data-caption className="ml-auto flex items-stretch self-stretch">
          <CaptionButton label="Minimize" glyph="‒" onClick={() => manager.toggleMinimize(state.id)} />
          <CaptionButton
            label="Maximize"
            glyph="▢"
            onClick={() => manager.zoomWindow(state.id, viewport)}
          />
          <CaptionButton label="Close" glyph="✕" danger onClick={() => manager.closeWindow(state.id)} />
        </div>
      </header>

      {/* Content */}
      <div className="min-h-0 flex-1 overflow-auto overscroll-contain p-5">{children}</div>

      {/* Resize handle (bottom-right) */}
      <button
        aria-label="Resize window"
        onPointerDown={startResize}
        className="absolute bottom-0 right-0 h-4 w-4 cursor-nwse-resize"
        style={{ touchAction: "none" }}
      >
        <span
          aria-hidden
          className="absolute bottom-1 right-1 h-2 w-2 opacity-40"
          style={{ borderRight: "2px solid currentColor", borderBottom: "2px solid currentColor" }}
        />
      </button>
    </section>
  );
}

function CaptionButton({
  label,
  glyph,
  danger,
  onClick,
}: Readonly<{ label: string; glyph: string; danger?: boolean; onClick: () => void }>) {
  const reveal = useReveal<HTMLButtonElement>();
  return (
    <button
      {...reveal}
      aria-label={label}
      onClick={onClick}
      className="reveal grid w-[46px] place-items-center text-[12px] transition-colors"
      style={{ color: "var(--fl-text-secondary)" }}
      onMouseEnter={(e) => {
        e.currentTarget.style.background = danger ? "#c42b1c" : "var(--fl-subtle-hover)";
        e.currentTarget.style.color = danger ? "#fff" : "var(--fl-text)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.background = "transparent";
        e.currentTarget.style.color = "var(--fl-text-secondary)";
      }}
    >
      {glyph}
    </button>
  );
}
