"use client";

// Command bar with an AutoSuggest search box (acrylic flyout) + primary actions.
// (DESIGN-SYSTEM §4.3 Chrome, §6 Search = search box in command bar)

import { useEffect, useMemo, useRef, useState } from "react";
import { content, sectionMeta, type SectionId } from "@/lib/content";

interface Result {
  id: string;
  label: string;
  hint: string;
  section: SectionId;
}

function buildIndex(): Result[] {
  const items: Result[] = [];
  (Object.keys(sectionMeta) as SectionId[]).forEach((id) =>
    items.push({ id: `s-${id}`, label: sectionMeta[id].title, hint: "Section", section: id }),
  );
  content.work.forEach((w) =>
    items.push({ id: `w-${w.slug}`, label: w.title, hint: "Case study", section: "work" }),
  );
  content.play.forEach((p) =>
    items.push({ id: `p-${p.title}`, label: p.title, hint: "Experiment", section: "play" }),
  );
  return items;
}

export function CommandBar({ onOpenSection }: Readonly<{ onOpenSection: (id: SectionId) => void }>) {
  const index = useMemo(() => buildIndex(), []);
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const [cursor, setCursor] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const boxRef = useRef<HTMLDivElement>(null);

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return index.filter((r) => r.hint === "Section");
    return index.filter((r) => r.label.toLowerCase().includes(q)).slice(0, 8);
  }, [index, query]);

  const activeCursor = Math.min(cursor, Math.max(0, results.length - 1));

  // ⌘K / Ctrl+K focuses search; click-away closes the flyout. (§8)
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        inputRef.current?.focus();
        setOpen(true);
      }
    };
    const onClick = (e: MouseEvent) => {
      if (boxRef.current && !boxRef.current.contains(e.target as Node)) setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    window.addEventListener("mousedown", onClick);
    return () => {
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("mousedown", onClick);
    };
  }, []);

  function choose(r: Result | undefined) {
    if (!r) return;
    onOpenSection(r.section);
    setOpen(false);
    setQuery("");
    inputRef.current?.blur();
  }

  function onKeyDown(e: React.KeyboardEvent) {
    if (e.key === "Escape") {
      setOpen(false);
      inputRef.current?.blur();
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      setCursor(Math.min(activeCursor + 1, results.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setCursor(Math.max(activeCursor - 1, 0));
    } else if (e.key === "Enter") {
      e.preventDefault();
      choose(results[activeCursor]);
    }
  }

  return (
    <div
      className="flex items-center gap-3 px-4 py-2"
      style={{ borderBottom: "1px solid var(--fl-stroke)" }}
    >
      <div ref={boxRef} className="relative w-full max-w-sm">
        <div
          className="flex items-center gap-2 rounded-[var(--fl-radius-sm)] px-3 py-1.5"
          style={{ background: "var(--fl-card)", border: "1px solid var(--fl-stroke)" }}
        >
          <span aria-hidden className="opacity-60">
            🔍
          </span>
          <input
            ref={inputRef}
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setOpen(true);
            }}
            onFocus={() => setOpen(true)}
            onKeyDown={onKeyDown}
            placeholder="Search"
            aria-label="Search"
            className="w-full bg-transparent text-[14px] outline-none placeholder:text-[var(--fl-text-secondary)]"
          />
          <kbd
            className="rounded px-1.5 text-[11px]"
            style={{ background: "var(--fl-subtle-hover)", color: "var(--fl-text-secondary)" }}
          >
            ⌘K
          </kbd>
        </div>

        {open && results.length > 0 && (
          <ul
            role="listbox"
            aria-label="Search results"
            className="acrylic absolute left-0 right-0 top-[calc(100%+4px)] z-[400] overflow-hidden rounded-[var(--fl-radius)] p-1 shadow-lg"
          >
            {results.map((r, i) => (
              <li key={r.id} role="option" aria-selected={i === activeCursor}>
                <button
                  onMouseEnter={() => setCursor(i)}
                  onClick={() => choose(r)}
                  className="flex w-full items-center justify-between gap-3 rounded-[var(--fl-radius-sm)] px-3 py-2 text-left text-[14px]"
                  style={{ background: i === activeCursor ? "var(--fl-subtle-hover)" : "transparent" }}
                >
                  <span>{r.label}</span>
                  <span className="text-[12px]" style={{ color: "var(--fl-text-secondary)" }}>
                    {r.hint}
                  </span>
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>

      <div className="ml-auto flex items-center gap-2">
        <a
          href={content.contact.resumeHref}
          className="rounded-[var(--fl-radius-sm)] px-3 py-1.5 text-[13px] font-medium text-white"
          style={{ background: "var(--fl-accent)" }}
        >
          Résumé
        </a>
      </div>
    </div>
  );
}
