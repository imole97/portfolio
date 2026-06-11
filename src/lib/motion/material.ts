// Material You motion factory. (DESIGN-SYSTEM §4.2 Motion, §7)
// Signature: container transform (Flip). Emphasized easing, physical + energetic.
// Everything degrades to a cross-fade / no-op when reducedMotion is true.

import gsap from "gsap";
import { Flip } from "gsap/Flip";
import { CustomEase } from "gsap/CustomEase";

let registered = false;
function ensurePlugins() {
  if (registered) return;
  if (typeof window !== "undefined") {
    gsap.registerPlugin(Flip, CustomEase);
    // M3 "emphasized" easing as a GSAP CustomEase.
    if (!CustomEase.get?.("md-emphasized")) {
      CustomEase.create("md-emphasized", "M0,0 C0.2,0 0,1 1,1");
    }
    registered = true;
  }
}

export const MD_EASE = "md-emphasized";
export const MD_DUR = { short: 0.2, medium: 0.42 } as const;

/**
 * Container transform: a tapped card morphs (shared bounds) into the detail view.
 * Capture state before the DOM swap, call this after.
 */
export function containerTransform(
  state: Flip.FlipState,
  opts: { reducedMotion: boolean; targets?: gsap.DOMTarget } = { reducedMotion: false },
) {
  ensurePlugins();
  if (opts.reducedMotion) {
    if (opts.targets) gsap.fromTo(opts.targets, { opacity: 0 }, { opacity: 1, duration: 0.18 });
    return;
  }
  Flip.from(state, {
    duration: MD_DUR.medium,
    ease: MD_EASE,
    absolute: true,
    scale: true,
    onEnter: (els) => gsap.fromTo(els, { opacity: 0 }, { opacity: 1, duration: 0.25 }),
    onLeave: (els) => gsap.to(els, { opacity: 0, duration: 0.18 }),
  });
}

export function captureFlip(targets: gsap.DOMTarget): Flip.FlipState {
  ensurePlugins();
  return Flip.getState(targets);
}

/** Staggered list reveal on enter. (§4.2) */
export function staggerReveal(
  targets: gsap.DOMTarget,
  opts: { reducedMotion: boolean } = { reducedMotion: false },
) {
  ensurePlugins();
  if (opts.reducedMotion) {
    gsap.set(targets, { opacity: 1, y: 0 });
    return;
  }
  gsap.fromTo(
    targets,
    { opacity: 0, y: 16 },
    { opacity: 1, y: 0, duration: MD_DUR.medium, ease: MD_EASE, stagger: 0.05 },
  );
}

/** FAB entrance: scale + lift. */
export function fabIn(el: Element, opts: { reducedMotion: boolean } = { reducedMotion: false }) {
  ensurePlugins();
  if (opts.reducedMotion) {
    gsap.set(el, { scale: 1, opacity: 1 });
    return;
  }
  gsap.fromTo(
    el,
    { scale: 0, opacity: 0 },
    { scale: 1, opacity: 1, duration: MD_DUR.medium, ease: "back.out(1.7)" },
  );
}

/** Slide the active-destination indicator pill. */
export function slideIndicator(
  el: Element,
  to: { x: number; width: number },
  opts: { reducedMotion: boolean } = { reducedMotion: false },
) {
  ensurePlugins();
  gsap.to(el, {
    x: to.x,
    width: to.width,
    duration: opts.reducedMotion ? 0 : MD_DUR.short,
    ease: MD_EASE,
    overwrite: "auto",
  });
}

/** Spawn a press ripple inside a `.md-ripple` host at the pointer location. */
export function spawnRipple(
  host: HTMLElement,
  clientX: number,
  clientY: number,
  reducedMotion: boolean,
) {
  if (reducedMotion) return;
  ensurePlugins();
  const rect = host.getBoundingClientRect();
  const size = Math.max(rect.width, rect.height) * 2;
  const ink = document.createElement("span");
  ink.className = "md-ripple-ink";
  ink.style.width = `${size}px`;
  ink.style.height = `${size}px`;
  ink.style.left = `${clientX - rect.left - size / 2}px`;
  ink.style.top = `${clientY - rect.top - size / 2}px`;
  host.appendChild(ink);
  gsap
    .timeline({ onComplete: () => ink.remove() })
    .fromTo(ink, { scale: 0, opacity: 0.24 }, { scale: 1, duration: 0.5, ease: "power2.out" })
    .to(ink, { opacity: 0, duration: 0.3 }, "-=0.2");
}
