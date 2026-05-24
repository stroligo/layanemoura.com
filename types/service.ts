export type ServiceId =
  | 'fantasyMaps'
  | 'travelMaps'
  | 'bookCovers'
  | 'editorial'
  | 'commercial'
  | 'commissions';

export interface ServiceLocales {
  en: string;
  pt: string;
}

/** Card de serviço normalizado (idioma ativo). */
export interface HomeService {
  id: ServiceId;
  title: string;
  description: string;
}

export interface ServiceInput {
  slug: string;
  published?: boolean;
  order?: number;
  icon: ServiceId;
  title: ServiceLocales;
  description: ServiceLocales;
}

export function serviceSlugFromPath(path: string) {
  return path
    .replace(/^services\/+/i, '')
    .replace(/\.ya?ml$/i, '')
    .split('/')
    .filter(Boolean)
    .pop() ?? path;
}

export function localeTextForService(
  field: ServiceLocales | undefined,
  locale: string,
): string {
  if (!field) return '';
  const code = locale.startsWith('pt') ? 'pt' : 'en';
  return (field[code] || field.en || '').trim();
}

export function normalizeService(
  input: ServiceInput,
  locale: string,
): HomeService {
  return {
    id: input.icon,
    title: localeTextForService(input.title, locale),
    description: localeTextForService(input.description, locale),
  };
}
