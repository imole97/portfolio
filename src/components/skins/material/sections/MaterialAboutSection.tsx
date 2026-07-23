"use client";

import { content } from "@/lib/content";

export function MaterialAboutSection() {
  const { about, hero } = content;
  return (
    <div style={{ color: "var(--md-on-surface)" }}>
      <div
        className="mb-5 flex items-center gap-4 rounded-[var(--md-radius-lg)] p-4"
        style={{ background: "var(--md-primary-container)", color: "var(--md-on-primary-container)" }}
      >
        <div
          aria-hidden
          className="grid h-16 w-16 shrink-0 place-items-center rounded-[var(--md-radius-full)] text-2xl font-semibold"
          style={{ background: "var(--md-primary)", color: "var(--md-on-primary)" }}
        >
          {about.initials}
        </div>
        <div>
          <h2 className="text-xl font-semibold">{hero.name}</h2>
          <p className="text-[14px] opacity-80">
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
            className="rounded-[var(--md-radius-lg)] px-4 py-3"
            style={{ background: "var(--md-surface-container)" }}
          >
            <dt className="text-[11px] uppercase tracking-wide" style={{ color: "var(--md-on-surface-variant)" }}>
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
        style={{ color: "var(--md-on-surface-variant)" }}
      >
        {title}
      </h3>
      <div className="flex flex-wrap gap-2">
        {items.map((item) => (
          <span
            key={item}
            className="rounded-[var(--md-radius-full)] px-3 py-1.5 text-[13px]"
            style={{ background: "var(--md-surface-variant)", color: "var(--md-on-surface-variant)" }}
          >
            {item}
          </span>
        ))}
      </div>
    </div>
  );
}
