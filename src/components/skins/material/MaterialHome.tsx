"use client";

// Android home-screen launcher — a name/role header, an app-icon grid (sections + link
// launchers), and a working search dock. Fake phone chrome (clock, signal, page dots) is
// intentionally omitted; the only status shown is a *real* battery level when the device
// exposes one (Battery Status API). (§4.2)

import { useEffect, useRef } from "react";
import { content, sectionMeta, type SectionId } from "@/lib/content";
import { useSkin } from "@/components/SkinProvider";
import { homeReveal } from "@/lib/motion/material";
import { useBattery } from "@/lib/useBattery";
import { BatteryGlyph } from "@/components/BatteryGlyph";
import { useRipple } from "./useRipple";

const SECTIONS: SectionId[] = ["work", "about", "settings", "contact"];

// Section icons tint with the dynamic-color roles so the home screen re-themes with
// the wallpaper — the system apps. Brand launchers keep their real colors.
const SECTION_TINT: Record<SectionId, { bg: string; fg: string }> = {
  work: { bg: "var(--md-primary-container)", fg: "var(--md-on-primary-container)" },
  about: { bg: "var(--md-tertiary-container)", fg: "var(--md-on-tertiary-container)" },
  settings: { bg: "var(--md-secondary-container)", fg: "var(--md-on-secondary-container)" },
  contact: { bg: "var(--md-surface-variant)", fg: "var(--md-on-surface-variant)" },
};

interface Launcher {
  label: string;
  glyph: string;
  bg: string;
  fg: string;
  href: string;
}

const LAUNCHER_STYLE: Record<string, { glyph: string; bg: string; fg: string }> = {
  GitHub: { glyph: "🐙", bg: "#1f2328", fg: "#ffffff" },
  LinkedIn: { glyph: "in", bg: "#0a66c2", fg: "#ffffff" },
  "Twitter / X": { glyph: "𝕏", bg: "#000000", fg: "#ffffff" },
};

function buildLaunchers(): Launcher[] {
  const links: Launcher[] = content.contact.links
    .filter((l) => l.label !== "Email")
    .map((l) => {
      const s = LAUNCHER_STYLE[l.label] ?? { glyph: "🔗", bg: "var(--md-primary)", fg: "var(--md-on-primary)" };
      return { label: l.label === "Twitter / X" ? "X" : l.label, ...s, href: l.href };
    });
  links.push({
    label: "Résumé",
    glyph: "📄",
    bg: "var(--md-primary)",
    fg: "var(--md-on-primary)",
    href: content.contact.resumeHref,
  });
  return links;
}

interface MaterialHomeProps {
  onOpen: (id: SectionId) => void;
  onOpenSearch: () => void;
}

export function MaterialHome({ onOpen, onOpenSearch }: Readonly<MaterialHomeProps>) {
  const { reducedMotion } = useSkin();
  const battery = useBattery();
  const gridRef = useRef<HTMLDivElement>(null);
  const launchers = buildLaunchers();

  useEffect(() => {
    const grid = gridRef.current;
    if (grid) homeReveal(Array.from(grid.querySelectorAll<HTMLElement>("[data-icon]")), { reducedMotion });
  }, [reducedMotion]);

  const openLink = (href: string) =>
    window.open(href, href.startsWith("http") ? "_blank" : "_self");

  return (
    <div
      className="relative z-10 flex h-full w-full flex-col text-white"
      style={{ textShadow: "0 1px 12px rgba(0,0,0,0.4)" }}
    >
      {/* Status row — reserves space; shows only a real battery level when available. */}
      <div className="flex h-7 items-center justify-end px-5 pt-2 text-[13px] font-medium tabular-nums">
        {battery !== null && (
          <span className="flex items-center gap-1.5">
            <span>{battery}%</span>
            <BatteryGlyph level={battery} />
          </span>
        )}
      </div>

      {/* Identity widget — name + role in the At-a-Glance position. */}
      <div className="px-6 pt-6">
        <p className="text-[26px] font-semibold leading-tight">{content.hero.name}</p>
        <p className="mt-1 text-[14px] opacity-90">{content.hero.role}</p>
      </div>

      {/* Apps live in the lower portion, above the dock. */}
      <div className="flex flex-1 flex-col justify-end pb-5">
        <div ref={gridRef} className="mx-auto w-full max-w-md px-5">
          <div className="grid grid-cols-4 gap-x-3 gap-y-5">
            {SECTIONS.map((id) => (
              <AppIcon
                key={id}
                label={sectionMeta[id].label}
                glyph={sectionMeta[id].emoji}
                bg={SECTION_TINT[id].bg}
                fg={SECTION_TINT[id].fg}
                onClick={() => onOpen(id)}
              />
            ))}
            {launchers.map((l) => (
              <AppIcon
                key={l.label}
                label={l.label}
                glyph={l.glyph}
                bg={l.bg}
                fg={l.fg}
                onClick={() => openLink(l.href)}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Dock — a working search entry point. */}
      <div className="mx-auto w-full max-w-md px-5 pb-3">
        <button
          onClick={onOpenSearch}
          aria-label="Search the portfolio"
          className="flex w-full items-center gap-3 rounded-[var(--md-radius-full)] px-5 py-3.5 shadow-lg"
          style={{ background: "var(--md-surface)", color: "var(--md-on-surface)", textShadow: "none" }}
        >
          <SearchIcon />
          <span className="text-[15px]" style={{ color: "var(--md-on-surface-variant)" }}>
            Search the portfolio
          </span>
        </button>
      </div>

      {/* Gesture pill */}
      <div className="flex justify-center pb-2">
        <span className="h-1 w-32 rounded-full bg-white/70" />
      </div>
    </div>
  );
}

function AppIcon({
  label,
  glyph,
  bg,
  fg,
  onClick,
}: Readonly<{ label: string; glyph: string; bg: string; fg: string; onClick: () => void }>) {
  const onRipple = useRipple<HTMLButtonElement>();
  const isLetter = /^[A-Za-z]/.test(glyph);
  return (
    <button
      data-icon
      onPointerDown={onRipple}
      onClick={onClick}
      className="md-ripple flex flex-col items-center gap-1.5"
    >
      <span
        aria-hidden
        className="grid h-14 w-14 place-items-center rounded-[1.15rem] shadow-md"
        style={{
          background: bg,
          color: fg,
          fontSize: isLetter ? 22 : 26,
          fontWeight: isLetter ? 700 : 400,
          lineHeight: 1,
        }}
      >
        {glyph}
      </span>
      <span className="max-w-[4.5rem] truncate text-[12px] font-medium">{label}</span>
    </button>
  );
}

function SearchIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden style={{ color: "var(--md-on-surface-variant)" }}>
      <circle cx="11" cy="11" r="7" stroke="currentColor" strokeWidth="2" />
      <path d="m20 20-3.2-3.2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}
