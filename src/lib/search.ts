// Shared portfolio search index — every skin searches the same content so recruiters
// and visitors can find anything: sections, case studies, skills, tools, and contact
// links. Skin search UIs (Spotlight, Start menu, Android search) all consume this. (§8)

import { content, sectionMeta, type SectionId } from "@/lib/content";

export interface SearchItem {
  id: string;
  label: string;
  /** Category shown alongside the result, e.g. "Case study · 2025". */
  hint: string;
  /** Emoji/glyph used by skins that show an icon. */
  glyph: string;
  /** Section to open when this result is chosen. */
  section: SectionId;
  /** External / document target; when set, choosing opens it instead of a section. */
  href?: string;
  /** Extra searchable text (not displayed). */
  keywords: string;
}

export function buildSearchIndex(): SearchItem[] {
  const out: SearchItem[] = [];

  (Object.keys(sectionMeta) as SectionId[]).forEach((id) =>
    out.push({
      id: `sec-${id}`,
      label: sectionMeta[id].title,
      hint: "Section",
      glyph: sectionMeta[id].emoji,
      section: id,
      keywords: sectionMeta[id].label.toLowerCase(),
    }),
  );

  content.work.forEach((w) =>
    out.push({
      id: `work-${w.slug}`,
      label: w.title,
      hint: `Case study · ${w.year}`,
      glyph: "🗂️",
      section: "work",
      keywords: `${w.summary} ${w.role} ${w.tags.join(" ")}`.toLowerCase(),
    }),
  );

  content.about.skills.forEach((s) =>
    out.push({ id: `skill-${s}`, label: s, hint: "Skill", glyph: "✦", section: "about", keywords: s.toLowerCase() }),
  );
  content.about.tools.forEach((t) =>
    out.push({ id: `tool-${t}`, label: t, hint: "Tool", glyph: "🛠️", section: "about", keywords: t.toLowerCase() }),
  );

  content.contact.links.forEach((l) =>
    out.push({
      id: `link-${l.label}`,
      label: l.label === "Twitter / X" ? "X (Twitter)" : l.label,
      hint: "Contact",
      glyph: l.label === "Email" ? "✉️" : "🔗",
      section: "contact",
      href: l.label === "Email" ? undefined : l.href,
      keywords: l.value.toLowerCase(),
    }),
  );
  out.push({
    id: "resume",
    label: "Résumé",
    hint: "Document",
    glyph: "📄",
    section: "contact",
    href: content.contact.resumeHref,
    keywords: "cv resume curriculum vitae",
  });

  return out;
}

/** Filter an index by a query string; empty query returns []. */
export function searchPortfolio(index: SearchItem[], query: string, limit = 12): SearchItem[] {
  const q = query.trim().toLowerCase();
  if (!q) return [];
  return index
    .filter((r) => r.label.toLowerCase().includes(q) || r.hint.toLowerCase().includes(q) || r.keywords.includes(q))
    .slice(0, limit);
}
