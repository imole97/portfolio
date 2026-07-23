"use client";

import { content } from "@/lib/content";

export function FluentContactSection() {
  const { contact } = content;
  return (
    <div className="max-w-2xl" style={{ color: "var(--fl-text)" }}>
      <p className="mb-5 text-[15px] leading-relaxed">{contact.blurb}</p>

      <a
        href={`mailto:${contact.email}`}
        className="mb-5 inline-flex items-center gap-2 rounded-[var(--fl-radius-sm)] px-4 py-2 font-medium text-white"
        style={{ background: "var(--fl-accent)" }}
      >
        ✉️ {contact.email}
      </a>

      <div className="fluent-card overflow-hidden">
        <ul>
          {contact.links.map((link, i) => (
            <li
              key={link.label}
              style={{ borderTop: i === 0 ? undefined : "1px solid var(--fl-stroke)" }}
            >
              <a
                href={link.href}
                target={link.href.startsWith("http") ? "_blank" : undefined}
                rel="noreferrer"
                className="flex items-center justify-between px-4 py-3 text-[15px] transition-colors hover:bg-[var(--fl-subtle-hover)]"
              >
                <span className="font-medium">{link.label}</span>
                <span style={{ color: "var(--fl-text-secondary)" }}>{link.value} ↗</span>
              </a>
            </li>
          ))}
        </ul>
      </div>

      <a
        href={contact.resumeHref}
        target="_blank"
        rel="noreferrer"
        className="mt-5 inline-flex items-center gap-2 rounded-[var(--fl-radius-sm)] px-4 py-2 text-[14px] font-medium"
        style={{ border: "1px solid var(--fl-stroke-strong)", color: "var(--fl-text)" }}
      >
        📄 View résumé ↗
      </a>
    </div>
  );
}
