"use client";

// Material bottom navigation bar with a sliding active-indicator pill. (§4.2 mobile)

import { useLayoutEffect, useRef } from "react";
import { sectionMeta, type SectionId } from "@/lib/content";
import { slideIndicator } from "@/lib/motion/material";
import { useSkin } from "@/components/SkinProvider";
import { useRipple } from "./useRipple";

interface BottomNavProps {
  destinations: SectionId[];
  active: SectionId;
  onSelect: (id: SectionId) => void;
}

export function BottomNav({ destinations, active, onSelect }: Readonly<BottomNavProps>) {
  const { reducedMotion } = useSkin();
  const navRef = useRef<HTMLElement>(null);
  const pillRef = useRef<HTMLSpanElement>(null);

  useLayoutEffect(() => {
    const nav = navRef.current;
    const pill = pillRef.current;
    if (!nav || !pill) return;
    const icon = nav.querySelector<HTMLElement>(`[data-icon="${active}"]`);
    if (!icon) return;
    const iRect = icon.getBoundingClientRect();
    const nRect = nav.getBoundingClientRect();
    slideIndicator(
      pill,
      { x: iRect.left - nRect.left - (64 - iRect.width) / 2, width: 64 },
      { reducedMotion },
    );
  }, [active, reducedMotion, destinations]);

  return (
    <nav
      ref={navRef}
      aria-label="Primary"
      className="relative flex items-stretch justify-around"
      style={{
        background: "var(--md-surface-container)",
        color: "var(--md-on-surface)",
        paddingBottom: "env(safe-area-inset-bottom)",
      }}
    >
      <span
        ref={pillRef}
        aria-hidden
        className="pointer-events-none absolute top-2.5 h-8 rounded-[var(--md-radius-full)]"
        style={{ background: "var(--md-secondary-container)", width: 64, left: 0 }}
      />
      {destinations.map((id) => (
        <NavItem key={id} id={id} meta={sectionMeta[id]} active={id === active} onSelect={onSelect} />
      ))}
    </nav>
  );
}

function NavItem({
  id,
  meta,
  active,
  onSelect,
}: Readonly<{
  id: SectionId;
  meta: { label: string; emoji: string };
  active: boolean;
  onSelect: (id: SectionId) => void;
}>) {
  const onRipple = useRipple<HTMLButtonElement>();
  return (
    <button
      onPointerDown={onRipple}
      onClick={() => onSelect(id)}
      aria-current={active ? "page" : undefined}
      className="md-ripple relative z-[1] flex flex-1 flex-col items-center gap-1 pb-3 pt-2.5"
    >
      <span
        data-icon={id}
        aria-hidden
        className="grid h-8 w-16 place-items-center text-xl leading-none"
      >
        {meta.emoji}
      </span>
      <span className="text-[12px] font-medium" style={{ opacity: active ? 1 : 0.7 }}>
        {meta.label}
      </span>
    </button>
  );
}
