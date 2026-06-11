# Adaptive OS Portfolio

A portfolio that wears the native skin of whatever device it's viewed on. It detects the
visitor's OS + form factor and renders a native-feeling shell — the content stays constant,
only the chrome, motion, and materials adapt. See [`DESIGN-SYSTEM.md`](./DESIGN-SYSTEM.md).

**Stack:** Next.js (App Router) · Tailwind CSS v4 · GSAP · TypeScript.

## Status

- **Shared spine:** typed content model, OS/form-factor resolver, `SkinProvider` (hydration-safe,
  override + reduced-motion aware), shared tokens, neutral-SSR → resolved-skin fade-in,
  code-split skin loading.
- **Apple Liquid Glass (macOS · iPhone · iPad):** shared glass material + liquid-settle/Flip motion
  across three form factors.
  - **macOS desktop:** wallpaper, translucent menu bar, magnify-on-hover dock, draggable/resizable
    glass windows with traffic lights, ⌘K Spotlight.
  - **iPhone (iOS):** single column, collapse-on-scroll large title, floating glass tab bar,
    safe-area insets.
  - **iPad (iPadOS):** two-pane sidebar + detail in landscape, single column with a popover sidebar
    in portrait.
- **Android skin (Material You):** runtime **dynamic color** (seed any hue via `?seed=1B6C3A`),
  Roboto Flex, tonal surfaces, adaptive chrome (bottom nav + FAB on mobile, navigation rail on
  tablet/expanded), flexible top app bar that collapses on scroll, press ripples, and the
  signature **container transform** work→detail reveal.
- **Windows skin (Fluent / Mica):** Mica app background, Acrylic search flyout, pointer-driven
  reveal highlight, Segoe UI Variable, a Mica title bar with caption buttons, a collapsible
  NavigationView (expanded pane ↔ icon rail), a command bar with ⌘K search, and the signature
  **connected animation** (thumbnail flies into the detail header).
- **Settings + appearance (all skins):** every skin has a native **Settings** destination (replaces
  Play) with a light / dark / automatic **appearance** switch — a persisted, manual theme override
  (`data-theme`) layered over `prefers-color-scheme`, applied across all skins. The **Apple** skins
  (macOS · iPhone · iPad) and **Android** also have a **wallpaper picker** backed by real image
  wallpapers rendered behind the chrome (macOS: Sonoma · Ventura · Big Sur; iPhone: Aurora · Neon;
  iPad: Sequoia · Air; Android: Petals · Bloom · Spectrum · Mist · One UI). On **Android**, choosing a
  wallpaper also re-seeds **Material You dynamic color** from it — the whole palette adapts. Wallpaper
  choice is stored **per skin** so each device keeps its own; theme + wallpapers persist in
  `localStorage`. (Windows wallpaper is a follow-up.)
- **Skin routing:** Apple → iOS / iPadOS / macOS by form factor; Android → Material (adapts up to
  expanded layouts); Windows → Fluent (scales down to a compact icon rail); unknown/Linux desktops
  fall back to macOS. All five skins are code-split and selectable live via the corner switcher.

## Develop

```bash
pnpm install
pnpm dev      # http://localhost:3000
pnpm build    # production build
pnpm lint
pnpm test     # resolveSkin unit tests (Vitest)
```

## Editing content

All portfolio copy lives in one typed file: [`src/lib/content.ts`](./src/lib/content.ts).
Swap the placeholder hero, case studies, about, play, and contact data — every skin reads from it.

## Structure

```
src/
  app/{layout,page}.tsx        neutral SSR + SkinProvider, renders ConcreteAppShell
  lib/
    content.ts                 single source of truth for all copy
    resolveSkin.ts             pure OS/form-factor → skin resolver (unit-tested)
    motion/apple.ts            GSAP timeline factory (liquid settle, Flip, dock magnify)
  components/
    SkinProvider.tsx           SkinContext: skin, os, formFactor, reducedMotion, override
    ConcreteAppShell.tsx       lazily loads the resolved skin's shell (code-split)
    SkinSwitcher.tsx           subtle corner pill to try other skins
    skins/apple/               AppleShell, Window, Dock, MenuBar, Spotlight, GlassCard, sections/
  styles/
    tokens.css                 shared spine tokens
    skins/apple.css            Apple Liquid Glass variables (light + dark)
```

## Deploy

Targets Vercel — push the repo and import it; the default Next.js build settings work as-is.
