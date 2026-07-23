// Neutral SSR / pre-resolution skin: system fonts, no chrome, no flash.
// (DESIGN-SYSTEM §2, §8) A transient loading state shown until the skin resolves; the
// canonical crawlable heading lives in the always-present SeoContent layer, so this
// uses a non-heading element to avoid a competing h1.

import { content } from "@/lib/content";

export function NeutralFallback() {
  const { hero } = content;
  return (
    <main className="min-h-screen flex items-center justify-center px-6" aria-hidden>
      <div className="max-w-2xl text-center">
        <p className="text-sm uppercase tracking-widest opacity-50">{hero.role}</p>
        <p className="mt-3 text-4xl font-semibold sm:text-6xl">{hero.name}</p>
        <p className="mt-5 text-lg opacity-70">{hero.thesis}</p>
      </div>
    </main>
  );
}
