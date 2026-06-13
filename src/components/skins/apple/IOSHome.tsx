"use client";

// iOS home screen — status bar, two content-driven widgets, an app-icon grid of link
// launchers, a Search pill, page dots, and a frosted dock of the portfolio sections.
// Tapping an app opens it; launchers open external links. (§4.1 iPhone)

import { useEffect, useState } from "react";
import { content, sectionMeta, type SectionId } from "@/lib/content";
import { useBattery } from "@/lib/useBattery";
import { BatteryGlyph } from "@/components/BatteryGlyph";

const SECTIONS: SectionId[] = ["work", "about", "settings", "contact"];

const SECTION_ICON: Record<SectionId, string> = {
  work: "linear-gradient(160deg,#3b82f6,#1d4ed8)",
  about: "linear-gradient(160deg,#a855f7,#ec4899)",
  settings: "linear-gradient(160deg,#9ca3af,#4b5563)",
  contact: "linear-gradient(160deg,#34d399,#059669)",
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
  Email: { glyph: "✉️", bg: "linear-gradient(160deg,#60a5fa,#2563eb)", fg: "#ffffff" },
};

function buildLaunchers(): Launcher[] {
  const links = content.contact.links.map((l) => {
    const s = LAUNCHER_STYLE[l.label] ?? { glyph: "🔗", bg: "#555", fg: "#ffffff" };
    return { label: l.label === "Twitter / X" ? "X" : l.label, ...s, href: l.href };
  });
  links.push({
    label: "Résumé",
    glyph: "📄",
    bg: "linear-gradient(160deg,#fb7185,#e11d48)",
    fg: "#ffffff",
    href: content.contact.resumeHref,
  });
  return links;
}

function useClock() {
  const [now, setNow] = useState(() => new Date());
  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 15_000);
    return () => clearInterval(id);
  }, []);
  return now;
}

interface IOSHomeProps {
  onOpen: (id: SectionId) => void;
  onOpenSearch: () => void;
}

export function IOSHome({ onOpen, onOpenSearch }: Readonly<IOSHomeProps>) {
  const now = useClock();
  const battery = useBattery();
  const launchers = buildLaunchers();
  const featured = content.work[0];

  const openLink = (href: string) =>
    window.open(href, href.startsWith("http") ? "_blank" : "_self");

  const time = now.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", hour12: false });

  return (
    <div
      className="relative z-10 flex h-full w-full flex-col text-white"
      style={{ textShadow: "0 1px 12px rgba(0,0,0,0.4)" }}
    >
      {/* Status bar — real time + a real battery level (no faked signal icons). */}
      <div
        className="flex items-center justify-between px-7 text-[15px] font-semibold tabular-nums"
        style={{ paddingTop: "calc(env(safe-area-inset-top) + 10px)" }}
      >
        <span>{time}</span>
        {battery !== null && (
          <span className="flex items-center gap-1.5">
            {battery}%
            <BatteryGlyph level={battery} />
          </span>
        )}
      </div>

      <div className="mx-auto flex w-full max-w-[26rem] flex-1 flex-col px-6 pt-5">
        {/* Widgets — real portfolio content. */}
        <div className="flex gap-4">
          <WorkWidget featured={featured} onClick={() => onOpen("work")} />
          <AboutWidget onClick={() => onOpen("about")} />
        </div>

        {/* App grid — link launchers. */}
        <div className="mt-7 grid grid-cols-4 gap-x-5 gap-y-6">
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

        <div className="flex-1" />

        {/* Page dots */}
        <div className="mb-3 flex items-center justify-center gap-1.5">
          <Dot active />
          <Dot />
        </div>

        {/* Search pill */}
        <div className="mb-3 flex justify-center">
          <button
            onClick={onOpenSearch}
            aria-label="Search the portfolio"
            className="glass flex items-center gap-1.5 rounded-full px-4 py-1.5 text-[13px] font-medium"
            style={{ textShadow: "none" }}
          >
            <span aria-hidden>🔍</span>
            Search
          </button>
        </div>
      </div>

      {/* Dock — the portfolio sections as favorites. */}
      <div className="px-4 pb-[calc(env(safe-area-inset-bottom)+10px)]">
        <div
          className="glass mx-auto flex max-w-[26rem] items-center justify-around rounded-[30px] px-3 py-3"
          style={{ textShadow: "none" }}
        >
          {SECTIONS.map((id) => (
            <DockIcon
              key={id}
              label={sectionMeta[id].label}
              glyph={sectionMeta[id].emoji}
              bg={SECTION_ICON[id]}
              fg="#ffffff"
              onClick={() => onOpen(id)}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

function WorkWidget({ featured, onClick }: Readonly<{ featured: (typeof content.work)[number]; onClick: () => void }>) {
  return (
    <button
      onClick={onClick}
      className="relative h-36 flex-1 overflow-hidden rounded-[20px] text-left shadow-xl"
      style={{ textShadow: "none" }}
    >
      <div
        className="absolute inset-0"
        style={{ background: `linear-gradient(135deg,hsl(${featured.hue} 70% 55%),hsl(${(featured.hue + 40) % 360} 65% 45%))` }}
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
      <p className="absolute left-3 top-3 text-[10px] font-semibold uppercase tracking-wider text-white/90">
        Selected Work
      </p>
      <div className="absolute inset-x-3 bottom-3 text-white">
        <p className="line-clamp-2 text-[13px] font-semibold leading-tight">{featured.title}</p>
        <p className="mt-0.5 text-[11px] opacity-85">{featured.year}</p>
      </div>
    </button>
  );
}

function AboutWidget({ onClick }: Readonly<{ onClick: () => void }>) {
  return (
    <button
      onClick={onClick}
      className="flex h-36 flex-1 flex-col justify-between rounded-[20px] p-3.5 text-left text-white shadow-xl"
      style={{ background: "linear-gradient(160deg,#7c3aed,#db2777)", textShadow: "none" }}
    >
      <span className="grid h-10 w-10 place-items-center rounded-full bg-white/25 text-[14px] font-bold">
        {content.about.initials}
      </span>
      <span>
        <p className="text-[13px] font-semibold leading-tight">{content.hero.name}</p>
        <p className="mt-0.5 line-clamp-2 text-[10px] opacity-85">{content.hero.role}</p>
      </span>
    </button>
  );
}

function AppIcon({
  label,
  glyph,
  bg,
  fg,
  onClick,
}: Readonly<{ label: string; glyph: string; bg: string; fg: string; onClick: () => void }>) {
  const isLetter = /^[A-Za-z]/.test(glyph);
  return (
    <button onClick={onClick} className="flex flex-col items-center gap-1.5 transition-transform active:scale-95">
      <span
        aria-hidden
        className="grid h-14 w-14 place-items-center rounded-[0.95rem] shadow-lg"
        style={{ background: bg, color: fg, fontSize: isLetter ? 22 : 26, fontWeight: isLetter ? 700 : 400, lineHeight: 1, textShadow: "none" }}
      >
        {glyph}
      </span>
      <span className="max-w-[4.5rem] truncate text-[11px] font-medium">{label}</span>
    </button>
  );
}

function DockIcon({
  label,
  glyph,
  bg,
  fg,
  onClick,
}: Readonly<{ label: string; glyph: string; bg: string; fg: string; onClick: () => void }>) {
  const isLetter = /^[A-Za-z]/.test(glyph);
  return (
    <button
      onClick={onClick}
      aria-label={label}
      className="grid h-14 w-14 place-items-center rounded-[0.95rem] shadow transition-transform active:scale-90"
      style={{ background: bg, color: fg, fontSize: isLetter ? 22 : 26, fontWeight: isLetter ? 700 : 400, lineHeight: 1, textShadow: "none" }}
    >
      {glyph}
    </button>
  );
}

function Dot({ active }: Readonly<{ active?: boolean }>) {
  return <span className={`h-1.5 w-1.5 rounded-full ${active ? "bg-white" : "bg-white/40"}`} />;
}
