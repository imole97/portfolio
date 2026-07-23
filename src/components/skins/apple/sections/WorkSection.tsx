"use client";

// Experience grid -> role detail with the signature Flip reveal. (DESIGN-SYSTEM §7)

import { useRef, useState } from "react";
import { content, type CaseStudy } from "@/lib/content";
import { useSkin } from "@/components/SkinProvider";
import { captureFlip, flipReveal } from "@/lib/motion/apple";
import { BrandMark, brandTint } from "@/components/BrandMark";
import { cn } from "@/lib/cn";

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
      <article className="work-detail text-[var(--text-primary)]">
        <button
          onClick={back}
          className="mb-4 inline-flex items-center gap-1.5 rounded-[var(--radius-pill)] bg-[var(--accent)] px-3.5 py-1.5 text-[13px] font-medium text-white"
        >
          ← Back to experience
        </button>

        <BrandMark
          data-flip-id={`cover-${active.slug}`}
          brand={active.brand}
          name={active.title}
          logoHeight={34}
          className="work-flip mb-5 h-36 w-full rounded-[var(--radius-card)]"
        />

        <header className="mb-4">
          <h2 className="text-2xl font-semibold">{active.title}</h2>
          <p className="mt-1 text-[15px] font-medium text-[var(--accent)]">{active.role}</p>
          <p className="mt-0.5 text-[13px] text-[var(--text-secondary)]">
            {active.year} · {active.location}
          </p>
          {active.href && (
            <a
              href={active.href}
              target="_blank"
              rel="noreferrer"
              className="mt-2 inline-block text-[13px] font-medium text-[var(--accent)] hover:underline"
            >
              Visit product ↗
            </a>
          )}
        </header>

        <Block label="Context">
          <p>{active.context}</p>
        </Block>
        <Block label="What I shipped">
          <ul className="list-disc space-y-2 pl-5">
            {active.highlights.map((step, i) => (
              <li key={i}>{step}</li>
            ))}
          </ul>
        </Block>
        <Block label="Impact">
          <p>{active.outcome}</p>
        </Block>
        <Block label="Stack">
          <div className="flex flex-wrap gap-2">
            {active.stack.map((t) => (
              <span
                key={t}
                className="rounded-[var(--radius-pill)] px-2.5 py-1 text-[13px] text-[var(--text-primary)]"
                style={{ background: brandTint(active.brand) }}
              >
                {t}
              </span>
            ))}
          </div>
        </Block>
      </article>
    );
  }

  return (
    <div ref={gridRef} className="text-[var(--text-primary)]">
      <p className="mb-4 text-[15px] text-[var(--text-secondary)]">
        {content.work.length} roles — tap any one for the full story.
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
            <BrandMark
              data-flip-id={`cover-${study.slug}`}
              brand={study.brand}
              name={study.title}
              logoHeight={24}
              className="work-flip h-24 w-full"
            />
            <div
              className="p-3.5"
              style={{ borderTop: `2px solid ${study.brand.to}` }}
            >
              <p className="text-[11px] uppercase tracking-wide text-[var(--text-secondary)]">
                {study.year}
              </p>
              <h3 className="mt-1 text-[15px] font-semibold leading-snug">{study.title}</h3>
              <p className="text-[13px] font-medium text-[var(--accent)]">{study.role}</p>
              <p className="mt-1.5 text-[13px] text-[var(--text-secondary)]">{study.summary}</p>
              <div className="mt-2.5 flex flex-wrap gap-1.5">
                {study.tags.slice(0, 3).map((t) => (
                  <span
                    key={t}
                    className="rounded-[var(--radius-pill)] px-2 py-0.5 text-[11px]"
                    style={{ background: brandTint(study.brand, 18) }}
                  >
                    {t}
                  </span>
                ))}
              </div>
            </div>
          </button>
        ))}
      </div>

      <h3 className="mb-3 mt-7 text-[13px] font-semibold uppercase tracking-wide text-[var(--text-secondary)]">
        Selected projects
      </h3>
      <ul className="glass glass-specular overflow-hidden rounded-[var(--radius-card)]">
        {content.projects.map((p, i) => (
          <li key={p.name} style={{ borderTop: i === 0 ? undefined : "1px solid var(--separator)" }}>
            <a
              href={p.href}
              target="_blank"
              rel="noreferrer"
              className="block px-3.5 py-3 transition-opacity hover:opacity-70"
            >
              <p className="text-[14px] font-semibold">
                {p.name} <span className="text-[var(--accent)]">↗</span>
              </p>
              <p className="mt-0.5 text-[13px] text-[var(--text-secondary)]">{p.blurb}</p>
              <p className="mt-0.5 text-[12px] text-[var(--text-secondary)]">{p.role}</p>
            </a>
          </li>
        ))}
      </ul>
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
