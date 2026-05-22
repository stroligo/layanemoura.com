import { isSafeEmailAddress, isSafeHttpUrl } from '~/utils/security';
import { site } from '~/data/site';

export interface GetInTouchLocales {
  en: string;
  pt: string;
}

export interface GetInTouchDetailLocales {
  label: GetInTouchLocales;
  value: GetInTouchLocales;
}

/** Conteúdo da página /get-in-touch no idioma ativo. */
export interface GetInTouchPage {
  photoSrc: string;
  photoAlt: string;
  email: string;
  eyebrow: string;
  title: string;
  aboutParagraphs: string[];
  aboutEmail: string;
  heading: string;
  basedIn: { label: string; value: string };
  languages: { label: string; value: string };
  availability: { label: string; value: string };
}

export interface GetInTouchInput {
  photo: { src: string; alt: GetInTouchLocales };
  email: string;
  eyebrow: GetInTouchLocales;
  title: GetInTouchLocales;
  about: GetInTouchLocales;
  aboutEmail: GetInTouchLocales;
  heading: GetInTouchLocales;
  basedIn: GetInTouchDetailLocales;
  languages: GetInTouchDetailLocales;
  availability: GetInTouchDetailLocales;
}

export function localeTextForGetInTouch(
  field: GetInTouchLocales | undefined,
  locale: string,
): string {
  if (!field) return '';
  const code = locale.startsWith('pt') ? 'pt' : 'en';
  return (field[code] || field.en || '').trim();
}

export function paragraphsFromAbout(text: string): string[] {
  return text
    .split(/\n\s*\n/)
    .map((p) => p.trim())
    .filter(Boolean);
}

export function normalizeGetInTouch(
  input: GetInTouchInput,
  locale: string,
  siteName: string,
): GetInTouchPage {
  const rawEmail = input.email.trim();
  const email = isSafeEmailAddress(rawEmail) ? rawEmail : site.email;
  const photoSrc = input.photo.src.trim();
  const safePhotoSrc = isSafeHttpUrl(photoSrc) ? photoSrc : '/images/about.JPG';
  const aboutRaw = localeTextForGetInTouch(input.about, locale);
  const aboutEmailRaw = localeTextForGetInTouch(input.aboutEmail, locale);
  const photoAltRaw = localeTextForGetInTouch(input.photo.alt, locale);

  return {
    photoSrc: safePhotoSrc,
    photoAlt: photoAltRaw.replace(/\{name\}/g, siteName),
    email,
    eyebrow: localeTextForGetInTouch(input.eyebrow, locale),
    title: localeTextForGetInTouch(input.title, locale),
    aboutParagraphs: paragraphsFromAbout(aboutRaw),
    aboutEmail: aboutEmailRaw.replace(/\{email\}/g, email),
    heading: localeTextForGetInTouch(input.heading, locale),
    basedIn: {
      label: localeTextForGetInTouch(input.basedIn.label, locale),
      value: localeTextForGetInTouch(input.basedIn.value, locale),
    },
    languages: {
      label: localeTextForGetInTouch(input.languages.label, locale),
      value: localeTextForGetInTouch(input.languages.value, locale),
    },
    availability: {
      label: localeTextForGetInTouch(input.availability.label, locale),
      value: localeTextForGetInTouch(input.availability.value, locale),
    },
  };
}
