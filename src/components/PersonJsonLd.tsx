// Structured data (schema.org JSON-LD) so search engines and rich results understand
// who this is, what they do, and where else they live online. Emitted server-side in
// the document head. Person is the primary entity; WebSite ties the domain to it.

import { content } from "@/lib/content";
import { siteUrl } from "@/lib/site";

export function PersonJsonLd() {
  const sameAs = content.contact.links
    .filter((l) => l.href.startsWith("http"))
    .map((l) => l.href);

  const currentRole = content.work[0];
  const skills = content.about.skillGroups.flatMap((g) => g.items);

  const person = {
    "@type": "Person",
    "@id": `${siteUrl}/#person`,
    name: content.hero.name,
    givenName: content.hero.name.split(" ")[0],
    familyName: content.hero.name.split(" ").slice(1).join(" "),
    jobTitle: content.hero.role,
    description: content.hero.thesis,
    url: siteUrl,
    image: `${siteUrl}/og-image.png`,
    email: `mailto:${content.contact.email}`,
    address: {
      "@type": "PostalAddress",
      addressLocality: "Lagos",
      addressCountry: "NG",
    },
    worksFor: { "@type": "Organization", name: currentRole.title },
    alumniOf: {
      "@type": "CollegeOrUniversity",
      name: "University of Lagos",
    },
    knowsAbout: skills,
    sameAs,
  };

  const website = {
    "@type": "WebSite",
    "@id": `${siteUrl}/#website`,
    url: siteUrl,
    name: `${content.hero.name} — Portfolio`,
    description: content.hero.thesis,
    inLanguage: "en",
    publisher: { "@id": `${siteUrl}/#person` },
  };

  const graph = { "@context": "https://schema.org", "@graph": [person, website] };

  return (
    <script
      type="application/ld+json"
      // JSON-LD is a data island, not user input — safe to inline.
      dangerouslySetInnerHTML={{ __html: JSON.stringify(graph) }}
    />
  );
}
