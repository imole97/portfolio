"use client";

import { content } from "@/lib/content";
import { MaterialCard } from "../MaterialCard";

export function MaterialPlaySection() {
  return (
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
      {content.play.map((item) => (
        <MaterialCard
          key={item.title}
          onClick={() => {
            if (item.href && item.href !== "#") window.open(item.href, "_blank");
          }}
          className="flex items-start gap-3"
        >
          <span className="text-2xl" aria-hidden>
            {item.emoji}
          </span>
          <span>
            <span className="block text-[15px] font-semibold">{item.title}</span>
            <span className="mt-1 block text-[13px]" style={{ color: "var(--md-on-surface-variant)" }}>
              {item.blurb}
            </span>
          </span>
        </MaterialCard>
      ))}
    </div>
  );
}
