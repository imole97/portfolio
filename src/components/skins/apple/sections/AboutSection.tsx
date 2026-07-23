"use client";

import { content } from "@/lib/content";

export function AboutSection() {
  const { about, hero } = content;
  return (
    <div className="text-[var(--text-primary)]">
      <div className="mb-5 flex items-center gap-4">
        <div
          aria-hidden
          className="grid h-16 w-16 shrink-0 place-items-center rounded-[var(--radius-card)] text-2xl font-semibold text-white"
          style={{ background: "linear-gradient(135deg, var(--accent), var(--accent-2))" }}
        >
          {about.initials}
        </div>
        <div>
          <h2 className="text-xl font-semibold">{hero.name}</h2>
          <p className="text-[14px] text-[var(--text-secondary)]">
            {hero.role} · {hero.location}
          </p>
        </div>
      </div>

      {about.bio.map((para) => (
        <p key={para.slice(0, 24)} className="mb-3 text-[15px] leading-relaxed">
          {para}
        </p>
      ))}

      <dl className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-2">
        {about.facts.map((f) => (
          <div
            key={f.label}
            className="rounded-[var(--radius-button)] px-3.5 py-2.5"
            style={{ background: "var(--separator)" }}
          >
            <dt className="text-[11px] uppercase tracking-wide text-[var(--text-secondary)]">
              {f.label}
            </dt>
            <dd className="mt-0.5 text-[14px] font-medium">{f.value}</dd>
          </div>
        ))}
      </dl>

      <div className="mt-6 space-y-5">
        {about.skillGroups.map((g) => (
          <ChipGroup key={g.title} title={g.title} items={g.items} />
        ))}
      </div>
    </div>
  );
}

function ChipGroup({ title, items }: Readonly<{ title: string; items: string[] }>) {
  return (
    <div>
      <h3 className="mb-2 text-[13px] font-semibold uppercase tracking-wide text-[var(--text-secondary)]">
        {title}
      </h3>
      <div className="flex flex-wrap gap-2">
        {items.map((item) => (
          <span
            key={item}
            className="rounded-[var(--radius-pill)] px-3 py-1 text-[13px] text-[var(--text-primary)]"
            style={{ background: "var(--separator)" }}
          >
            {item}
          </span>
        ))}
      </div>
    </div>
  );
}
