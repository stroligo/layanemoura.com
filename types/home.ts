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
  title: HomeLocales;
  content: HomeLocales;
  cta: HomeLocales;
}

export interface HomeSectionHeaderInput {
  published?: boolean;
  eyebrow: HomeLocales;
  title: HomeLocales;
  cta: HomeLocales;
}

export interface HomeAboutTeaserInput {
  published?: boolean;
  eyebrow: HomeLocales;
  title: HomeLocales;
  content: HomeLocales;
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
    : '/images/projects/valebrook-final-chart.jpg';
  const photoAltRaw = localeTextForHome(input.photo.alt, locale);
  const bodyRaw = localeTextForHome(input.content, locale);

  return {
    photoSrc: safePhotoSrc,
    photoAlt: photoAltRaw.replace(/\{name\}/g, siteName),
    eyebrow: localeTextForHome(input.eyebrow, locale),
    title: localeTextForHome(input.title, locale),
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
    title: localeTextForHome(input.title, locale),
    cta: localeTextForHome(input.cta, locale),
  };
}

export function normalizeHomeAboutTeaser(
  input: HomeAboutTeaserInput,
  locale: string,
  email: string,
): HomeAboutTeaser {
  const contentRaw = localeTextForHome(input.content, locale);
  const aboutEmailRaw = localeTextForHome(input.aboutEmail, locale);

  return {
    eyebrow: localeTextForHome(input.eyebrow, locale),
    title: localeTextForHome(input.title, locale),
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
