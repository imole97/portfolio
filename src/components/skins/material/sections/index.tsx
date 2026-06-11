import type { SectionId } from "@/lib/content";
import { MaterialWorkSection } from "./MaterialWorkSection";
import { MaterialAboutSection } from "./MaterialAboutSection";
import { MaterialPlaySection } from "./MaterialPlaySection";
import { MaterialContactSection } from "./MaterialContactSection";

export const MATERIAL_SECTIONS: Record<SectionId, React.ComponentType> = {
  work: MaterialWorkSection,
  about: MaterialAboutSection,
  play: MaterialPlaySection,
  contact: MaterialContactSection,
};
