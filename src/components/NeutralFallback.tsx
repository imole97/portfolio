// Neutral SSR / pre-resolution skin: system fonts, no chrome, no flash.
// (DESIGN-SYSTEM §2, §8) Renders just the hero text so there is meaningful
// content before the skin resolves and for no-JS / crawler contexts.

import { content } from "@/lib/content";

export function NeutralFallback() {
  const { hero } = content;
  return (
    <main className="min-h-screen flex items-center justify-center px-6">
      <div className="max-w-2xl text-center">
        <p className="text-sm uppercase tracking-widest opacity-50">{hero.role}</p>
        <h1 className="mt-3 text-4xl font-semibold sm:text-6xl">{hero.name}</h1>
        <p className="mt-5 text-lg opacity-70">{hero.thesis}</p>
      </div>
    </main>
  );
}
