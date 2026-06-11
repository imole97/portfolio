"use client";

// Collapsible NavigationView: hamburger toggles between an expanded labelled pane
// and an icon rail. (DESIGN-SYSTEM §4.3 Chrome)

import { useEffect, useRef } from "react";
import { sectionMeta, type SectionId } from "@/lib/content";
import { useSkin } from "@/components/SkinProvider";
import { paneToggle } from "@/lib/motion/fluent";
import { useReveal } from "./useReveal";

const EXPANDED_W = 240;
const RAIL_W = 48;

interface NavigationViewProps {
  destinations: SectionId[];
  active: SectionId;
  expanded: boolean;
  onToggle: () => void;
  onSelect: (id: SectionId) => void;
}

export function NavigationView({
  destinations,
  active,
  expanded,
  onToggle,
  onSelect,
}: Readonly<NavigationViewProps>) {
  const { reducedMotion } = useSkin();
  const paneRef = useRef<HTMLElement>(null);

  useEffect(() => {
    if (paneRef.current) {
      paneToggle(paneRef.current, expanded ? EXPANDED_W : RAIL_W, { reducedMotion });
    }
  }, [expanded, reducedMotion]);

  return (
    <nav
      ref={paneRef}
      aria-label="Primary"
      className="flex shrink-0 flex-col gap-1 p-2"
      style={{ width: expanded ? EXPANDED_W : RAIL_W }}
    >
      <NavButton
        icon="☰"
        label="Collapse menu"
        onClick={onToggle}
        expanded={expanded}
        showLabel={false}
        ariaExpanded={expanded}
      />
      {destinations.map((id) => (
        <NavButton
          key={id}
          icon={sectionMeta[id].emoji}
          label={sectionMeta[id].label}
          active={id === active}
          expanded={expanded}
          showLabel={expanded}
          onClick={() => onSelect(id)}
        />
      ))}
    </nav>
  );
}

function NavButton({
  icon,
  label,
  active,
  expanded,
  showLabel,
  onClick,
  ariaExpanded,
}: Readonly<{
  icon: string;
  label: string;
  active?: boolean;
  expanded: boolean;
  showLabel: boolean;
  onClick: () => void;
  ariaExpanded?: boolean;
}>) {
  const reveal = useReveal<HTMLButtonElement>();
  return (
    <button
      {...reveal}
      onClick={onClick}
      title={expanded ? undefined : label}
      aria-label={label}
      aria-current={active ? "page" : undefined}
      aria-expanded={ariaExpanded}
      className="reveal relative flex h-10 items-center gap-3 rounded-[var(--fl-radius-sm)] px-2.5 transition-colors hover:bg-[var(--fl-subtle-hover)]"
    >
      {active && (
        <span
          aria-hidden
          className="absolute left-0 top-1/2 h-5 w-[3px] -translate-y-1/2 rounded-full"
          style={{ background: "var(--fl-accent)" }}
        />
      )}
      <span aria-hidden className="grid w-7 shrink-0 place-items-center text-lg leading-none">
        {icon}
      </span>
      {showLabel && (
        <span className="truncate text-[14px]" style={{ fontWeight: active ? 600 : 400 }}>
          {label}
        </span>
      )}
    </button>
  );
}
