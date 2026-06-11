"use client";

// Work list -> detail using the signature container transform. (DESIGN-SYSTEM §7)

import { useEffect, useRef, useState } from "react";
import { content, type CaseStudy } from "@/lib/content";
import { useSkin } from "@/components/SkinProvider";
import { captureFlip, containerTransform, staggerReveal } from "@/lib/motion/material";
import { MaterialCard } from "../MaterialCard";

function coverStyle(hue: number): React.CSSProperties {
  return {
    background: `linear-gradient(135deg, hsl(${hue} 70% 60%), hsl(${(hue + 40) % 360} 65% 48%))`,
  };
}

export function MaterialWorkSection() {
  const { reducedMotion } = useSkin();
  const [active, setActive] = useState<CaseStudy | null>(null);
  const listRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!active && listRef.current) {
      staggerReveal(listRef.current.querySelectorAll(".md-work-card"), { reducedMotion });
    }
  }, [active, reducedMotion]);

  function open(study: CaseStudy) {
    const state = captureFlip(`[data-flip-id="md-cover-${study.slug}"]`);
    setActive(study);
    requestAnimationFrame(() =>
      containerTransform(state, { reducedMotion, targets: ".md-work-detail" }),
    );
  }

  function back() {
    if (!active) return;
    const state = captureFlip(`[data-flip-id="md-cover-${active.slug}"]`);
    setActive(null);
    requestAnimationFrame(() =>
      containerTransform(state, { reducedMotion, targets: ".md-work-card" }),
    );
  }

  if (active) {
    return (
      <article className="md-work-detail">
        <button
          onClick={back}
          className="mb-4 inline-flex items-center gap-2 rounded-[var(--md-radius-full)] px-4 py-2 text-[14px] font-medium"
          style={{ background: "var(--md-secondary-container)", color: "var(--md-on-secondary-container)" }}
        >
          ← Back
        </button>

        <div
          data-flip-id={`md-cover-${active.slug}`}
          className="mb-5 h-48 w-full rounded-[var(--md-radius-lg)]"
          style={coverStyle(active.hue)}
        />

        <p className="text-[13px]" style={{ color: "var(--md-on-surface-variant)" }}>
          {active.role} · {active.year}
        </p>
        <h2 className="mt-1 text-2xl font-semibold">{active.title}</h2>

        <div className="mt-3 flex flex-wrap gap-2">
          {active.tags.map((t) => (
            <span
              key={t}
              className="rounded-[var(--md-radius-full)] px-3 py-1 text-[12px]"
              style={{ background: "var(--md-surface-variant)", color: "var(--md-on-surface-variant)" }}
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
    <div ref={listRef} className="grid grid-cols-1 gap-4 md:grid-cols-2">
      {content.work.map((study) => (
        <MaterialCard
          key={study.slug}
          onClick={() => open(study)}
          className="md-work-card overflow-hidden p-0"
        >
          <div
            data-flip-id={`md-cover-${study.slug}`}
            className="h-32 w-full"
            style={coverStyle(study.hue)}
          />
          <div className="p-4">
            <p className="text-[12px]" style={{ color: "var(--md-on-surface-variant)" }}>
              {study.year} · {study.tags[0]}
            </p>
            <h3 className="mt-1 text-[16px] font-semibold leading-snug">{study.title}</h3>
            <p className="mt-1.5 text-[14px]" style={{ color: "var(--md-on-surface-variant)" }}>
              {study.summary}
            </p>
          </div>
        </MaterialCard>
      ))}
    </div>
  );
}

function Block({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <section className="mt-5">
      <h4
        className="mb-1.5 text-[13px] font-semibold uppercase tracking-wide"
        style={{ color: "var(--md-on-surface-variant)" }}
      >
        {label}
      </h4>
      <div className="text-[15px] leading-relaxed">{children}</div>
    </section>
  );
}
