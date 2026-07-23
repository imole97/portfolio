"use client";

// Experience list -> role detail using the signature container transform. (DESIGN-SYSTEM §7)

import { useEffect, useRef, useState } from "react";
import { content, type CaseStudy } from "@/lib/content";
import { useSkin } from "@/components/SkinProvider";
import { captureFlip, containerTransform, staggerReveal } from "@/lib/motion/material";
import { BrandMark, brandTint } from "@/components/BrandMark";
import { MaterialCard } from "../MaterialCard";

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
      <article className="md-work-detail" style={{ color: "var(--md-on-surface)" }}>
        <button
          onClick={back}
          className="mb-4 inline-flex items-center gap-2 rounded-[var(--md-radius-full)] px-4 py-2 text-[14px] font-medium"
          style={{ background: "var(--md-secondary-container)", color: "var(--md-on-secondary-container)" }}
        >
          ← Back
        </button>

        <BrandMark
          data-flip-id={`md-cover-${active.slug}`}
          brand={active.brand}
          name={active.title}
          logoHeight={34}
          className="mb-5 h-36 w-full rounded-[var(--md-radius-lg)]"
        />

        <h2 className="text-2xl font-semibold">{active.title}</h2>
        <p className="mt-1 text-[15px] font-medium" style={{ color: "var(--md-primary)" }}>
          {active.role}
        </p>
        <p className="mt-0.5 text-[13px]" style={{ color: "var(--md-on-surface-variant)" }}>
          {active.year} · {active.location}
        </p>
        {active.href && (
          <a
            href={active.href}
            target="_blank"
            rel="noreferrer"
            className="mt-2 inline-block text-[13px] font-medium underline"
            style={{ color: "var(--md-primary)" }}
          >
            Visit product ↗
          </a>
        )}

        <Block label="Context">
          <p>{active.context}</p>
        </Block>
        <Block label="What I shipped">
          <ul className="list-disc space-y-2 pl-5">
            {active.highlights.map((s) => (
              <li key={s}>{s}</li>
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
                className="rounded-[var(--md-radius-full)] px-3 py-1 text-[12px]"
                style={{ background: brandTint(active.brand), color: "var(--md-on-surface)" }}
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
    <div style={{ color: "var(--md-on-surface)" }}>
      <div ref={listRef} className="grid grid-cols-1 gap-4 md:grid-cols-2">
        {content.work.map((study) => (
          <MaterialCard
            key={study.slug}
            onClick={() => open(study)}
            className="md-work-card overflow-hidden p-0"
          >
            <BrandMark
              data-flip-id={`md-cover-${study.slug}`}
              brand={study.brand}
              name={study.title}
              logoHeight={24}
              className="h-24 w-full"
            />
            <div className="p-4" style={{ borderTop: `2px solid ${study.brand.to}` }}>
              <p className="text-[12px]" style={{ color: "var(--md-on-surface-variant)" }}>
                {study.year}
              </p>
              <h3 className="mt-1 text-[16px] font-semibold leading-snug">{study.title}</h3>
              <p className="text-[13px] font-medium" style={{ color: "var(--md-primary)" }}>
                {study.role}
              </p>
              <p className="mt-1.5 text-[14px]" style={{ color: "var(--md-on-surface-variant)" }}>
                {study.summary}
              </p>
              <div className="mt-2.5 flex flex-wrap gap-1.5">
                {study.tags.slice(0, 3).map((t) => (
                  <span
                    key={t}
                    className="rounded-[var(--md-radius-full)] px-2 py-0.5 text-[11px]"
                    style={{ background: brandTint(study.brand, 18), color: "var(--md-on-surface)" }}
                  >
                    {t}
                  </span>
                ))}
              </div>
            </div>
          </MaterialCard>
        ))}
      </div>

      <h3
        className="mb-3 mt-7 text-[13px] font-semibold uppercase tracking-wide"
        style={{ color: "var(--md-on-surface-variant)" }}
      >
        Selected projects
      </h3>
      <ul
        className="overflow-hidden rounded-[var(--md-radius-lg)]"
        style={{ background: "var(--md-surface-container)" }}
      >
        {content.projects.map((p, i) => (
          <li
            key={p.name}
            style={{ borderTop: i === 0 ? undefined : "1px solid var(--md-outline-variant)" }}
          >
            <a
              href={p.href}
              target="_blank"
              rel="noreferrer"
              className="block px-4 py-3 transition-opacity hover:opacity-70"
            >
              <p className="text-[15px] font-semibold">
                {p.name} <span style={{ color: "var(--md-primary)" }}>↗</span>
              </p>
              <p className="mt-0.5 text-[13px]" style={{ color: "var(--md-on-surface-variant)" }}>
                {p.blurb}
              </p>
              <p className="mt-0.5 text-[12px]" style={{ color: "var(--md-on-surface-variant)" }}>
                {p.role}
              </p>
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}

function Block({ label, children }: Readonly<{ label: string; children: React.ReactNode }>) {
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
