"use client";

// Full-screen portfolio search — recruiters/visitors can find any content: sections,
// case studies, skills, tools, and contact links. Selecting a result opens the relevant
// app (or an external link). (§4.2)

import { useEffect, useMemo, useRef, useState } from "react";
import { type SectionId } from "@/lib/content";
import { useSkin } from "@/components/SkinProvider";
import { appOpen } from "@/lib/motion/material";
import { buildSearchIndex, searchPortfolio, type SearchItem } from "@/lib/search";
import { useRipple } from "./useRipple";

interface MaterialSearchProps {
  onClose: () => void;
  onOpen: (id: SectionId) => void;
}

export function MaterialSearch({ onClose, onOpen }: Readonly<MaterialSearchProps>) {
  const { reducedMotion } = useSkin();
  const index = useMemo(() => buildSearchIndex(), []);
  const [query, setQuery] = useState("");
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (rootRef.current) appOpen(rootRef.current, { reducedMotion });
  }, [reducedMotion]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  const q = query.trim().toLowerCase();
  const results = useMemo(() => searchPortfolio(index, query), [index, query]);

  const suggestions = useMemo(() => index.filter((r) => r.hint === "Section"), [index]);

  const select = (r: SearchItem) => {
    if (r.href) {
      window.open(r.href, r.href.startsWith("http") ? "_blank" : "_self");
      onClose();
      return;
    }
    onOpen(r.section);
  };

  const shown = q ? results : suggestions;

  return (
    <div
      ref={rootRef}
      role="dialog"
      aria-label="Search portfolio"
      className="absolute inset-0 z-[400] flex flex-col"
      style={{ background: "var(--md-surface)", color: "var(--md-on-surface)", willChange: "transform" }}
    >
      {/* Search bar */}
      <div className="flex items-center gap-2 px-3 pb-2 pt-4">
        <button
          onClick={onClose}
          aria-label="Close search"
          className="md-ripple grid h-10 w-10 shrink-0 place-items-center rounded-[var(--md-radius-full)] text-[22px] leading-none transition-colors hover:bg-[var(--md-surface-container-high)]"
        >
          ←
        </button>
        <div
          className="flex flex-1 items-center gap-2 rounded-[var(--md-radius-full)] px-4 py-2.5"
          style={{ background: "var(--md-surface-container-high)" }}
        >
          <SearchIcon />
          <input
            autoFocus
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search work, skills, tools, contact…"
            aria-label="Search the portfolio"
            className="w-full bg-transparent text-[15px] outline-none placeholder:text-[var(--md-on-surface-variant)]"
          />
          {query && (
            <button
              onClick={() => setQuery("")}
              aria-label="Clear"
              className="shrink-0 text-[15px]"
              style={{ color: "var(--md-on-surface-variant)" }}
            >
              ✕
            </button>
          )}
        </div>
      </div>

      {/* Results */}
      <div className="flex-1 overflow-auto px-2 pb-8">
        {!q && (
          <p className="px-3 pb-1 pt-3 text-[13px] font-medium" style={{ color: "var(--md-on-surface-variant)" }}>
            Suggestions
          </p>
        )}
        {q && results.length === 0 ? (
          <p className="px-3 pt-6 text-[14px]" style={{ color: "var(--md-on-surface-variant)" }}>
            No results for “{query.trim()}”.
          </p>
        ) : (
          <ul>
            {shown.map((r) => (
              <ResultRow key={r.id} result={r} onSelect={select} />
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

function ResultRow({ result, onSelect }: Readonly<{ result: SearchItem; onSelect: (r: SearchItem) => void }>) {
  const onRipple = useRipple<HTMLButtonElement>();
  return (
    <li>
      <button
        onPointerDown={onRipple}
        onClick={() => onSelect(result)}
        className="md-ripple flex w-full items-center gap-3 rounded-[var(--md-radius-md)] px-3 py-2.5 text-left transition-colors hover:bg-[var(--md-surface-container-high)]"
      >
        <span
          aria-hidden
          className="grid h-10 w-10 shrink-0 place-items-center rounded-[var(--md-radius-full)] text-[18px] leading-none"
          style={{ background: "var(--md-secondary-container)", color: "var(--md-on-secondary-container)" }}
        >
          {result.glyph}
        </span>
        <span className="min-w-0 flex-1">
          <span className="block truncate text-[15px] font-medium">{result.label}</span>
          <span className="block truncate text-[12px]" style={{ color: "var(--md-on-surface-variant)" }}>
            {result.hint}
          </span>
        </span>
        {result.href && (
          <span aria-hidden className="shrink-0 text-[14px]" style={{ color: "var(--md-on-surface-variant)" }}>
            ↗
          </span>
        )}
      </button>
    </li>
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
