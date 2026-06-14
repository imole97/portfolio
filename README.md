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
  - **iPhone (iOS):** an iOS **home screen** — status bar, content-driven widgets (featured work,
    about), an app-icon grid, a Search pill + page dots, and a frosted dock of the sections. Tapping
    an app opens it (single column, collapse-on-scroll large title, floating glass tab bar, safe-area
    insets) with a Home button to return.
  - **iPad (iPadOS):** an iPadOS **home screen** — status bar, content-driven widgets (live clock,
    featured work, about), an app-icon grid + page dots, a Spotlight pill, and a frosted dock. Tapping
    an app opens the portfolio app (two-pane sidebar + detail in landscape, popover sidebar in
    portrait) with a Home button to return.
- **Android skin (Material You):** a real **home-screen launcher** — status bar, an At-a-Glance
  date widget, an app-icon grid (sections + GitHub/LinkedIn/X/Résumé launchers), page dots, and a
  Google-style search-pill dock; tapping a section icon **opens it full-screen** (flexible top app
  bar that collapses on scroll + a Back affordance, system Back/Esc returns home). Runtime
  **dynamic color** (extracted from the wallpaper seed; seed any hue via `?seed=1B6C3A`), Roboto
  Flex, tonal surfaces, press ripples, and the signature **container transform** work→detail reveal.
- **Windows skin (Fluent / Mica):** a full **Windows 11 desktop** — wallpaper, a centered **taskbar**
  (Start button + pinned apps with running indicators + system-tray clock), and a **Start menu**
  (search, Pinned grid of sections + social/résumé launchers, Recommended, account + power). Sections
  open as **draggable Fluent windows** with Mica title bars and minimize/maximize/close caption
  buttons (sharing the macOS window manager), pointer-driven reveal highlights, Segoe UI Variable, and
  the signature **connected animation** (thumbnail flies into the detail header).
- **Settings + appearance (all skins):** every skin has a native **Settings** destination (replaces
  Play) with a light / dark / automatic **appearance** switch — a persisted, manual theme override
  (`data-theme`) layered over `prefers-color-scheme`, applied across all skins. **Every** skin also
  has a **wallpaper picker** backed by real image wallpapers rendered behind the chrome (macOS:
  Sonoma · Ventura · Big Sur; iPhone: Aurora · Neon; iPad: Sequoia · Air; Android: Petals · Bloom ·
  Spectrum · Mist · One UI; Windows: Bloom · Windows 7 · Bliss · Coast · Shore — the acrylic
  taskbar/Start menu blur it for the Mica look). On **Android**, choosing a wallpaper also re-seeds
  **Material You dynamic color** from it — the whole palette adapts. Wallpaper choice is stored **per
  skin** so each device keeps its own; theme + wallpapers persist in `localStorage`.
- **Search + battery (all skins):** one shared **search index** (`src/lib/search.ts`) lets recruiters
  find any content — sections, every case study, each skill/tool, and contact links/résumé — surfaced
  through each skin's native search: macOS **Spotlight** (⌘K), the Windows **Start menu**, iOS/iPadOS
  search (⌘K or the nav search button), and the Android search dock. Each skin's status/menu/tray bar
  also shows a **real battery level** via the Battery Status API (`useBattery`), rendering nothing
  where the browser doesn't expose one rather than faking it.
- **Skin routing + enforcement:** Apple → iOS / iPadOS / macOS by form factor; Android → Material
  (adapts up to expanded layouts); Windows → Fluent (scales down to a compact icon rail);
  unknown/Linux desktops fall back to macOS. All five skins are code-split. **Every device shows its
  own skin by default**, and the concept is enforced in **production**: the corner switcher only lets
  you preview the device's same-form-factor peer (phones iOS↔Android, tablets iPadOS↔Android,
  desktops macOS↔Windows) — other skins are disabled with a prompt to open them on the real device,
  and any stale/disallowed saved override is ignored (`peerSkin` in `src/lib/resolveSkin.ts`). In
  **development** (`pnpm dev`) every skin is unlocked so the whole thing is buildable from one
  machine.

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
