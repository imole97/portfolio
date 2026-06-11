"use client";

import { content } from "@/lib/content";
import { FluentCard } from "../FluentCard";

export function FluentPlaySection() {
  return (
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-3">
      {content.play.map((item) => (
        <FluentCard
          key={item.title}
          onClick={() => {
            if (item.href && item.href !== "#") window.open(item.href, "_blank");
          }}
          className="flex items-start gap-3 p-4"
        >
          <span className="text-2xl" aria-hidden>
            {item.emoji}
          </span>
          <span>
            <span className="block text-[15px] font-semibold">{item.title}</span>
            <span className="mt-1 block text-[13px]" style={{ color: "var(--fl-text-secondary)" }}>
              {item.blurb}
            </span>
          </span>
        </FluentCard>
      ))}
    </div>
  );
}
