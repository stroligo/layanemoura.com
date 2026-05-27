import { isSafeHttpUrl } from '~/utils/security';
import { site } from '~/data/site';

export interface HomeLocales {
  en: string;
  pt: string;
}

export interface HomeMapsAboutPage {
  photoSrc: string;
  photoAlt: string;
  eyebrow: string;
  title: string;
  paragraphs: string[];
  cta: string;
}

export interface HomeServicesHeader {
  eyebrow: string;
  title: string;
  cta: string;
}

export interface HomeAboutTeaser {
  eyebrow: string;
  title: string;
  paragraphs: string[];
  aboutEmail: string;
  cta: string;
}

export interface HomePage {
  mapsAbout: HomeMapsAboutPage;
  servicesHeader: HomeServicesHeader;
  aboutTeaser: HomeAboutTeaser;
}

export interface HomeMapsAboutInput {
  published?: boolean;
  photo: { src: string; alt: HomeLocales };
  eyebrow: HomeLocales;
  /** Evita colisão com campos reservados do Nuxt Content (`title`, `content`). */
  heading: HomeLocales;
  text: HomeLocales;
  cta: HomeLocales;
}

export interface HomeSectionHeaderInput {
  published?: boolean;
  eyebrow: HomeLocales;
  heading: HomeLocales;
  cta: HomeLocales;
}

export interface HomeAboutTeaserInput {
  published?: boolean;
  eyebrow: HomeLocales;
  heading: HomeLocales;
  text: HomeLocales;
  aboutEmail: HomeLocales;
  cta: HomeLocales;
}

export interface HomeInput {
  mapsAbout: HomeMapsAboutInput;
  servicesHeader: HomeSectionHeaderInput;
  aboutTeaser: HomeAboutTeaserInput;
}

export function localeTextForHome(
  field: HomeLocales | undefined,
  locale: string,
): string {
  if (!field) return '';
  const code = locale.startsWith('pt') ? 'pt' : 'en';
  return (field[code] || field.en || '').trim();
}

/** Preenche EN/PT vazios com fallback (Studio ou payload sem o campo). */
export function mergeHomeLocales(
  field: HomeLocales | undefined,
  fallback: HomeLocales,
): HomeLocales {
  return {
    en: (field?.en ?? '').trim() || fallback.en,
    pt: (field?.pt ?? '').trim() || fallback.pt,
  };
}

/** Lê locale com chaves novas (`heading`, `text`) ou legadas (`title`, `content`, `body`). */
export function pickHomeLocales(
  sources: {
    heading?: HomeLocales;
    title?: HomeLocales;
    text?: HomeLocales;
    content?: HomeLocales;
    body?: HomeLocales;
    copy?: HomeLocales;
  },
  fallback: HomeLocales,
): HomeLocales {
  const field =
    sources.heading
    ?? sources.title
    ?? sources.text
    ?? sources.content
    ?? sources.body
    ?? sources.copy;
  return mergeHomeLocales(field, fallback);
}

export function paragraphsFromHomeBody(text: string): string[] {
  return text
    .split(/\n\s*\n/)
    .map((p) => p.trim())
    .filter(Boolean);
}

export function normalizeHomeMapsAbout(
  input: HomeMapsAboutInput,
  locale: string,
  siteName: string,
): HomeMapsAboutPage {
  const photoSrc = input.photo.src.trim();
  const safePhotoSrc = isSafeHttpUrl(photoSrc)
    ? photoSrc
    : '/images/about.JPG';
  const photoAltRaw = localeTextForHome(input.photo.alt, locale);
  const bodyRaw = localeTextForHome(input.text, locale);

  return {
    photoSrc: safePhotoSrc,
    photoAlt: photoAltRaw.replace(/\{name\}/g, siteName),
    eyebrow: localeTextForHome(input.eyebrow, locale),
    title: localeTextForHome(input.heading, locale),
    paragraphs: paragraphsFromHomeBody(bodyRaw),
    cta: localeTextForHome(input.cta, locale),
  };
}

export function normalizeHomeServicesHeader(
  input: HomeSectionHeaderInput,
  locale: string,
): HomeServicesHeader {
  return {
    eyebrow: localeTextForHome(input.eyebrow, locale),
    title: localeTextForHome(input.heading, locale),
    cta: localeTextForHome(input.cta, locale),
  };
}

export function normalizeHomeAboutTeaser(
  input: HomeAboutTeaserInput,
  locale: string,
  email: string,
): HomeAboutTeaser {
  const contentRaw = localeTextForHome(input.text, locale);
  const aboutEmailRaw = localeTextForHome(input.aboutEmail, locale);

  return {
    eyebrow: localeTextForHome(input.eyebrow, locale),
    title: localeTextForHome(input.heading, locale),
    paragraphs: paragraphsFromHomeBody(contentRaw),
    aboutEmail: aboutEmailRaw.replace(/\{email\}/g, email),
    cta: localeTextForHome(input.cta, locale),
  };
}

export function normalizeHome(
  input: HomeInput,
  locale: string,
  siteName: string,
): HomePage {
  return {
    mapsAbout: normalizeHomeMapsAbout(input.mapsAbout, locale, siteName),
    servicesHeader: normalizeHomeServicesHeader(input.servicesHeader, locale),
    aboutTeaser: normalizeHomeAboutTeaser(input.aboutTeaser, locale, site.email),
  };
}
