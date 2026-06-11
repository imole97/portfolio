"use client";

// Work list -> detail with the signature connected animation. (DESIGN-SYSTEM §7)
// A thumbnail flies from the list into the detail header.

import { useEffect, useRef, useState } from "react";
import { content, type CaseStudy } from "@/lib/content";
import { useSkin } from "@/components/SkinProvider";
import { captureFlip, connectedAnimation, entranceSlide } from "@/lib/motion/fluent";
import { FluentCard } from "../FluentCard";

function coverStyle(hue: number): React.CSSProperties {
  return {
    background: `linear-gradient(135deg, hsl(${hue} 55% 52%), hsl(${(hue + 40) % 360} 50% 42%))`,
  };
}

export function FluentWorkSection() {
  const { reducedMotion } = useSkin();
  const [active, setActive] = useState<CaseStudy | null>(null);
  const listRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!active && listRef.current) {
      entranceSlide(listRef.current.querySelectorAll(".fl-work-card"), { reducedMotion });
    }
  }, [active, reducedMotion]);

  function open(study: CaseStudy) {
    const state = captureFlip(`[data-flip-id="fl-cover-${study.slug}"]`);
    setActive(study);
    requestAnimationFrame(() =>
      connectedAnimation(state, { reducedMotion, targets: ".fl-work-detail" }),
    );
  }

  function back() {
    if (!active) return;
    const state = captureFlip(`[data-flip-id="fl-cover-${active.slug}"]`);
    setActive(null);
    requestAnimationFrame(() =>
      connectedAnimation(state, { reducedMotion, targets: ".fl-work-card" }),
    );
  }

  if (active) {
    return (
      <article className="fl-work-detail max-w-3xl">
        <button
          onClick={back}
          className="mb-4 inline-flex items-center gap-2 rounded-[var(--fl-radius-sm)] px-3 py-1.5 text-[13px] font-medium"
          style={{ border: "1px solid var(--fl-stroke-strong)" }}
        >
          ← Back
        </button>

        <div className="flex items-center gap-4">
          <div
            data-flip-id={`fl-cover-${active.slug}`}
            className="h-20 w-32 shrink-0 rounded-[var(--fl-radius)]"
            style={coverStyle(active.hue)}
          />
          <div>
            <p className="text-[13px]" style={{ color: "var(--fl-text-secondary)" }}>
              {active.role} · {active.year}
            </p>
            <h2 className="text-2xl font-semibold">{active.title}</h2>
          </div>
        </div>

        <div className="mt-3 flex flex-wrap gap-2">
          {active.tags.map((t) => (
            <span
              key={t}
              className="rounded-[var(--fl-radius-sm)] px-2.5 py-1 text-[12px]"
              style={{ background: "var(--fl-subtle-hover)", color: "var(--fl-text-secondary)" }}
            >
              {t}
            </span>
          ))}
        </div>

        <Block label="Problem">
          <p>{active.problem}</p>
        </Block>
        <Block label="Process">
          <ol className="list-decimal space-y-1.5 pl-5">
            {active.process.map((s, i) => (
              <li key={i}>{s}</li>
            ))}
          </ol>
        </Block>
        <Block label="Outcome">
          <p>{active.outcome}</p>
        </Block>
      </article>
    );
  }

  return (
    <div ref={listRef} className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
      {content.work.map((study) => (
        <FluentCard key={study.slug} onClick={() => open(study)} className="fl-work-card">
          <div
            data-flip-id={`fl-cover-${study.slug}`}
            className="h-28 w-full"
            style={coverStyle(study.hue)}
          />
          <div className="p-3.5">
            <p className="text-[12px]" style={{ color: "var(--fl-text-secondary)" }}>
              {study.year} · {study.tags[0]}
            </p>
            <h3 className="mt-1 text-[15px] font-semibold leading-snug">{study.title}</h3>
            <p className="mt-1.5 text-[13px]" style={{ color: "var(--fl-text-secondary)" }}>
              {study.summary}
            </p>
          </div>
        </FluentCard>
      ))}
    </div>
  );
}

function Block({ label, children }: Readonly<{ label: string; children: React.ReactNode }>) {
  return (
    <section className="mt-5">
      <h4
        className="mb-1.5 text-[13px] font-semibold uppercase tracking-wide"
        style={{ color: "var(--fl-text-secondary)" }}
      >
        {label}
      </h4>
      <div className="text-[15px] leading-relaxed">{children}</div>
    </section>
  );
}
