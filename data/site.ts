export const site = {
  name: 'Layane Moura',
  email: 'hi@layanemoura.com',
  photo: '/images/about.JPG',
} as const;

/** Secção da galeria (toolbar): Maps ou More */
export type GalleryGroup = 'maps' | 'more';

export const galleryGroupIds: GalleryGroup[] = ['maps', 'more'];

/** Tag de classificação (slug livre; ex.: travel, desert, fantasy-maps) */
export type ProjectTag = string;

/** Tags legadas usadas na migração category → maps/more */
export const legacyMapTags = ['fantasy-maps', 'travel'] as const;
export const legacyMoreTags = [
  'book-covers',
  'editorial',
  'patterns',
  'commercial',
] as const;

export function isGalleryGroup(value: string): value is GalleryGroup {
  return value === 'maps' || value === 'more';
}

export function isLegacyProjectTag(value: string): boolean {
  return (
    (legacyMapTags as readonly string[]).includes(value) ||
    (legacyMoreTags as readonly string[]).includes(value)
  );
}

export function galleryGroupForLegacyTag(tag: string): GalleryGroup {
  return (legacyMapTags as readonly string[]).includes(tag) ? 'maps' : 'more';
}

/** Normaliza texto do YAML/Studio para slug estável (ex.: "Desert" → "desert"). */
export function normalizeTagSlug(value: string): ProjectTag {
  const trimmed = value.trim();
  if (!trimmed) return '';

  if (/^[a-z0-9]+(-[a-z0-9]+)*$/.test(trimmed)) {
    return trimmed.toLowerCase();
  }

  return trimmed
    .toLowerCase()
    .normalize('NFD')
    .replace(/\p{M}/gu, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

/** Tags únicas usadas em projetos da secção (ordem alfabética por slug). */
export function tagsUsedInGroup(
  projects: { category: GalleryGroup; tags: ProjectTag[] }[],
  group: GalleryGroup,
): ProjectTag[] {
  const used = new Set<ProjectTag>();
  for (const p of projects) {
    if (p.category !== group) continue;
    for (const tag of p.tags) {
      if (tag) used.add(tag);
    }
  }
  return [...used].sort((a, b) => a.localeCompare(b));
}

export type SortField = 'tag' | 'title';
export type SortDirection = 'asc' | 'desc';

export const sortFieldDefaults: {
  field: SortField;
  defaultDirection: SortDirection;
}[] = [
  { field: 'title', defaultDirection: 'asc' },
  { field: 'tag', defaultDirection: 'asc' },
];
