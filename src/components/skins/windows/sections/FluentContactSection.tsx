"use client";

import { content } from "@/lib/content";

export function FluentContactSection() {
  const { contact } = content;
  return (
    <div className="max-w-2xl">
      <p className="mb-5 text-[15px] leading-relaxed">
        Have a project, a role, or just a good idea? I&apos;d love to hear about it.
      </p>

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
    </div>
  );
}
