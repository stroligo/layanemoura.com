export interface ReviewLocales {
  en: string;
  pt: string;
}

/** Depoimento normalizado para o carousel (idioma ativo). */
export interface ClientReview {
  id: string;
  text: string;
  clientName: string;
  clientRole: string;
  clientCompany?: string;
  projectType?: string;
}

export interface ReviewInput {
  slug: string;
  published?: boolean;
  order?: number;
  quote: ReviewLocales;
  clientName: string;
  clientRole: ReviewLocales;
  clientCompany?: string;
  projectType?: ReviewLocales;
}

/** Slug do ficheiro YAML a partir do nome de quem fez o depoimento. */
export function reviewSlugFromName(name: string) {
  return name
    .normalize('NFD')
    .replace(/\p{M}/gu, '')
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

export function reviewSlugFromPath(path: string) {
  return path
    .replace(/^reviews\/+/i, '')
    .replace(/\.ya?ml$/i, '')
    .split('/')
    .filter(Boolean)
    .pop() ?? path;
}

export function localeTextForReview(
  field: ReviewLocales | undefined,
  locale: string,
): string {
  if (!field) return '';
  const code = locale.startsWith('pt') ? 'pt' : 'en';
  return (field[code] || field.en || '').trim();
}

export function normalizeReview(
  input: ReviewInput,
  locale: string,
): ClientReview {
  const id = reviewSlugFromPath(input.slug);
  const text = localeTextForReview(input.quote, locale);
  const clientRole = localeTextForReview(input.clientRole, locale);
  const projectType = localeTextForReview(input.projectType, locale);

  return {
    id,
    text,
    clientName: input.clientName.trim(),
    clientRole,
    ...(input.clientCompany?.trim()
      ? { clientCompany: input.clientCompany.trim() }
      : {}),
    ...(projectType ? { projectType } : {}),
  };
}
