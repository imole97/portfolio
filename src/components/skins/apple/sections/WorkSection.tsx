"use client";

// Work grid -> case-study detail with the signature Flip reveal. (DESIGN-SYSTEM §7)

import { useRef, useState } from "react";
import { content, type CaseStudy } from "@/lib/content";
import { useSkin } from "@/components/SkinProvider";
import { captureFlip, flipReveal } from "@/lib/motion/apple";
import { cn } from "@/lib/cn";

function coverStyle(hue: number): React.CSSProperties {
  return {
    background: `linear-gradient(135deg, hsl(${hue} 80% 62%), hsl(${(hue + 40) % 360} 75% 52%))`,
  };
}

export function WorkSection() {
  const { reducedMotion } = useSkin();
  const [active, setActive] = useState<CaseStudy | null>(null);
  const gridRef = useRef<HTMLDivElement>(null);

  function open(study: CaseStudy) {
    const state = captureFlip(".work-flip");
    setActive(study);
    requestAnimationFrame(() => flipReveal(state, { reducedMotion, targets: ".work-detail" }));
  }

  function back() {
    const state = captureFlip(".work-flip");
    setActive(null);
    requestAnimationFrame(() => flipReveal(state, { reducedMotion, targets: ".work-card" }));
  }

  if (active) {
    return (
      <article className="work-detail">
        <button
          onClick={back}
          className="mb-4 inline-flex items-center gap-1.5 rounded-[var(--radius-pill)] bg-[var(--accent)] px-3.5 py-1.5 text-[13px] font-medium text-white"
        >
          ← Back to work
        </button>

        <div
          data-flip-id={`cover-${active.slug}`}
          className="work-flip mb-5 h-44 w-full rounded-[var(--radius-card)]"
          style={coverStyle(active.hue)}
        />

        <header className="mb-4">
          <p className="text-[13px] uppercase tracking-wide text-[var(--text-secondary)]">
            {active.role} · {active.year}
          </p>
          <h2 className="mt-1 text-2xl font-semibold">{active.title}</h2>
          <div className="mt-3 flex flex-wrap gap-2">
            {active.tags.map((t) => (
              <span
                key={t}
                className="rounded-[var(--radius-pill)] px-2.5 py-1 text-xs"
                style={{ background: "var(--separator)" }}
              >
                {t}
              </span>
            ))}
          </div>
        </header>

        <Block label="Problem">
          <p>{active.problem}</p>
        </Block>
        <Block label="Process">
          <ol className="list-decimal space-y-1.5 pl-5">
            {active.process.map((step, i) => (
              <li key={i}>{step}</li>
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
    <div ref={gridRef}>
      <p className="mb-4 text-[15px] text-[var(--text-secondary)]">
        {content.work.length} case studies — click any project to dive in.
      </p>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        {content.work.map((study) => (
          <button
            key={study.slug}
            onClick={() => open(study)}
            className={cn(
              "work-card group glass glass-specular overflow-hidden rounded-[var(--radius-card)] text-left",
              "transition-transform duration-200 hover:-translate-y-0.5",
            )}
          >
            <div
              data-flip-id={`cover-${study.slug}`}
              className="work-flip h-28 w-full"
              style={coverStyle(study.hue)}
            />
            <div className="p-3.5">
              <p className="text-[11px] uppercase tracking-wide text-[var(--text-secondary)]">
                {study.year} · {study.tags[0]}
              </p>
              <h3 className="mt-1 text-[15px] font-semibold leading-snug">{study.title}</h3>
              <p className="mt-1.5 text-[13px] text-[var(--text-secondary)]">{study.summary}</p>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}

function Block({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <section className="mb-4">
      <h4 className="mb-1.5 text-[13px] font-semibold uppercase tracking-wide text-[var(--text-secondary)]">
        {label}
      </h4>
      <div className="text-[15px] leading-relaxed">{children}</div>
    </section>
  );
}
