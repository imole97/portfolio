"use client";

// Experience list -> role detail with the signature connected animation. (DESIGN-SYSTEM §7)
// A thumbnail flies from the list into the detail header.

import { useEffect, useRef, useState } from "react";
import { content, type CaseStudy } from "@/lib/content";
import { useSkin } from "@/components/SkinProvider";
import { captureFlip, connectedAnimation, entranceSlide } from "@/lib/motion/fluent";
import { BrandMark, brandTint } from "@/components/BrandMark";
import { FluentCard } from "../FluentCard";

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
      <article className="fl-work-detail max-w-3xl" style={{ color: "var(--fl-text)" }}>
        <button
          onClick={back}
          className="mb-4 inline-flex items-center gap-2 rounded-[var(--fl-radius-sm)] px-3 py-1.5 text-[13px] font-medium"
          style={{ border: "1px solid var(--fl-stroke-strong)" }}
        >
          ← Back
        </button>

        <div className="flex items-center gap-4">
          <BrandMark
            data-flip-id={`fl-cover-${active.slug}`}
            brand={active.brand}
            name={active.title}
            logoHeight={18}
            className="h-20 w-32 shrink-0 rounded-[var(--fl-radius)]"
          />
          <div>
            <h2 className="text-2xl font-semibold">{active.title}</h2>
            <p className="text-[15px] font-medium" style={{ color: "var(--fl-accent)" }}>
              {active.role}
            </p>
            <p className="text-[13px]" style={{ color: "var(--fl-text-secondary)" }}>
              {active.year} · {active.location}
            </p>
          </div>
        </div>

        <p className="mt-3 text-[15px]" style={{ color: "var(--fl-text-secondary)" }}>
          {active.summary}
        </p>
        {active.href && (
          <a
            href={active.href}
            target="_blank"
            rel="noreferrer"
            className="mt-1 inline-block text-[13px] font-medium hover:underline"
            style={{ color: "var(--fl-accent)" }}
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
                className="rounded-[var(--fl-radius-sm)] px-2.5 py-1 text-[12px]"
                style={{ background: brandTint(active.brand), color: "var(--fl-text)" }}
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
    <div style={{ color: "var(--fl-text)" }}>
      {/* Two columns max: these render inside a ~760px Fluent window, and Tailwind's
          viewport-keyed breakpoints (xl:) would otherwise cram 3 columns into it. */}
      <div ref={listRef} className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        {content.work.map((study) => (
          <FluentCard key={study.slug} onClick={() => open(study)} className="fl-work-card">
            <BrandMark
              data-flip-id={`fl-cover-${study.slug}`}
              brand={study.brand}
              name={study.title}
              logoHeight={22}
              className="h-24 w-full"
            />
            <div className="p-3.5" style={{ borderTop: `2px solid ${study.brand.to}` }}>
              <p className="text-[12px]" style={{ color: "var(--fl-text-secondary)" }}>
                {study.year}
              </p>
              <h3 className="mt-1 text-[15px] font-semibold leading-snug">{study.title}</h3>
              <p className="text-[13px] font-medium" style={{ color: "var(--fl-accent)" }}>
                {study.role}
              </p>
              <p className="mt-1.5 text-[13px]" style={{ color: "var(--fl-text-secondary)" }}>
                {study.summary}
              </p>
              <div className="mt-2.5 flex flex-wrap gap-1.5">
                {study.tags.slice(0, 3).map((t) => (
                  <span
                    key={t}
                    className="rounded-[var(--fl-radius-sm)] px-2 py-0.5 text-[11px]"
                    style={{ background: brandTint(study.brand, 18), color: "var(--fl-text)" }}
                  >
                    {t}
                  </span>
                ))}
              </div>
            </div>
          </FluentCard>
        ))}
      </div>

      <h3
        className="mb-3 mt-7 text-[13px] font-semibold uppercase tracking-wide"
        style={{ color: "var(--fl-text-secondary)" }}
      >
        Selected projects
      </h3>
      <div className="fluent-card max-w-3xl overflow-hidden">
        <ul>
          {content.projects.map((p, i) => (
            <li key={p.name} style={{ borderTop: i === 0 ? undefined : "1px solid var(--fl-stroke)" }}>
              <a
                href={p.href}
                target="_blank"
                rel="noreferrer"
                className="block px-4 py-3 transition-colors hover:bg-[var(--fl-subtle-hover)]"
              >
                <p className="text-[15px] font-semibold">
                  {p.name} <span style={{ color: "var(--fl-accent)" }}>↗</span>
                </p>
                <p className="mt-0.5 text-[13px]" style={{ color: "var(--fl-text-secondary)" }}>
                  {p.blurb}
                </p>
                <p className="mt-0.5 text-[12px]" style={{ color: "var(--fl-text-secondary)" }}>
                  {p.role}
                </p>
              </a>
            </li>
          ))}
        </ul>
      </div>
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
