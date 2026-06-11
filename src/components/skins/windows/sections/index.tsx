import type { SectionId } from "@/lib/content";
import { FluentWorkSection } from "./FluentWorkSection";
import { FluentAboutSection } from "./FluentAboutSection";
import { FluentPlaySection } from "./FluentPlaySection";
import { FluentContactSection } from "./FluentContactSection";

export const FLUENT_SECTIONS: Record<SectionId, React.ComponentType> = {
  work: FluentWorkSection,
  about: FluentAboutSection,
  play: FluentPlaySection,
  contact: FluentContactSection,
};
