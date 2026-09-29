/**
 * Clean section URLs: "/install" instead of "/#install". Each path is the same single page,
 * scrolled to that section. Pure functions, so the mapping is unit-tested.
 */

export const SECTION_IDS = ['features', 'install', 'shortcuts', 'faq'] as const
export type SectionId = (typeof SECTION_IDS)[number]

function isSectionId(value: string): value is SectionId {
  return (SECTION_IDS as readonly string[]).includes(value)
}

/** "/" + "install" → "/install"; base is Vite's BASE_URL, always ending in "/". */
export function sectionPath(id: SectionId, base: string): string {
  return `${base}${id}`
}

/**
 * The section a URL points at, or null for the page top. Old "#install" links still resolve,
 * so links shared before the switch keep working.
 */
export function sectionFromUrl(pathname: string, hash: string, base: string): SectionId | null {
  if (pathname.startsWith(base)) {
    const rest = pathname.slice(base.length).replace(/\/+$/, '')
    if (isSectionId(rest)) return rest
  }
  const fromHash = hash.replace(/^#/, '')
  return isSectionId(fromHash) ? fromHash : null
}
