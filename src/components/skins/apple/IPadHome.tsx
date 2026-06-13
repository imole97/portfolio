"use client";

// iPadOS home screen — status bar, a widget row built from real portfolio content, an
// app-icon grid (sections + link launchers), page dots, a Spotlight pill, and a frosted
// dock. Tapping an app opens the portfolio app; launchers open external links. (§4.1 iPad)

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

interface IPadHomeProps {
  onOpen: (id: SectionId) => void;
  onOpenSearch: () => void;
}

export function IPadHome({ onOpen, onOpenSearch }: Readonly<IPadHomeProps>) {
  const now = useClock();
  const battery = useBattery();
  const launchers = buildLaunchers();
  const featured = content.work[0];

  const openLink = (href: string) =>
    window.open(href, href.startsWith("http") ? "_blank" : "_self");

  const time = now.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", hour12: false });
  const date = now.toLocaleDateString([], { weekday: "short", day: "numeric", month: "short" });

  return (
    <div
      className="relative z-10 flex h-full w-full flex-col text-white"
      style={{ textShadow: "0 1px 12px rgba(0,0,0,0.4)" }}
    >
      {/* Status bar — real time/date + a real battery level (no faked signal icons). */}
      <div className="flex items-center justify-between px-6 pt-3 text-[14px] font-medium">
        <span className="tabular-nums">
          {time} <span className="opacity-80">{date}</span>
        </span>
        {battery !== null && (
          <span className="flex items-center gap-1.5 tabular-nums">
            {battery}%
            <BatteryGlyph level={battery} />
          </span>
        )}
      </div>

      <div className="mx-auto flex w-full max-w-4xl flex-1 flex-col px-8 pt-6">
        {/* Widgets — real content, iPad widget style. */}
        <div className="flex flex-wrap gap-5">
          <ClockWidget now={now} />
          <WorkWidget featured={featured} onClick={() => onOpen("work")} />
          <AboutWidget onClick={() => onOpen("about")} />
        </div>

        {/* App grid */}
        <div className="mt-10 grid grid-cols-6 gap-x-6 gap-y-7">
          {SECTIONS.map((id) => (
            <AppIcon
              key={id}
              label={sectionMeta[id].label}
              glyph={sectionMeta[id].emoji}
              bg={SECTION_ICON[id]}
              fg="#ffffff"
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

        <div className="flex-1" />

        {/* Page dots */}
        <div className="mb-4 flex items-center justify-center gap-2">
          <Dot active />
          <Dot />
          <Dot />
        </div>
      </div>

      {/* Spotlight pill + dock */}
      <div className="mb-4 flex flex-col items-center gap-3">
        <button
          onClick={onOpenSearch}
          aria-label="Search the portfolio"
          className="glass flex items-center gap-2 rounded-full px-4 py-1.5 text-[13px] font-medium"
          style={{ textShadow: "none" }}
        >
          <span aria-hidden>🔍</span>
          Search
        </button>
        <div
          className="glass flex items-center gap-3 rounded-[26px] px-4 py-2.5"
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
          <span aria-hidden className="mx-1 h-10 w-px bg-white/30" />
          {launchers.slice(0, 3).map((l) => (
            <DockIcon
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
  );
}

function ClockWidget({ now }: Readonly<{ now: Date }>) {
  const m = now.getMinutes();
  const h = now.getHours() % 12;
  const minDeg = m * 6;
  const hourDeg = h * 30 + m * 0.5;
  return (
    <div className="grid h-40 w-40 place-items-center rounded-[22px] bg-white shadow-xl" style={{ textShadow: "none" }}>
      <div className="relative h-28 w-28 rounded-full border border-black/10">
        {[0, 90, 180, 270].map((d) => (
          <span
            key={d}
            aria-hidden
            className="absolute left-1/2 top-1/2 h-1 w-1 rounded-full bg-black/30"
            style={{ transform: `rotate(${d}deg) translateY(-52px) translate(-50%,-50%)` }}
          />
        ))}
        <Hand deg={hourDeg} len={34} w={3} />
        <Hand deg={minDeg} len={46} w={2} />
        <span className="absolute left-1/2 top-1/2 h-2.5 w-2.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-orange-500" />
      </div>
    </div>
  );
}

function Hand({ deg, len, w }: Readonly<{ deg: number; len: number; w: number }>) {
  return (
    <span
      aria-hidden
      className="absolute rounded-full bg-black"
      style={{
        left: "50%",
        bottom: "50%",
        width: w,
        height: len,
        transformOrigin: "bottom center",
        transform: `translateX(-50%) rotate(${deg}deg)`,
      }}
    />
  );
}

function WorkWidget({ featured, onClick }: Readonly<{ featured: (typeof content.work)[number]; onClick: () => void }>) {
  return (
    <button
      onClick={onClick}
      className="relative h-40 w-[21rem] overflow-hidden rounded-[22px] text-left shadow-xl"
      style={{ textShadow: "none" }}
    >
      <div
        className="absolute inset-0"
        style={{ background: `linear-gradient(135deg,hsl(${featured.hue} 70% 55%),hsl(${(featured.hue + 40) % 360} 65% 45%))` }}
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
      <p className="absolute left-4 top-4 text-[11px] font-semibold uppercase tracking-wider text-white/90">
        Selected Work
      </p>
      <div className="absolute inset-x-4 bottom-4 text-white">
        <p className="line-clamp-2 text-[15px] font-semibold leading-tight">{featured.title}</p>
        <p className="mt-0.5 text-[12px] opacity-85">
          {featured.year} · {featured.tags[0]}
        </p>
      </div>
    </button>
  );
}

function AboutWidget({ onClick }: Readonly<{ onClick: () => void }>) {
  return (
    <button
      onClick={onClick}
      className="flex h-40 w-40 flex-col justify-between rounded-[22px] p-4 text-left text-white shadow-xl"
      style={{ background: "linear-gradient(160deg,#7c3aed,#db2777)", textShadow: "none" }}
    >
      <span className="grid h-11 w-11 place-items-center rounded-full bg-white/25 text-[15px] font-bold">
        {content.about.initials}
      </span>
      <span>
        <p className="text-[14px] font-semibold leading-tight">{content.hero.name}</p>
        <p className="mt-0.5 line-clamp-2 text-[11px] opacity-85">{content.hero.role}</p>
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
        className="grid h-16 w-16 place-items-center rounded-[1.05rem] shadow-lg"
        style={{ background: bg, color: fg, fontSize: isLetter ? 26 : 30, fontWeight: isLetter ? 700 : 400, lineHeight: 1, textShadow: "none" }}
      >
        {glyph}
      </span>
      <span className="max-w-[5rem] truncate text-[12px] font-medium">{label}</span>
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
      className="grid h-12 w-12 place-items-center rounded-[0.85rem] shadow transition-transform active:scale-90"
      style={{ background: bg, color: fg, fontSize: isLetter ? 20 : 24, fontWeight: isLetter ? 700 : 400, lineHeight: 1, textShadow: "none" }}
    >
      {glyph}
    </button>
  );
}

function Dot({ active }: Readonly<{ active?: boolean }>) {
  return <span className={`h-2 w-2 rounded-full ${active ? "bg-white" : "bg-white/40"}`} />;
}
