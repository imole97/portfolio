"use client";

import { content } from "@/lib/content";

export function PlaySection() {
  return (
    <div>
      <p className="mb-4 text-[15px] text-[var(--text-secondary)]">
        Experiments, side projects, and things built purely for the joy of it.
      </p>
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        {content.play.map((item) => (
          <a
            key={item.title}
            href={item.href}
            className="glass glass-specular flex items-start gap-3 rounded-[var(--radius-card)] p-3.5 transition-transform duration-200 hover:-translate-y-0.5"
          >
            <span className="text-2xl" aria-hidden>
              {item.emoji}
            </span>
            <span>
              <span className="block text-[15px] font-semibold">{item.title}</span>
              <span className="mt-1 block text-[13px] text-[var(--text-secondary)]">
                {item.blurb}
              </span>
            </span>
          </a>
        ))}
      </div>
    </div>
  );
}
