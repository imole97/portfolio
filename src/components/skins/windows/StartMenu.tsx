"use client";

// Windows 11 Start menu — search, pinned grid (sections + launchers), recommended,
// and an account + power footer. (DESIGN-SYSTEM §4.3)

import { useEffect, useMemo, useRef, useState } from "react";
import { content, sectionMeta, type SectionId } from "@/lib/content";
import { useSkin } from "@/components/SkinProvider";
import { entranceSlide } from "@/lib/motion/fluent";
import { useReveal } from "./useReveal";

interface Launcher {
  label: string;
  icon: string;
  href: string;
}

interface SearchResult {
  id: string;
  label: string;
  hint: string;
  section: SectionId;
}

const LAUNCHER_ICONS: Record<string, string> = {
  Email: "✉️",
  GitHub: "🐙",
  LinkedIn: "💼",
  "Twitter / X": "𝕏",
};

function buildLaunchers(): Launcher[] {
  const links = content.contact.links.map((l) => ({
    label: l.label === "Twitter / X" ? "X" : l.label,
    icon: LAUNCHER_ICONS[l.label] ?? "🔗",
    href: l.href,
  }));
  return [...links, { label: "Résumé", icon: "📄", href: content.contact.resumeHref }];
}

function buildSearchIndex(): SearchResult[] {
  const items: SearchResult[] = [];
  (Object.keys(sectionMeta) as SectionId[]).forEach((id) =>
    items.push({ id: `s-${id}`, label: sectionMeta[id].title, hint: "Section", section: id }),
  );
  content.work.forEach((w) =>
    items.push({ id: `w-${w.slug}`, label: w.title, hint: "Case study", section: "work" }),
  );
  return items;
}

interface StartMenuProps {
  onClose: () => void;
  onOpenSection: (id: SectionId) => void;
}

export function StartMenu({ onClose, onOpenSection }: Readonly<StartMenuProps>) {
  const { reducedMotion } = useSkin();
  const launchers = useMemo(() => buildLaunchers(), []);
  const index = useMemo(() => buildSearchIndex(), []);
  const [query, setQuery] = useState("");
  const panelRef = useRef<HTMLDivElement>(null);

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return [];
    return index.filter((r) => r.label.toLowerCase().includes(q)).slice(0, 7);
  }, [index, query]);

  useEffect(() => {
    if (panelRef.current) entranceSlide(panelRef.current, { reducedMotion });
  }, [reducedMotion]);

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  function openSection(id: SectionId) {
    onOpenSection(id);
    onClose();
  }

  return (
    <div className="absolute inset-0 z-[400] flex items-end justify-center pb-16">
      {/* Click-away */}
      <button aria-label="Close Start" className="absolute inset-0 cursor-default" onClick={onClose} />

      <div
        ref={panelRef}
        role="dialog"
        aria-label="Start menu"
        className="acrylic relative flex max-h-[78vh] w-[640px] max-w-[94vw] flex-col gap-4 overflow-hidden rounded-[12px] p-6 shadow-2xl"
        style={{ color: "var(--fl-text)" }}
      >
        {/* Search */}
        <div
          className="flex items-center gap-2 rounded-[var(--fl-radius-sm)] px-3 py-2"
          style={{ background: "var(--fl-card)", border: "1px solid var(--fl-stroke)" }}
        >
          <span aria-hidden className="opacity-60">🔍</span>
          <input
            autoFocus
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search for apps, settings, and documents"
            aria-label="Search"
            className="w-full bg-transparent text-[14px] outline-none placeholder:text-[var(--fl-text-secondary)]"
          />
        </div>

        {results.length > 0 ? (
          <ul className="flex flex-col gap-1 overflow-auto">
            {results.map((r) => (
              <li key={r.id}>
                <button
                  onClick={() => openSection(r.section)}
                  className="flex w-full items-center justify-between gap-3 rounded-[var(--fl-radius-sm)] px-3 py-2 text-left text-[14px] transition-colors hover:bg-[var(--fl-subtle-hover)]"
                >
                  <span>{r.label}</span>
                  <span className="text-[12px]" style={{ color: "var(--fl-text-secondary)" }}>
                    {r.hint}
                  </span>
                </button>
              </li>
            ))}
          </ul>
        ) : (
          <>
            {/* Pinned */}
            <div className="flex items-center justify-between">
              <h2 className="text-[14px] font-semibold">Pinned</h2>
              <PillButton label="All apps ›" onClick={() => {}} />
            </div>
            <div className="grid grid-cols-6 gap-x-2 gap-y-4">
              {(Object.keys(sectionMeta) as SectionId[]).map((id) => (
                <Tile
                  key={id}
                  icon={sectionMeta[id].emoji}
                  label={sectionMeta[id].label}
                  onClick={() => openSection(id)}
                />
              ))}
              {launchers.map((l) => (
                <Tile
                  key={l.label}
                  icon={l.icon}
                  label={l.label}
                  onClick={() => {
                    window.open(l.href, l.href.startsWith("http") ? "_blank" : "_self");
                    onClose();
                  }}
                />
              ))}
            </div>

            {/* Recommended */}
            <div className="mt-1 flex items-center justify-between">
              <h2 className="text-[14px] font-semibold">Recommended</h2>
              <PillButton label="More ›" onClick={() => openSection("work")} />
            </div>
            <div className="grid grid-cols-2 gap-2">
              {content.work.slice(0, 4).map((w) => (
                <button
                  key={w.slug}
                  onClick={() => openSection("work")}
                  className="flex items-center gap-3 rounded-[var(--fl-radius-sm)] px-2 py-2 text-left transition-colors hover:bg-[var(--fl-subtle-hover)]"
                >
                  <span
                    aria-hidden
                    className="h-8 w-8 shrink-0 rounded-[6px]"
                    style={{ background: `linear-gradient(135deg, hsl(${w.hue} 60% 55%), hsl(${(w.hue + 40) % 360} 55% 45%))` }}
                  />
                  <span className="min-w-0">
                    <span className="block truncate text-[13px] font-medium">{w.title}</span>
                    <span className="block text-[11px]" style={{ color: "var(--fl-text-secondary)" }}>
                      Recently added
                    </span>
                  </span>
                </button>
              ))}
            </div>
          </>
        )}

        {/* Account / power footer */}
        <div
          className="-mx-6 -mb-6 mt-1 flex items-center justify-between px-6 py-3"
          style={{ borderTop: "1px solid var(--fl-stroke)", background: "var(--fl-subtle-hover)" }}
        >
          <div className="flex items-center gap-2.5">
            <span
              aria-hidden
              className="grid h-8 w-8 place-items-center rounded-full text-[12px] font-semibold text-white"
              style={{ background: "var(--fl-accent)" }}
            >
              {content.about.initials}
            </span>
            <span className="text-[14px] font-medium">{content.hero.name}</span>
          </div>
          <button
            aria-label="Power"
            onClick={onClose}
            className="grid h-9 w-9 place-items-center rounded-[var(--fl-radius-sm)] text-[15px] transition-colors hover:bg-[var(--fl-card)]"
          >
            ⏻
          </button>
        </div>
      </div>
    </div>
  );
}

function Tile({ icon, label, onClick }: Readonly<{ icon: string; label: string; onClick: () => void }>) {
  const reveal = useReveal<HTMLButtonElement>();
  return (
    <button
      {...reveal}
      onClick={onClick}
      className="reveal flex flex-col items-center gap-1.5 rounded-[var(--fl-radius-sm)] px-1 py-3 transition-colors hover:bg-[var(--fl-subtle-hover)]"
    >
      <span aria-hidden className="text-[26px] leading-none">{icon}</span>
      <span className="w-full truncate text-center text-[11px]">{label}</span>
    </button>
  );
}

function PillButton({ label, onClick }: Readonly<{ label: string; onClick: () => void }>) {
  return (
    <button
      onClick={onClick}
      className="rounded-[var(--fl-radius-sm)] px-3 py-1 text-[12px] font-medium transition-colors hover:bg-[var(--fl-subtle-hover)]"
      style={{ background: "var(--fl-card)", border: "1px solid var(--fl-stroke)" }}
    >
      {label}
    </button>
  );
}
