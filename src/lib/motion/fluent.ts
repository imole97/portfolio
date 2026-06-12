// Windows Fluent motion factory. (DESIGN-SYSTEM §4.3 Motion, §7)
// Signature: connected animation (Flip) — a thumbnail flies into the detail header.
// Fluent is calmer than Material: subtle slide-up + fade, power2.out, 200–350ms.
// Everything degrades to a cross-fade / no-op under reducedMotion.

import gsap from "gsap";
import { Flip } from "gsap/Flip";

let registered = false;
function ensurePlugins() {
  if (registered) return;
  if (typeof window !== "undefined") {
    gsap.registerPlugin(Flip);
    registered = true;
  }
}

export const FLUENT_EASE = "power2.out";
export const FLUENT_DUR = { short: 0.2, medium: 0.32 } as const;

export function captureFlip(targets: gsap.DOMTarget): Flip.FlipState {
  ensurePlugins();
  return Flip.getState(targets);
}

/** Connected animation: shared-element handoff from list thumbnail to detail header. */
export function connectedAnimation(
  state: Flip.FlipState,
  opts: { reducedMotion: boolean; targets?: gsap.DOMTarget } = { reducedMotion: false },
) {
  ensurePlugins();
  if (opts.reducedMotion) {
    if (opts.targets) gsap.fromTo(opts.targets, { opacity: 0 }, { opacity: 1, duration: 0.15 });
    return;
  }
  Flip.from(state, {
    duration: FLUENT_DUR.medium,
    ease: FLUENT_EASE,
    absolute: true,
    scale: true,
    onEnter: (els) =>
      gsap.fromTo(els, { opacity: 0, y: 8 }, { opacity: 1, y: 0, duration: 0.25 }),
    onLeave: (els) => gsap.to(els, { opacity: 0, duration: 0.15 }),
  });
}

/** Calm entrance: subtle slide-up + fade, optionally staggered. */
export function entranceSlide(
  targets: gsap.DOMTarget,
  opts: { reducedMotion: boolean; stagger?: number } = { reducedMotion: false },
) {
  ensurePlugins();
  if (opts.reducedMotion) {
    gsap.set(targets, { opacity: 1, y: 0 });
    return;
  }
  gsap.fromTo(
    targets,
    { opacity: 0, y: 12 },
    {
      opacity: 1,
      y: 0,
      duration: FLUENT_DUR.medium,
      ease: FLUENT_EASE,
      stagger: opts.stagger ?? 0.04,
    },
  );
}
