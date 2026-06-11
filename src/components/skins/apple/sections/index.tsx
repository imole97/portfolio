import type { SectionId } from "@/lib/content";
import { WorkSection } from "./WorkSection";
import { AboutSection } from "./AboutSection";
import { PlaySection } from "./PlaySection";
import { ContactSection } from "./ContactSection";

export const SECTION_COMPONENTS: Record<SectionId, React.ComponentType> = {
  work: WorkSection,
  about: AboutSection,
  play: PlaySection,
  contact: ContactSection,
};
