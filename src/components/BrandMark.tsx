"use client";

// Company identity tile — the real logo on a gradient built from colors sampled out
// of that same logo. Shared by every skin so the work surfaces never invent palettes.

import Image from "next/image";
import type { Brand } from "@/lib/content";
import { cn } from "@/lib/cn";

/** Gradient built from the logo's own two colors. */
export function brandGradient(brand: Brand, angle = "135deg") {
  return `linear-gradient(${angle}, ${brand.from}, ${brand.to})`;
}

/** A translucent wash of the brand's primary — for chips, rules, and hover states. */
export function brandTint(brand: Brand, percent = 14) {
  return `color-mix(in srgb, ${brand.to} ${percent}%, transparent)`;
}

function monogram(name: string) {
  return name
    .split(/\s+/)
    .slice(0, 2)
    .map((w) => w[0])
    .join("")
    .toUpperCase();
}

interface BrandMarkProps {
  brand: Brand;
  /** Company name — used for the alt text and the monogram fallback. */
  name: string;
  /** Sizing/radius comes from the skin. */
  className?: string;
  /** Rendered height of the logo itself, in px. Also sizes the monogram fallback. */
  logoHeight?: number;
  /** Force the initials monogram — for tiles too small to carry a wordmark. */
  monogramOnly?: boolean;
  /** Flip/connected-animation hook used by the skins' shared-element transitions. */
  "data-flip-id"?: string;
}

export function BrandMark({
  brand,
  name,
  className,
  logoHeight = 30,
  monogramOnly = false,
  ...rest
}: Readonly<BrandMarkProps>) {
  return (
    <div
      {...rest}
      className={cn("relative grid place-items-center overflow-hidden", className)}
      style={{ background: brandGradient(brand) }}
    >
      {renderMark(brand, name, logoHeight, monogramOnly)}
    </div>
  );
}

function renderMark(brand: Brand, name: string, logoHeight: number, monogramOnly: boolean) {
  // Marks that already read on the tile (own background, or light-on-dark) skip the plate.
  if (brand.logo && brand.bleed && !monogramOnly) {
    return (
      <Image
        src={brand.logo}
        alt={`${name} logo`}
        width={240}
        height={240}
        unoptimized
        className="w-auto max-w-[72%] object-contain"
        style={{ height: logoHeight * 1.6 }}
      />
    );
  }

  // Wordmarks are dark-on-transparent, so they get a light plate to stay legible
  // in both appearances.
  if (brand.logo && !monogramOnly) {
    return (
      <span
        className="max-w-[86%] rounded-[10px] bg-white px-3.5 py-2.5"
        style={{ boxShadow: "0 2px 10px -4px rgba(0,0,0,0.45)" }}
      >
        <Image
          src={brand.logo}
          alt={`${name} logo`}
          width={320}
          height={90}
          unoptimized
          className="w-auto max-w-full object-contain"
          style={{ height: logoHeight }}
        />
      </span>
    );
  }

  return (
    <span
      aria-hidden
      className="font-semibold tracking-tight"
      style={{ color: brand.on, fontSize: logoHeight, lineHeight: 1 }}
    >
      {monogram(name)}
    </span>
  );
}
