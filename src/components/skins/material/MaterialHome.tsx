"use client";

// Android home-screen launcher — status bar, At-a-Glance widget, an app-icon grid
// (sections + link launchers), page dots, and a Google-style search pill. Blends the
// most recognizable Pixel + One UI cues into one cohesive home screen. (§4.2)

import { useEffect, useRef, useState } from "react";
import { content, sectionMeta, type SectionId } from "@/lib/content";
import { useSkin } from "@/components/SkinProvider";
import { homeReveal } from "@/lib/motion/material";
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

function useClock() {
  // The skin is client-only (loaded with ssr: false), so seeding from the initializer
  // is hydration-safe; the interval keeps it ticking.
  const [now, setNow] = useState<Date>(() => new Date());
  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 30_000);
    return () => clearInterval(id);
  }, []);
  return now;
}

interface MaterialHomeProps {
  onOpen: (id: SectionId) => void;
}

export function MaterialHome({ onOpen }: Readonly<MaterialHomeProps>) {
  const { reducedMotion } = useSkin();
  const now = useClock();
  const gridRef = useRef<HTMLDivElement>(null);
  const launchers = buildLaunchers();

  useEffect(() => {
    const grid = gridRef.current;
    if (grid) homeReveal(Array.from(grid.querySelectorAll<HTMLElement>("[data-icon]")), { reducedMotion });
  }, [reducedMotion]);

  const time = now.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", hour12: false });
  const day = now.toLocaleDateString([], { weekday: "long" });
  const date = now.toLocaleDateString([], { month: "short", day: "numeric" });

  const openLink = (href: string) =>
    window.open(href, href.startsWith("http") ? "_blank" : "_self");

  return (
    <div
      className="relative z-10 flex h-full w-full flex-col text-white"
      style={{ textShadow: "0 1px 12px rgba(0,0,0,0.4)" }}
    >
      {/* Status bar */}
      <div className="flex items-center justify-between px-5 pt-3 text-[13px] font-medium tabular-nums">
        <span>{time}</span>
        <span className="flex items-center gap-1.5">
          <span className="text-[11px] font-semibold">5G</span>
          <WifiIcon />
          <BatteryIcon />
        </span>
      </div>

      {/* At a Glance — date + a light weather line, top-left like Pixel. */}
      <div className="px-6 pt-6">
        <p className="text-[26px] font-medium leading-tight">
          {day}
          <span className="opacity-80">, {date}</span>
        </p>
        <p className="mt-1 text-[14px] opacity-90">🌤️ {content.hero.role}</p>
      </div>

      {/* Apps live in the lower portion, above the dock. */}
      <div className="flex flex-1 flex-col justify-end pb-4">
        <div ref={gridRef} className="mx-auto w-full max-w-md px-5">
          {/* Sections */}
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
            {/* Launchers */}
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

          {/* Page indicator */}
          <div className="mt-6 flex items-center justify-center gap-1.5">
            <span className="h-1.5 w-1.5 rounded-full bg-white" />
            <span className="h-1.5 w-1.5 rounded-full bg-white/45" />
            <span className="h-1.5 w-1.5 rounded-full bg-white/45" />
          </div>
        </div>
      </div>

      {/* Dock — Google-style search pill (presentational). */}
      <div className="mx-auto w-full max-w-md px-5 pb-3">
        <div
          role="search"
          aria-label="Search"
          className="flex items-center gap-3 rounded-[var(--md-radius-full)] px-5 py-3.5 shadow-lg"
          style={{ background: "var(--md-surface)", color: "var(--md-on-surface)", textShadow: "none" }}
        >
          <GoogleG />
          <span className="flex-1 text-[15px]" style={{ color: "var(--md-on-surface-variant)" }}>
            Search
          </span>
          <span aria-hidden className="text-[17px] opacity-80">🎤</span>
          <span aria-hidden className="text-[17px] opacity-80">📷</span>
        </div>
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

function WifiIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M12 18.5a2 2 0 1 0 0 4 2 2 0 0 0 0-4Zm0-5.2c1.9 0 3.6.7 4.9 2l-1.7 1.7a4.5 4.5 0 0 0-6.4 0L7.1 15.3a6.9 6.9 0 0 1 4.9-2Zm0-4.8c3.2 0 6.1 1.3 8.2 3.4l-1.7 1.7a9.2 9.2 0 0 0-13 0L3.8 11.9A11.6 11.6 0 0 1 12 8.5Z" />
    </svg>
  );
}

function BatteryIcon() {
  return (
    <svg width="22" height="14" viewBox="0 0 26 14" fill="none" aria-hidden>
      <rect x="1" y="1.5" width="22" height="11" rx="3" stroke="currentColor" strokeWidth="1.4" />
      <rect x="3" y="3.5" width="16" height="7" rx="1.5" fill="currentColor" />
      <rect x="24" y="5" width="2" height="4" rx="1" fill="currentColor" />
    </svg>
  );
}

function GoogleG() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden>
      <path fill="#4285F4" d="M23.5 12.3c0-.8-.1-1.6-.2-2.3H12v4.5h6.5a5.6 5.6 0 0 1-2.4 3.6v3h3.9c2.3-2.1 3.5-5.2 3.5-8.8Z" />
      <path fill="#34A853" d="M12 24c3.2 0 5.9-1.1 7.9-2.9l-3.9-3c-1 .7-2.4 1.1-4 1.1-3 0-5.6-2-6.5-4.8H1.5v3.1A12 12 0 0 0 12 24Z" />
      <path fill="#FBBC05" d="M5.5 14.4a7.2 7.2 0 0 1 0-4.8V6.5H1.5a12 12 0 0 0 0 10.9l4-3Z" />
      <path fill="#EA4335" d="M12 4.8c1.7 0 3.3.6 4.5 1.8l3.4-3.4A12 12 0 0 0 1.5 6.5l4 3.1C6.4 6.8 9 4.8 12 4.8Z" />
    </svg>
  );
}
