// Single source of truth for all portfolio content.
// Every skin consumes this — write once, render N ways. (DESIGN-SYSTEM §5, §9)

export type SectionId = "work" | "about" | "settings" | "contact";

export interface Hero {
  name: string;
  role: string;
  thesis: string;
  location: string;
  cta: { label: string; href: string };
}

export interface Brand {
  /** Logo file in /public. Omit to fall back to an initials monogram. */
  logo?: string;
  /** The asset already reads against the tile — a square mark with its own
      background, or a light-on-dark wordmark — so it skips the light plate. */
  bleed?: boolean;
  /** Gradient stops, both sampled from the logo. */
  from: string;
  to: string;
  /** Foreground that reads on the gradient (monogram, overlay text). */
  on: string;
}

export interface CaseStudy {
  slug: string;
  /** Company / product name — the card headline. */
  title: string;
  /** One-line product descriptor. */
  summary: string;
  /** Title held at the company. */
  role: string;
  /** Date range, e.g. "Sep 2025 — Present". */
  year: string;
  location: string;
  /** Headline technologies shown on the card. */
  tags: string[];
  /** What the product is and the situation walked into. */
  context: string;
  /** What was actually shipped. */
  highlights: string[];
  /** The measurable result. */
  outcome: string;
  /** Full technology list for the detail view. */
  stack: string[];
  /** Live product link, when public. */
  href?: string;
  /** Logo asset + colors sampled from it — no invented palettes. */
  brand: Brand;
}

export interface Project {
  name: string;
  blurb: string;
  role: string;
  href: string;
}

export interface SkillGroup {
  title: string;
  items: string[];
}

export interface Fact {
  label: string;
  value: string;
}

export interface About {
  bio: string[];
  skillGroups: SkillGroup[];
  facts: Fact[];
  /** Initials shown in the avatar. */
  initials: string;
}

export interface ContactLink {
  label: string;
  value: string;
  href: string;
}

export interface Contact {
  email: string;
  resumeHref: string;
  blurb: string;
  links: ContactLink[];
}

export interface PortfolioContent {
  hero: Hero;
  work: CaseStudy[];
  projects: Project[];
  about: About;
  contact: Contact;
}

export const content: PortfolioContent = {
  hero: {
    name: "Imoleayo Adebanjo",
    role: "Frontend Engineer",
    thesis:
      "5 years shipping production web applications in commerce, payments, and cinema — TypeScript, React, and Next.js, from first commit to live users.",
    location: "Lagos, Nigeria",
    cta: { label: "See selected work", href: "#work" },
  },

  work: [
    {
      slug: "yadsale",
      title: "Yadsale",
      summary:
        "Social commerce marketplace with escrow-backed payments and courier delivery.",
      role: "Frontend Engineer",
      year: "Sep 2025 — Present",
      location: "Lagos, Nigeria (Remote)",
      tags: ["Next.js 16", "React 19", "TypeScript", "TanStack Query"],
      context:
        "A social commerce marketplace where strangers transact: buyers negotiate offers, pay into escrow, choose a courier, and the seller is paid out automatically on delivery confirmation. Trust is the product, so the payment path and the browse experience both had to feel unimpeachable.",
      highlights: [
        "Built the end-to-end escrow payment system — offer negotiation, checkout, courier selection, and automated payout on delivery confirmation — now the company's flagship differentiator and the foundation of buyer trust on the platform.",
        "Eliminated scroll-freezing on mid-range Android devices by rearchitecting video playback in the marketplace feed to render only visible previews, converting a stuttering browse experience into smooth 60fps scrolling for the majority of users.",
        "Reduced layout shift to near zero by moving feed layout calculation to server-side rendering, removing the visible content reflow that occurred on every page load.",
        "Established the frontend data-fetching architecture and enforced it with automated CI checks that block non-compliant code at merge, standardizing 130+ reusable hooks and cutting onboarding time for new engineers.",
        "Increased page resilience during backend outages by implementing SSR with graceful client-side fallback, converting hard error pages into degraded-but-functional experiences.",
        "Built the technical SEO and social sharing layer with auto-generated Open Graph preview cards, improving search indexing across all pages and increasing click-through on shared listings.",
      ],
      outcome:
        "The escrow flow became the company's flagship differentiator, the feed scrolls at 60fps on mid-range Android with near-zero layout shift, and 130+ standardized hooks are enforced at merge.",
      stack: [
        "Next.js 16",
        "React 19",
        "TypeScript",
        "TanStack Query",
        "Jotai",
        "Formik",
        "Yup",
        "Tailwind CSS",
        "Paystack",
        "Mapbox",
        "Sentry",
        "PostHog",
      ],
      href: "https://www.yadsale.com/",
      brand: {
        logo: "/yadsale-logo.svg",
        from: "#013335",
        to: "#009834",
        on: "#ffffff",
      },
    },
    {
      slug: "korin-ai",
      title: "Korin AI",
      summary:
        "AI platform generating indigenous African music genres on a proprietary model.",
      role: "Lead Frontend Engineer",
      year: "Apr 2025 — Sep 2025",
      location: "Lagos, Nigeria",
      tags: ["Next.js 15", "React 19", "Redux Toolkit", "Web Audio API"],
      context:
        "A generative music platform for indigenous African genres, running long AI jobs on a proprietary model with no WebSocket support. I was the sole frontend engineer, owning everything from the generation interface to auth hardening and the deployment pipeline.",
      highlights: [
        "Led frontend development as sole frontend engineer, designing and delivering the core music generation interface — genre, mood, vocals, and lyrics configuration — contributing directly to a 50% increase in platform adoption.",
        "Engineered an adaptive job-polling system for long-running AI generation tasks without WebSocket support, distinguishing transient network failures from genuine errors and consolidating status into a single progress indicator; now powers 9 additional platform tools.",
        "Built a persistent global audio player mounted above the router, eliminating playback interruption on navigation and resolving an entire class of race-condition errors during buffering.",
        "Implemented abuse-resistant play tracking with server-side validation, counting plays once at 50% completion to prevent artificially inflated streaming metrics used for artist payouts.",
        "Hardened authentication by moving access tokens into AES-encrypted httpOnly cookies inaccessible to client JavaScript, and added mutex-guarded token refresh to prevent request storms under concurrent 401 responses.",
        "Drove a code-quality initiative reducing blocking lint errors from 7 to 0, uncovering and fixing 2 latent production bugs, and established CSP headers and an automated deployment pipeline on AWS Amplify.",
      ],
      outcome:
        "50% increase in platform adoption; the polling system now powers 9 additional platform tools, and blocking lint errors went from 7 to 0 — surfacing 2 latent production bugs on the way.",
      stack: [
        "Next.js 15",
        "React 19",
        "TypeScript",
        "Redux Toolkit",
        "RTK Query",
        "Tailwind CSS",
        "React Hook Form",
        "Yup",
        "Web Audio API",
        "Paystack",
        "AWS Amplify",
      ],
      href: "https://usekorinai.com/",
      // A white wordmark, so it sits straight on the dark tile — no light plate.
      brand: {
        logo: "/korin-logo.webp",
        bleed: true,
        from: "#0d0d10",
        to: "#2b2b35",
        on: "#ffffff",
      },
    },
    {
      slug: "fusion-intelligence",
      title: "Fusion Intelligence Technologies",
      summary:
        "Cinema technology suite (Reach Cinema / FilmX) serving 55% of West African cinemas.",
      role: "Frontend Engineer and Team Lead",
      year: "Jul 2021 — Apr 2025",
      location: "Lagos, Nigeria",
      tags: ["Next.js", "TypeScript", "Redux Toolkit", "Docker"],
      context:
        "A cinema technology suite — booking sites, distributor control plane, scheduling, and point of sale — used by more than half of West African cinemas. I joined as a frontend engineer and grew into leading a team of 7 across six production applications.",
      highlights: [
        "Led and mentored a team of 7 engineers across six production applications, defining shared architecture, running code review, and coordinating independent release cadences.",
        "Reduced manual data entry by approximately 90% across cinema sites by leading a team of 4 to migrate scheduling and reporting workflows from spreadsheets into the product.",
        "Cut weekly showtime scheduling from 2 hours to 12 minutes per location by building a drag-and-drop scheduler with automated conflict detection and bulk duplication across dates and venues.",
        "Increased online bookings by 25% and conversion rate by 15% by rebuilding the booking funnel with a mobile-optimized seat map and shareable, back-button-safe route segments.",
        "Reduced production defects by approximately 20% by introducing the organization's first automated testing — 29 Vitest and React Testing Library suites covering booking and payment flows with SonarQube coverage reporting.",
        "Decreased CI build times and cloud compute costs by rearchitecting the Docker image as a two-stage build with a lockfile-keyed dependency layer, skipping dependency reinstalls on source-only changes.",
        "Enabled zero-engineer onboarding for new cinema partners by building self-service microsite provisioning as a reload-resilient state machine.",
        "Prevented revenue loss during network outages by building an offline-first point-of-sale terminal that queues transactions locally and replays them idempotently on reconnection.",
      ],
      outcome:
        "25% more online bookings and 15% higher conversion, ~90% less manual data entry, ~20% fewer production defects, and weekly scheduling cut from 2 hours to 12 minutes per location.",
      stack: [
        "Next.js 12–15",
        "React 18/19",
        "TypeScript",
        "Redux Toolkit",
        "RTK Query",
        "TanStack Query",
        "react-dnd",
        "Vitest",
        "Docker",
        "CapRover",
        "HashiCorp Vault",
        "SonarQube",
        "Paystack",
      ],
      href: "https://filmx-web.fusionintel.io/login",
      brand: {
        logo: "/fusion-logo1.webp",
        from: "#d5121b",
        to: "#f59b0b",
        on: "#ffffff",
      },
    },
    {
      slug: "climate-mind",
      title: "Climate Mind",
      summary:
        "Nonprofit platform connecting climate impacts and solutions to user values.",
      role: "Frontend Engineer (Open Source)",
      year: "Jun 2021 — Oct 2021",
      location: "San Francisco, USA (Remote)",
      tags: ["React", "TypeScript", "PWA", "Open Source"],
      context:
        "An open-source nonprofit platform that maps climate impacts and solutions onto a visitor's personal values, maintained by a distributed group of 20 contributors and reaching users on low-bandwidth mobile connections.",
      highlights: [
        "Improved accessibility for low-bandwidth mobile users by implementing Progressive Web App features including installability and an offline application shell.",
        "Translated Figma designs into reusable React and TypeScript components within a codebase maintained by 20 contributors.",
        "Reviewed pull requests on the maintainer rotation and strengthened the code review checklist, catching prop-type and state-shape defects before merge.",
      ],
      outcome:
        "Shipped an installable, offline-capable PWA into a 20-contributor open-source codebase, with a review checklist that caught prop-type and state-shape defects before merge.",
      stack: ["React", "TypeScript", "Docker", "Jira"],
      href: "https://climatemind.org/",
      // The mark ships on its own dark teal, so the tile matches it exactly and the
      // logo bleeds seamlessly instead of sitting in a visible box.
      brand: {
        logo: "/climate-mind-logo2.png",
        bleed: true,
        from: "#143434",
        to: "#143434",
        on: "#ffffff",
      },
    },
    {
      slug: "gomycode",
      title: "GoMyCode",
      summary: "Technology education platform.",
      role: "Software Developer (Intern)",
      year: "Oct 2020 — Mar 2021",
      location: "Lagos, Nigeria",
      tags: ["React", "Node.js", "Express.js", "MongoDB"],
      context:
        "A technology education platform where I worked across the stack alongside a senior engineer — building API endpoints, modernizing the React client, and coordinating the cohort capstone.",
      highlights: [
        "Developed REST API endpoints in Node.js and Express against MongoDB, collaborating with a senior engineer on database schema design.",
        "Refactored a class-based React application to hooks with centralized state management, eliminating prop drilling that had slowed feature delivery.",
        "Coordinated a cross-functional team of 7 to deliver the cohort capstone project on schedule.",
      ],
      outcome:
        "Delivered the cohort capstone on schedule with a 7-person cross-functional team, on a React codebase modernized to hooks and centralized state.",
      stack: ["JavaScript", "React", "Node.js", "Express.js", "MongoDB"],
      brand: {
        logo: "/Gomycode-logo1.svg",
        from: "#171717",
        to: "#e60a14",
        on: "#ffffff",
      },
    },
  ],

  projects: [
    {
      name: "Yadsale",
      blurb:
        "Social commerce marketplace with escrow-backed payments and courier delivery.",
      role: "Offer-to-payout flow, mobile marketplace feed, admin console.",
      href: "https://www.yadsale.com/",
    },
    {
      name: "Korin AI",
      blurb: "AI music generation platform for African genres.",
      role: "Led frontend: generation pipeline, adaptive job polling, global audio player, in-browser recording and trimming.",
      href: "https://usekorinai.com/",
    },
    {
      name: "FilmX",
      blurb:
        "Distributor control plane covering 1,000+ titles for 55% of West African cinemas.",
      role: "Led a team of 4.",
      href: "https://filmx-web.fusionintel.io/login",
    },
    {
      name: "Ebonylife Cinemas",
      blurb:
        "Cinema booking platform with seat selection, loyalty program, and vouchers.",
      role: "Booking funnel, seat map, technical SEO.",
      href: "https://ebonylifecinemas.com/",
    },
    {
      name: "Nile Cinemas",
      blurb: "Cinema booking platform with seat allocation.",
      role: "Booking experience and technical SEO.",
      href: "https://nilecinemas.reachcinema.io/",
    },
    {
      name: "Filmhub",
      blurb: "Landing page and signup flow for a community cinema platform.",
      role: "Built independently.",
      href: "https://filmhub.ng/",
    },
    {
      name: "Climate Mind",
      blurb: "Open-source climate education Progressive Web App.",
      role: "PWA shell and component library, built with 20 contributors.",
      href: "https://climatemind.org/",
    },
  ],

  about: {
    initials: "IA",
    bio: [
      "I'm a frontend engineer in Lagos with 5+ years building and shipping production web applications in commerce, payments, and cinema operations. I work in TypeScript, React, and Next.js, and I own the full delivery cycle — architecture, testing, CI/CD, and deployment.",
      "I've taken three products from initial commit to live users and led a team of 7 engineers across six production applications. The work I'm proudest of is the unglamorous kind: an escrow flow people trust with their money, a feed that stops stuttering on a mid-range Android, a point-of-sale terminal that keeps selling tickets when the network drops.",
      "Most of my impact shows up as numbers someone else cares about — 25% more online bookings, 90% less manual data entry, 20% fewer production defects. I like ambiguous problems, tight feedback loops, and shipping things people use every day.",
    ],
    facts: [
      { label: "Based in", value: "Lagos, Nigeria" },
      { label: "Experience", value: "5+ years, frontend engineering" },
      { label: "Currently", value: "Frontend Engineer at Yadsale" },
      { label: "Education", value: "BSc Applied Botany, University of Lagos" },
    ],
    skillGroups: [
      {
        title: "Languages & Frameworks",
        items: [
          "TypeScript",
          "JavaScript (ES6+)",
          "React",
          "Next.js",
          "Node.js",
          "Express.js",
          "HTML5",
          "CSS3",
        ],
      },
      {
        title: "State & Data",
        items: [
          "Redux Toolkit",
          "RTK Query",
          "TanStack Query",
          "Jotai",
          "Redux Persist",
          "REST APIs",
          "GraphQL",
          "WebSockets",
        ],
      },
      {
        title: "UI & Styling",
        items: [
          "Tailwind CSS",
          "shadcn/ui",
          "Radix UI",
          "HeroUI",
          "Framer Motion",
          "Material UI",
          "Responsive Design",
          "Accessibility (WCAG)",
        ],
      },
      {
        title: "Forms & Validation",
        items: ["React Hook Form", "Formik", "Yup", "Zod"],
      },
      {
        title: "Testing & Code Quality",
        items: [
          "Vitest",
          "Jest",
          "React Testing Library",
          "SonarQube",
          "ESLint",
          "Prettier",
          "Husky",
          "Code Review",
        ],
      },
      {
        title: "DevOps & Cloud",
        items: [
          "Docker",
          "CI/CD",
          "GitHub Actions",
          "CapRover",
          "AWS (Amplify, S3)",
          "HashiCorp Vault",
          "Vercel",
          "Nginx",
        ],
      },
      {
        title: "Performance & Monitoring",
        items: [
          "Core Web Vitals",
          "SSR / SSG",
          "Lazy Loading",
          "Caching",
          "Sentry",
          "PostHog",
          "Google Analytics",
        ],
      },
      {
        title: "Integrations",
        items: [
          "Paystack",
          "Nomba",
          "Mapbox",
          "MongoDB",
          "Web Audio API",
          "OAuth",
          "JWT Auth",
        ],
      },
      {
        title: "Practices",
        items: [
          "Agile / Scrum",
          "Git",
          "Jira",
          "Figma",
          "Technical SEO",
          "PWA",
          "Mentoring",
          "Technical Leadership",
        ],
      },
    ],
  },

  contact: {
    email: "imoleadebanjo97@gmail.com",
    resumeHref:
      "https://drive.google.com/file/d/1gq4oej0ufDvKDTbaMWZ8aLzKyd3V8mHc/view?usp=sharing",
    blurb:
      "Open to frontend and lead frontend roles, and happy to talk through anything in commerce, payments, or real-time interfaces.",
    links: [
      {
        label: "Email",
        value: "imoleadebanjo97@gmail.com",
        href: "mailto:imoleadebanjo97@gmail.com",
      },
      { label: "GitHub", value: "@imole97", href: "https://github.com/imole97" },
      {
        label: "LinkedIn",
        value: "in/imole97",
        href: "https://www.linkedin.com/in/imole97",
      },
    ],
  },
};

export const sectionMeta: Record<
  SectionId,
  { label: string; emoji: string; title: string }
> = {
  work: { label: "Work", emoji: "🗂️", title: "Experience" },
  about: { label: "About", emoji: "👤", title: "About Me" },
  settings: { label: "Settings", emoji: "⚙️", title: "Settings" },
  // 📇, not ✉️ — the envelope belongs to the Email launcher/mailto action, and the
  // two shouldn't read as the same destination.
  contact: { label: "Contact", emoji: "📇", title: "Contact" },
};
