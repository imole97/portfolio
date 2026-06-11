"use client";

import { content } from "@/lib/content";

export function MaterialAboutSection() {
  const { about, hero } = content;
  return (
    <div>
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
          <p className="text-[14px] opacity-80">{hero.role}</p>
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

function ChipGroup({ title, items }: { title: string; items: string[] }) {
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
