// Apple (Liquid Glass) motion factory. (DESIGN-SYSTEM §4.1 Motion, §7)
// One place that owns the skin's signature motion so it stays consistent.
// Every entry point accepts `reducedMotion` and degrades to a plain cross-fade
// with no overshoot / shimmer / magnify when true. (§7 non-negotiable)

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

export const APPLE_EASE = {
  enter: "elastic.out(1, 0.75)", // liquid settle, spring overshoot
  ui: "power3.out",
} as const;

/**
 * Liquid settle: a surface arrives with a spring overshoot and a brief
 * refraction shimmer along its leading edge. Used for window/card entrances.
 */
export function liquidSettle(
  el: Element,
  opts: { reducedMotion: boolean; from?: "bottom" | "center" } = { reducedMotion: false },
): gsap.core.Timeline {
  ensurePlugins();
  const tl = gsap.timeline();

  if (opts.reducedMotion) {
    tl.fromTo(el, { opacity: 0 }, { opacity: 1, duration: 0.18, ease: "power1.out" });
    return tl;
  }

  const yFrom = opts.from === "bottom" ? 40 : 12;
  tl.fromTo(
    el,
    { opacity: 0, scale: 0.94, y: yFrom },
    { opacity: 1, scale: 1, y: 0, duration: 0.6, ease: APPLE_EASE.enter },
  );

  // Edge shimmer — a quick specular sweep across the leading edge.
  const shimmer = el.querySelector<HTMLElement>("[data-shimmer]");
  if (shimmer) {
    tl.fromTo(
      shimmer,
      { xPercent: -120, opacity: 0.0 },
      { xPercent: 120, opacity: 0.8, duration: 0.5, ease: "power2.out" },
      0.05,
    ).to(shimmer, { opacity: 0, duration: 0.2 }, ">-0.1");
  }

  return tl;
}

/** Genie-ish exit for closing/minimizing a window. */
export function windowExit(
  el: Element,
  opts: { reducedMotion: boolean } = { reducedMotion: false },
): gsap.core.Timeline {
  ensurePlugins();
  const tl = gsap.timeline();
  if (opts.reducedMotion) {
    tl.to(el, { opacity: 0, duration: 0.15, ease: "power1.in" });
    return tl;
  }
  tl.to(el, {
    opacity: 0,
    scale: 0.9,
    y: 24,
    duration: 0.28,
    ease: "power3.in",
  });
  return tl;
}

/**
 * Signature work-card -> case-study reveal using Flip for shared bounds.
 * Capture state before the DOM change, call this after. (§7)
 */
export function flipReveal(
  state: Flip.FlipState,
  opts: { reducedMotion: boolean; targets?: gsap.DOMTarget } = { reducedMotion: false },
) {
  ensurePlugins();
  if (opts.reducedMotion) {
    // No morph: just cross-fade the incoming targets.
    if (opts.targets) {
      gsap.fromTo(opts.targets, { opacity: 0 }, { opacity: 1, duration: 0.18 });
    }
    return;
  }
  Flip.from(state, {
    duration: 0.55,
    ease: APPLE_EASE.ui,
    absolute: true,
    scale: true,
    onEnter: (els) =>
      gsap.fromTo(els, { opacity: 0 }, { opacity: 1, duration: 0.3 }),
    onLeave: (els) => gsap.to(els, { opacity: 0, duration: 0.2 }),
  });
}

export function captureFlip(targets: gsap.DOMTarget): Flip.FlipState {
  ensurePlugins();
  return Flip.getState(targets);
}

/**
 * Dock magnification driven by pointer distance. Returns an update fn to call
 * on pointermove and a reset fn. No-op when reducedMotion or coarse pointer.
 * (§4.1 macOS, §8 hover gated behind (pointer: fine))
 */
export function createDockMagnifier(
  items: HTMLElement[],
  opts: { reducedMotion: boolean; maxScale?: number; radius?: number },
) {
  const maxScale = opts.maxScale ?? 1.6;
  const radius = opts.radius ?? 110;
  const enabled =
    !opts.reducedMotion &&
    typeof window !== "undefined" &&
    window.matchMedia("(pointer: fine)").matches;

  function update(pointerX: number) {
    if (!enabled) return;
    for (const item of items) {
      const rect = item.getBoundingClientRect();
      const center = rect.left + rect.width / 2;
      const dist = Math.abs(pointerX - center);
      const t = Math.max(0, 1 - dist / radius);
      const scale = 1 + (maxScale - 1) * t;
      gsap.to(item, {
        scale,
        y: -(scale - 1) * 22,
        duration: 0.18,
        ease: "power2.out",
        overwrite: "auto",
      });
    }
  }

  function reset() {
    gsap.to(items, { scale: 1, y: 0, duration: 0.3, ease: "power3.out" });
  }

  return { update, reset, enabled };
}
