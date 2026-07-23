// Real iOS/macOS app icons for the sections and launchers that have one. Each asset
// already carries its own background and corner radius (cropped from Apple's icons in
// /public), so it renders as a full tile image rather than an emoji on a colored plate.
// Anything without an entry keeps its emoji fallback.

import Image from "next/image";
import type { SectionId } from "@/lib/content";

export const APPLE_SECTION_ICON: Partial<Record<SectionId, string>> = {
  work: "/apple-icon-work.png",
  settings: "/apple-icon-settings.png",
  contact: "/apple-icon-contact.png",
};

/** Keyed by the contact-link label in content.ts. */
export const APPLE_LAUNCHER_ICON: Record<string, string> = {
  Email: "/apple-icon-mail.png",
};

/** A square icon image that fills its tile; `rounded` sets the corner radius class. */
export function AppleIconImage({
  src,
  label,
  rounded,
}: Readonly<{ src: string; label: string; rounded: string }>) {
  return (
    <Image
      src={src}
      alt={`${label} icon`}
      width={112}
      height={112}
      className={`h-full w-full object-cover ${rounded}`}
    />
  );
}
