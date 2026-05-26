import {
  galleryGroupForLegacyTag,
  isGalleryGroup,
  isLegacyProjectTag,
  normalizeTagSlug,
  type GalleryGroup,
  type ProjectTag,
} from '~/data/site';
import { isSafeHttpUrl, normalizeSafeHref } from '~/utils/security';

export type GalleryLayout = 'tall' | 'wide' | 'normal';

/** Entrada YAML / Studio (string legado ou objeto com media picker). */
export type ProjectImageInput = string | { src: string };

export interface ProjectDescriptionLocales {
  en: string;
  pt: string;
}

export interface ProjectLinkLocales {
  label: ProjectDescriptionLocales;
  url: string;
}

export const defaultBehanceLinkLabels: ProjectDescriptionLocales = {
  en: 'View on Behance',
  pt: 'Ver no Behance',
};

/** Projeto normalizado (galeria + modal). */
export interface Project {
  slug: string;
  title: string;
  subtitle: string;
  /** Secção: Maps ou More */
  category: GalleryGroup;
  year: number;
  /** Tags de classificação (ex.: fantasy-maps, travel) */
  tags: ProjectTag[];
  /** Botões no modal (rótulo EN/PT + URL). */
  links: ProjectLinkLocales[];
  /** Visível na galeria pública */
  published: boolean;
  /** Destaque: aparece primeiro na secção (Maps / More) */
  highlight: boolean;
  /** Todas as imagens; [0] = capa na grelha. */
  images: string[];
  /** Texto do modal (EN + PT), editável no Studio / YAML */
  description: ProjectDescriptionLocales;
  layout: GalleryLayout;
}

export function normalizeProjectDescription(
  input?: Partial<ProjectDescriptionLocales> | string,
): ProjectDescriptionLocales {
  if (typeof input === 'string') {
    const text = input.trim();
    return { en: text, pt: '' };
  }
  return {
    en: input?.en?.trim() ?? '',
    pt: input?.pt?.trim() ?? '',
  };
}

/** Texto do modal conforme o idioma ativo (fallback EN). */
export function projectDescriptionForLocale(
  description: ProjectDescriptionLocales,
  locale: string,
): string {
  const code = locale.startsWith('pt') ? 'pt' : 'en';
  return description[code] || description.en || '';
}

/** Entrada legada / YAML (aceita `image` ou `images`; category antiga = tag). */
export type ProjectInput = Omit<Project, 'images' | 'links'> & {
  links?: ProjectLinkLocales[];
  /** @deprecated Use `links`. */
  behanceUrl?: string;
  images?: ProjectImageInput[];
  /** @deprecated Use `images`. Mantido para migração. */
  image?: string;
  /** @deprecated Ignorado — removido placeholder por gradiente. */
  thumbFrom?: string;
  thumbTo?: string;
  /** @deprecated Use `highlight` */
  featured?: boolean;
};

export function projectImagePath(slug: string, index = 0) {
  const clean = slug.replace(/^projects\/+/, '').replace(/\.ya?ml$/i, '');
  const pad = String(index + 1).padStart(2, '0');
  return `/images/projects/${clean}/${pad}.jpg`;
}

export function projectSlugFromPath(path: string) {
  return path
    .replace(/^projects\/+/i, '')
    .replace(/\.ya?ml$/i, '')
    .split('/')
    .filter(Boolean)
    .pop() ?? path;
}

/** `/images/projects/foo.jpg` → `/images/projects/foo/01.jpg` (convenção por pasta). */
export function migrateLegacyFlatProjectImagePath(path: string): string {
  const flat = path.match(
    /^\/images\/projects\/([^/]+)\.(jpe?g|png|webp|avif)$/i,
  );
  if (flat) return `/images/projects/${flat[1]}/01.jpg`;

  const variantStem = path.match(
    /^\/images\/projects\/([^/]+)\.(thumb|lg)\.(jpe?g|webp|avif)$/i,
  );
  if (variantStem) return `/images/projects/${variantStem[1]}/01.jpg`;

  return path;
}

export function resolveProjectImage(slug: string, image?: string) {
  if (!image) return projectImagePath(slug);

  const trimmed = image.trim();
  if (/^https?:\/\//i.test(trimmed)) return trimmed;

  let path = trimmed.startsWith('/') ? trimmed : `/${trimmed}`;
  path = path.replace(
    /^\/images\/projects\/projects\//,
    '/images/projects/',
  );
  if (!path.startsWith('/images/projects/')) {
    const name = projectSlugFromPath(trimmed);
    return projectImagePath(name);
  }
  return migrateLegacyFlatProjectImagePath(path);
}

/** Capa para a grelha e preload. */
export function projectCoverImage(project: Pick<Project, 'images'>) {
  return project.images[0];
}

export function flattenProjectImageInput(
  images?: ProjectImageInput[],
): string[] {
  return (images ?? [])
    .map((item) => (typeof item === 'string' ? item : item.src))
    .map((src) => src?.trim() ?? '')
    .filter(Boolean);
}

export function resolveProjectImages(
  slug: string,
  input?: Pick<ProjectInput, 'image' | 'images'>,
): string[] {
  const raw = [
    ...flattenProjectImageInput(input?.images),
    ...(input?.image ? [input.image] : []),
  ];

  const resolved = raw
    .map((src) => resolveProjectImage(slug, src))
    .filter(Boolean);

  const unique = [...new Set(resolved)];
  if (unique.length) return unique;

  return [projectImagePath(slug)];
}

function normalizeTagsList(tags?: string[]): ProjectTag[] {
  const normalized = (tags ?? [])
    .map((tag) => normalizeTagSlug(String(tag)))
    .filter(Boolean);
  return [...new Set(normalized)];
}

function resolveCategoryAndTags(
  category: GalleryGroup | string,
  tags?: string[],
): { category: GalleryGroup; tags: ProjectTag[] } {
  const normalizedTags = normalizeTagsList(tags);

  if (isGalleryGroup(category)) {
    return { category, tags: normalizedTags };
  }

  if (isLegacyProjectTag(category)) {
    const group = galleryGroupForLegacyTag(category);
    const merged = normalizeTagsList([category, ...normalizedTags]);
    return { category: group, tags: merged };
  }

  return { category: 'maps', tags: normalizedTags };
}

export function normalizeProjectLinks(
  input: Pick<ProjectInput, 'links' | 'behanceUrl'>,
): ProjectLinkLocales[] {
  const fromLinks = (input.links ?? [])
    .map((item) => {
      const safeUrl = normalizeSafeHref(item.url ?? '');
      if (!safeUrl) return null;
      return {
        label: normalizeProjectDescription(item.label),
        url: safeUrl,
      };
    })
    .filter((item): item is ProjectLinkLocales => item !== null);

  if (fromLinks.length) return fromLinks;

  const legacyUrl = input.behanceUrl?.trim();
  if (!legacyUrl || !isSafeHttpUrl(legacyUrl)) return [];

  return [{ label: defaultBehanceLinkLabels, url: legacyUrl }];
}

export function normalizeProject(input: ProjectInput): Project {
  const slug = projectSlugFromPath(input.slug);
  const images = resolveProjectImages(slug, input);
  const {
    category: rawCategory,
    tags: rawTags,
    image: _image,
    images: _images,
    slug: _slug,
    thumbFrom: _thumbFrom,
    thumbTo: _thumbTo,
    featured: legacyFeatured,
    published: rawPublished,
    highlight: rawHighlight,
    behanceUrl: _behanceUrl,
    links: _links,
    ...rest
  } = input;
  const { category, tags } = resolveCategoryAndTags(rawCategory, rawTags);
  const description = normalizeProjectDescription(
    (input as ProjectInput & { description?: Partial<ProjectDescriptionLocales> })
      .description,
  );

  const resolvedTags = tags.length ? tags : [];

  return {
    ...rest,
    slug,
    category,
    tags: resolvedTags,
    images,
    description,
    links: normalizeProjectLinks(input),
    published: rawPublished ?? true,
    highlight: rawHighlight ?? legacyFeatured ?? false,
  };
}
