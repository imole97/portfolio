"use client";

// Material navigation rail for tablet/expanded layouts. (DESIGN-SYSTEM §4.2 tablet)

import { sectionMeta, type SectionId } from "@/lib/content";
import { useRipple } from "./useRipple";

interface NavRailProps {
  destinations: SectionId[];
  active: SectionId;
  onSelect: (id: SectionId) => void;
  fab?: React.ReactNode;
}

export function NavRail({ destinations, active, onSelect, fab }: NavRailProps) {
  return (
    <nav
      aria-label="Primary"
      className="flex w-20 flex-col items-center gap-2 py-4"
      style={{ background: "var(--md-surface)", color: "var(--md-on-surface)" }}
    >
      {fab && <div className="mb-3">{fab}</div>}
      {destinations.map((id) => (
        <RailItem
          key={id}
          id={id}
          meta={sectionMeta[id]}
          active={id === active}
          onSelect={onSelect}
        />
      ))}
    </nav>
  );
}

function RailItem({
  id,
  meta,
  active,
  onSelect,
}: {
  id: SectionId;
  meta: { label: string; emoji: string };
  active: boolean;
  onSelect: (id: SectionId) => void;
}) {
  const onRipple = useRipple<HTMLButtonElement>();
  return (
    <button
      onPointerDown={onRipple}
      onClick={() => onSelect(id)}
      aria-current={active ? "page" : undefined}
      className="md-ripple flex w-full flex-col items-center gap-1 py-1.5"
    >
      <span
        aria-hidden
        className="md-ripple grid h-8 w-14 place-items-center rounded-[var(--md-radius-full)] text-xl leading-none transition-colors"
        style={{
          background: active ? "var(--md-secondary-container)" : "transparent",
        }}
      >
        {meta.emoji}
      </span>
      <span className="text-[12px] font-medium" style={{ opacity: active ? 1 : 0.7 }}>
        {meta.label}
      </span>
    </button>
  );
}
