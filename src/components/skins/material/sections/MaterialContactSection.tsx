"use client";

import { content } from "@/lib/content";

export function MaterialContactSection() {
  const { contact } = content;
  return (
    <div>
      <p className="mb-5 text-[15px] leading-relaxed">
        Have a project, a role, or just a good idea? I&apos;d love to hear about it.
      </p>

      <a
        href={`mailto:${contact.email}`}
        className="mb-5 inline-flex items-center gap-2 rounded-[var(--md-radius-full)] px-5 py-3 font-medium"
        style={{ background: "var(--md-primary)", color: "var(--md-on-primary)" }}
      >
        ✉️ {contact.email}
      </a>

      <ul
        className="overflow-hidden rounded-[var(--md-radius-lg)]"
        style={{ background: "var(--md-surface-container)" }}
      >
        {contact.links.map((link) => (
          <li key={link.label} style={{ borderBottom: "1px solid var(--md-outline-variant)" }}>
            <a
              href={link.href}
              target={link.href.startsWith("http") ? "_blank" : undefined}
              rel="noreferrer"
              className="flex items-center justify-between px-4 py-3.5 text-[15px] transition-opacity hover:opacity-70"
            >
              <span className="font-medium">{link.label}</span>
              <span style={{ color: "var(--md-on-surface-variant)" }}>{link.value} ↗</span>
            </a>
          </li>
        ))}
      </ul>

      <a
        href={contact.resumeHref}
        className="mt-5 inline-flex items-center gap-2 rounded-[var(--md-radius-full)] px-5 py-2.5 text-[14px] font-medium"
        style={{ border: "1px solid var(--md-outline)", color: "var(--md-on-surface)" }}
      >
        ⬇ Download résumé
      </a>
    </div>
  );
}
