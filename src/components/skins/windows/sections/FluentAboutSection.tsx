"use client";

import { content } from "@/lib/content";

export function FluentAboutSection() {
  const { about, hero } = content;
  return (
    <div className="max-w-3xl" style={{ color: "var(--fl-text)" }}>
      <div className="fluent-card mb-5 flex items-center gap-4 p-4">
        <div
          aria-hidden
          className="grid h-16 w-16 shrink-0 place-items-center rounded-[var(--fl-radius)] text-2xl font-semibold text-white"
          style={{ background: "var(--fl-accent)" }}
        >
          {about.initials}
        </div>
        <div>
          <h2 className="text-xl font-semibold">{hero.name}</h2>
          <p className="text-[14px]" style={{ color: "var(--fl-text-secondary)" }}>
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
          <div key={f.label} className="fluent-card px-4 py-3">
            <dt
              className="text-[11px] uppercase tracking-wide"
              style={{ color: "var(--fl-text-secondary)" }}
            >
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
      <h3
        className="mb-2 text-[13px] font-semibold uppercase tracking-wide"
        style={{ color: "var(--fl-text-secondary)" }}
      >
        {title}
      </h3>
      <div className="flex flex-wrap gap-2">
        {items.map((item) => (
          <span
            key={item}
            className="rounded-[var(--fl-radius-sm)] px-3 py-1.5 text-[13px]"
            style={{ background: "var(--fl-subtle-hover)", color: "var(--fl-text)" }}
          >
            {item}
          </span>
        ))}
      </div>
    </div>
  );
}
