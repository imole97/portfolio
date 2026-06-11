"use client";

import { content } from "@/lib/content";

export function ContactSection() {
  const { contact } = content;
  return (
    <div>
      <p className="mb-5 text-[15px] leading-relaxed">
        Have a project, a role, or just a good idea? I&apos;d love to hear about it.
      </p>

      <a
        href={`mailto:${contact.email}`}
        className="mb-5 inline-flex items-center gap-2 rounded-[var(--radius-pill)] bg-[var(--accent)] px-5 py-2.5 font-medium text-white"
      >
        ✉️ {contact.email}
      </a>

      <ul className="divide-y" style={{ borderColor: "var(--separator)" }}>
        {contact.links.map((link) => (
          <li key={link.label}>
            <a
              href={link.href}
              target={link.href.startsWith("http") ? "_blank" : undefined}
              rel="noreferrer"
              className="flex items-center justify-between py-3 text-[15px] transition-opacity hover:opacity-70"
            >
              <span className="font-medium">{link.label}</span>
              <span className="text-[var(--text-secondary)]">{link.value} ↗</span>
            </a>
          </li>
        ))}
      </ul>

      <a
        href={contact.resumeHref}
        className="mt-5 inline-flex items-center gap-2 rounded-[var(--radius-button)] px-4 py-2 text-[14px] font-medium"
        style={{ border: "1px solid var(--separator)" }}
      >
        ⬇ Download résumé
      </a>
    </div>
  );
}
