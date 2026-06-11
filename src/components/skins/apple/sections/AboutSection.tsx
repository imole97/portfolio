"use client";

import { content } from "@/lib/content";

export function AboutSection() {
  const { about, hero } = content;
  return (
    <div>
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
          <p className="text-[14px] text-[var(--text-secondary)]">{hero.role}</p>
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
      <h3 className="mb-2 text-[13px] font-semibold uppercase tracking-wide text-[var(--text-secondary)]">
        {title}
      </h3>
      <div className="flex flex-wrap gap-2">
        {items.map((item) => (
          <span
            key={item}
            className="rounded-[var(--radius-pill)] px-3 py-1 text-[13px]"
            style={{ background: "var(--separator)" }}
          >
            {item}
          </span>
        ))}
      </div>
    </div>
  );
}
