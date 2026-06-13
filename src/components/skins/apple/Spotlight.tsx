"use client";

// Spotlight-style ⌘K search over portfolio content. (DESIGN-SYSTEM §4.1 macOS, §8)
// Keyboard-first: ↑/↓ to move, Enter to open, Esc to close. Focus is trapped.

import { useEffect, useMemo, useRef, useState } from "react";
import { type SectionId } from "@/lib/content";
import { useSkin } from "@/components/SkinProvider";
import { liquidSettle } from "@/lib/motion/apple";
import { buildSearchIndex, searchPortfolio, type SearchItem } from "@/lib/search";

interface SpotlightProps {
  open: boolean;
  onClose: () => void;
  onOpenSection: (id: SectionId) => void;
}

export function Spotlight({ open, onClose, onOpenSection }: SpotlightProps) {
  const { reducedMotion } = useSkin();
  const index = useMemo(() => buildSearchIndex(), []);
  const [query, setQuery] = useState("");
  const [cursor, setCursor] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);

  const results = useMemo(() => {
    if (!query.trim()) return index.slice(0, 6);
    return searchPortfolio(index, query, 8);
  }, [index, query]);

  useEffect(() => {
    if (!open) return;
    // Reset transient search state each time the dialog opens.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setQuery("");
    setCursor(0);
    requestAnimationFrame(() => {
      inputRef.current?.focus();
      if (panelRef.current) liquidSettle(panelRef.current, { reducedMotion, from: "center" });
    });
  }, [open, reducedMotion]);

  // Keep the highlighted index in range as results shrink — derived, not stored.
  const activeCursor = Math.min(cursor, Math.max(0, results.length - 1));

  if (!open) return null;

  function choose(r: SearchItem | undefined) {
    if (!r) return;
    if (r.href) {
      window.open(r.href, r.href.startsWith("http") ? "_blank" : "_self");
      onClose();
      return;
    }
    onOpenSection(r.section);
    onClose();
  }

  function onKeyDown(e: React.KeyboardEvent) {
    if (e.key === "Escape") {
      e.preventDefault();
      onClose();
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      setCursor((c) => Math.min(c + 1, results.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setCursor((c) => Math.max(c - 1, 0));
    } else if (e.key === "Enter") {
      e.preventDefault();
      choose(results[activeCursor]);
    }
  }

  return (
    <div
      className="fixed inset-0 z-[400] flex items-start justify-center px-4 pt-[18vh]"
      role="dialog"
      aria-modal="true"
      aria-label="Spotlight search"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="absolute inset-0 bg-black/10 backdrop-blur-[2px]" aria-hidden />
      <div
        ref={panelRef}
        className="glass glass-specular relative w-full max-w-xl overflow-hidden rounded-[var(--radius-sheet)]"
        onKeyDown={onKeyDown}
      >
        <div className="flex items-center gap-3 px-4 py-3" style={{ borderBottom: "1px solid var(--separator)" }}>
          <span aria-hidden className="text-lg opacity-60">
            🔍
          </span>
          <input
            ref={inputRef}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search work, skills, tools, contact…"
            aria-label="Search"
            className="w-full bg-transparent text-[17px] outline-none placeholder:text-[var(--text-secondary)]"
          />
        </div>

        <ul role="listbox" aria-label="Results" className="max-h-80 overflow-auto p-2">
          {results.length === 0 && (
            <li className="px-3 py-6 text-center text-[14px] text-[var(--text-secondary)]">
              No matches for “{query}”
            </li>
          )}
          {results.map((r, i) => (
            <li key={r.id} role="option" aria-selected={i === activeCursor}>
              <button
                onMouseEnter={() => setCursor(i)}
                onClick={() => choose(r)}
                className="flex w-full items-center gap-3 rounded-[12px] px-3 py-2.5 text-left"
                style={{ background: i === activeCursor ? "var(--accent)" : "transparent" }}
              >
                <span aria-hidden className="text-[16px] leading-none">{r.glyph}</span>
                <span className={i === activeCursor ? "font-medium text-white" : ""}>{r.label}</span>
                <span
                  className="ml-auto text-[12px]"
                  style={{ color: i === activeCursor ? "rgba(255,255,255,0.8)" : "var(--text-secondary)" }}
                >
                  {r.hint}
                </span>
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
