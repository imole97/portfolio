// Single source of truth for all portfolio content.
// Every skin consumes this — write once, render N ways. (DESIGN-SYSTEM §5, §9)
// Swap the placeholder copy below for your real details; the shape stays the same.

export type SectionId = "work" | "about" | "settings" | "contact";

export interface Hero {
  name: string;
  role: string;
  thesis: string;
  cta: { label: string; href: string };
}

export interface CaseStudy {
  slug: string;
  title: string;
  summary: string;
  role: string;
  year: string;
  tags: string[];
  problem: string;
  process: string[];
  outcome: string;
  /** Accent hue (deg) used to tint the placeholder cover gradient. */
  hue: number;
}

export interface About {
  bio: string[];
  skills: string[];
  tools: string[];
  /** Initials shown in the placeholder avatar. */
  initials: string;
}

export interface Experiment {
  title: string;
  blurb: string;
  href: string;
  emoji: string;
}

export interface ContactLink {
  label: string;
  value: string;
  href: string;
}

export interface Contact {
  email: string;
  resumeHref: string;
  links: ContactLink[];
}

export interface PortfolioContent {
  hero: Hero;
  work: CaseStudy[];
  about: About;
  play: Experiment[];
  contact: Contact;
}

export const content: PortfolioContent = {
  hero: {
    name: "Imoleayo Adebanjo",
    role: "Product Engineer & Interaction Designer",
    thesis:
      "I build interfaces that feel native to the device they live on — and quietly impressive everywhere else.",
    cta: { label: "See selected work", href: "#work" },
  },

  work: [
    {
      slug: "atlas-analytics",
      title: "Atlas — Realtime Analytics Console",
      summary:
        "A streaming analytics dashboard handling 2M events/min with sub-100ms query feedback.",
      role: "Lead frontend engineer · design systems",
      year: "2025",
      tags: ["React", "WebSockets", "Data viz", "Design system"],
      problem:
        "Operators were flying blind during incidents: the legacy console refreshed every 30s and buckled under load, so the team made critical calls on stale data.",
      process: [
        "Profiled the render pipeline and replaced polling with a backpressured WebSocket stream.",
        "Designed a virtualized timeline + heatmap that stays at 60fps with 50k live rows.",
        "Built a token-driven theming layer so the console matched each customer's brand.",
      ],
      outcome:
        "Median time-to-detect dropped 4×, and the console became the flagship in three enterprise deals.",
      hue: 212,
    },
    {
      slug: "harbor-payments",
      title: "Harbor — Cross-border Payments",
      summary:
        "Rebuilt the checkout flow for a fintech moving money across 40 currencies.",
      role: "Senior engineer · checkout & motion",
      year: "2024",
      tags: ["Next.js", "Stripe", "GSAP", "i18n"],
      problem:
        "A 5-step checkout with a 38% drop-off. Users distrusted the FX rates because the math felt hidden.",
      process: [
        "Collapsed five steps into one progressively-disclosed surface.",
        "Animated the live FX conversion so users watched the number resolve in real time.",
        "Localized currency, date, and number formatting end to end.",
      ],
      outcome:
        "Drop-off fell to 19% and support tickets about 'surprise fees' effectively vanished.",
      hue: 152,
    },
    {
      slug: "verdant-os",
      title: "Verdant — Greenhouse Control OS",
      summary:
        "A touch-first control surface for industrial greenhouses, used on the floor daily.",
      role: "Founding designer-engineer",
      year: "2024",
      tags: ["IoT", "Touch UI", "Offline-first", "PWA"],
      problem:
        "Growers wore gloves and worked offline in humid rooms; existing tablet apps were unusable in those conditions.",
      process: [
        "Designed oversized, high-contrast touch targets validated with gloved testing.",
        "Built an offline-first sync engine that reconciles on reconnect.",
        "Shipped as an installable PWA so there was no app-store friction.",
      ],
      outcome:
        "Adoption hit 90% of floor staff in six weeks; manual logging errors dropped by half.",
      hue: 96,
    },
    {
      slug: "lumen-docs",
      title: "Lumen — Collaborative Docs",
      summary:
        "A real-time collaborative editor with presence, comments, and offline conflict resolution.",
      role: "Frontend lead",
      year: "2023",
      tags: ["CRDT", "TypeScript", "Editor", "Realtime"],
      problem:
        "Teams lost work to merge conflicts and couldn't tell who was editing what, when.",
      process: [
        "Integrated a CRDT layer for conflict-free concurrent editing.",
        "Designed ambient presence cues that never stole focus from writing.",
        "Built a comment threading model that survived heavy concurrent edits.",
      ],
      outcome:
        "Concurrent-edit complaints went to zero; daily active editing time grew 2.3×.",
      hue: 276,
    },
    {
      slug: "north-star-design",
      title: "North Star — Design System",
      summary:
        "A cross-platform design system adopted by 40 engineers across web, iOS, and Android.",
      role: "Design systems architect",
      year: "2023",
      tags: ["Tokens", "Storybook", "A11y", "Theming"],
      problem:
        "Three platform teams shipped three different-looking products from the same brand.",
      process: [
        "Defined a single token spine consumed by every platform.",
        "Automated token sync from Figma to code with a CI pipeline.",
        "Baked WCAG AA contrast checks into the component test suite.",
      ],
      outcome:
        "Visual consistency scores jumped, and new-feature UI build time dropped ~40%.",
      hue: 28,
    },
    {
      slug: "tideline-maps",
      title: "Tideline — Coastal Mapping",
      summary:
        "An interactive map of tidal data for kayakers, with buttery pan/zoom on low-end phones.",
      role: "Engineer · performance & motion",
      year: "2022",
      tags: ["WebGL", "Mapbox", "Performance", "Mobile"],
      problem:
        "The map stuttered on the mid-range phones most paddlers actually carry.",
      process: [
        "Moved tile compositing to WebGL and tiered the data by zoom.",
        "Hand-tuned the gesture physics so momentum felt natural.",
        "Added a reduced-data mode for spotty coastal coverage.",
      ],
      outcome:
        "Sustained 60fps on 4-year-old hardware; featured in two paddling communities.",
      hue: 192,
    },
  ],

  about: {
    initials: "IA",
    bio: [
      "I'm a product engineer who lives in the seam between design and code. I care about the small stuff — the spring on a sheet, the contrast of a label, the frame you dropped on a slow phone — because that's where products earn trust.",
      "Over the last eight years I've led frontend and design-systems work for fintech, dev tools, and industrial software. I like ambiguous problems, tight feedback loops, and shipping things people actually use every day.",
    ],
    skills: [
      "Frontend architecture",
      "Design systems",
      "Interaction & motion",
      "Accessibility",
      "Performance",
      "Prototyping",
    ],
    tools: [
      "TypeScript",
      "React / Next.js",
      "GSAP",
      "Tailwind",
      "Figma",
      "WebGL",
    ],
  },

  play: [
    {
      title: "Adaptive OS Portfolio",
      blurb: "This site — it wears the native skin of whatever device you open it on.",
      href: "#",
      emoji: "🪟",
    },
    {
      title: "Liquid Glass Playground",
      blurb: "A WebGL sandbox for specular, refractive glass materials in the browser.",
      href: "#",
      emoji: "🫧",
    },
    {
      title: "Type Specimen Generator",
      blurb: "Feed it any variable font; it prints a printable optical-size specimen.",
      href: "#",
      emoji: "🔡",
    },
    {
      title: "Tiny Synth",
      blurb: "A pocket WebAudio synth with a keyboard you can actually play.",
      href: "#",
      emoji: "🎹",
    },
  ],

  contact: {
    email: "onemole.97@gmail.com",
    resumeHref: "/resume.pdf",
    links: [
      { label: "Email", value: "onemole.97@gmail.com", href: "mailto:onemole.97@gmail.com" },
      { label: "GitHub", value: "@imoleayo", href: "https://github.com" },
      { label: "LinkedIn", value: "in/imoleayo", href: "https://linkedin.com" },
      { label: "Twitter / X", value: "@imoleayo", href: "https://x.com" },
    ],
  },
};

export const sectionMeta: Record<
  SectionId,
  { label: string; emoji: string; title: string }
> = {
  work: { label: "Work", emoji: "🗂️", title: "Selected Work" },
  about: { label: "About", emoji: "👤", title: "About Me" },
  settings: { label: "Settings", emoji: "⚙️", title: "Settings" },
  contact: { label: "Contact", emoji: "✉️", title: "Contact" },
};
