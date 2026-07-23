// Always-present, semantic, crawlable rendering of the whole portfolio. The visual
// skins load client-side (ssr: false), so this server-rendered layer guarantees search
// engines, no-JS visitors, and assistive tech always get the real content — the same
// information the skins present, expressed as a clean document outline. It's visually
// hidden (sr-only) because the skins are the visual presentation; it is not hidden from
// crawlers or screen readers, and it is the same content, so it's an accessibility
// fallback, not cloaking.

import { content } from "@/lib/content";

export function SeoContent() {
  const { hero, work, projects, about, contact } = content;
  return (
    <div className="sr-only">
      <header>
        <h1>
          {hero.name} — {hero.role}
        </h1>
        <p>{hero.thesis}</p>
        <p>{hero.location}</p>
      </header>

      <section aria-label="About">
        <h2>About</h2>
        {about.bio.map((p) => (
          <p key={p.slice(0, 24)}>{p}</p>
        ))}
        <ul>
          {about.facts.map((f) => (
            <li key={f.label}>
              {f.label}: {f.value}
            </li>
          ))}
        </ul>
      </section>

      <section aria-label="Experience">
        <h2>Experience</h2>
        {work.map((role) => (
          <article key={role.slug}>
            <h3>
              {role.role} — {role.title}
            </h3>
            <p>
              {role.year} · {role.location}
            </p>
            <p>{role.summary}</p>
            <p>{role.context}</p>
            <ul>
              {role.highlights.map((h) => (
                <li key={h.slice(0, 32)}>{h}</li>
              ))}
            </ul>
            <p>{role.outcome}</p>
            <p>Stack: {role.stack.join(", ")}</p>
          </article>
        ))}
      </section>

      <section aria-label="Projects">
        <h2>Selected projects</h2>
        <ul>
          {projects.map((p) => (
            <li key={p.name}>
              <a href={p.href}>{p.name}</a> — {p.blurb} {p.role}
            </li>
          ))}
        </ul>
      </section>

      <section aria-label="Skills">
        <h2>Skills</h2>
        {about.skillGroups.map((g) => (
          <div key={g.title}>
            <h3>{g.title}</h3>
            <p>{g.items.join(", ")}</p>
          </div>
        ))}
      </section>

      <section aria-label="Contact">
        <h2>Contact</h2>
        <ul>
          <li>
            <a href={`mailto:${contact.email}`}>{contact.email}</a>
          </li>
          {contact.links.map((l) => (
            <li key={l.label}>
              <a href={l.href}>
                {l.label}: {l.value}
              </a>
            </li>
          ))}
          <li>
            <a href={contact.resumeHref}>Résumé</a>
          </li>
        </ul>
      </section>
    </div>
  );
}
