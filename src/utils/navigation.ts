export const SECTION_IDS = [
  'home',
  'about',
  'skills',
  'services',
  'projects',
  'contact',
] as const;

export type SectionId = (typeof SECTION_IDS)[number];

function normalizeHash(hash: string): string {
  return hash.replace(/^#/, '').replace(/^\//, '');
}

/**
 * Reads a section id out of a location hash. Supports the plain `#contact`
 * form as well as the project routes (`#/project/tdi-ip-phone`), which are
 * ignored here because they are handled by the router in `App`.
 */
export function readSectionFromHash(hash: string): SectionId | null {
  const value = normalizeHash(hash);
  const match = SECTION_IDS.find((id) => value === id);
  return match ?? null;
}

/**
 * Smoothly scrolls to a section on the home page. Safe to call before the
 * section exists (for example while a project landing page is still mounted)
 * because the caller can retry once the home page renders.
 */
export function scrollToSection(id: SectionId, behavior: ScrollBehavior = 'smooth'): boolean {
  const target = document.getElementById(id);
  if (!target) return false;

  target.scrollIntoView({ behavior, block: 'start' });
  // Keep the address bar in sync without triggering our own hashchange logic
  // in a way that fights the manual scroll above.
  if (normalizeHash(window.location.hash) !== id) {
    window.history.replaceState(null, '', `#${id}`);
  }
  return true;
}