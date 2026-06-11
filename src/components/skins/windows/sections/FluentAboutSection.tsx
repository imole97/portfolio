"use client";

import { content } from "@/lib/content";

export function FluentAboutSection() {
  const { about, hero } = content;
  return (
    <div className="max-w-3xl">
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
            {hero.role}
          </p>
        </div>
      </div>

      {about.bio.map((para, i) => (
        <p key={i} className="mb-3 text-[15px] leading-relaxed">
          {para}
        </p>
      ))}

      <div className="mt-5 grid grid-cols-1 gap-5 sm:grid-cols-2">
        <ChipGroup title="Skills" items={about.skills} />
        <ChipGroup title="Tools" items={about.tools} />
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
            style={{ background: "var(--fl-subtle-hover)" }}
          >
            {item}
          </span>
        ))}
      </div>
    </div>
  );
}
