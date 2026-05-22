import { site } from '~/data/site';

/** URLs públicas de perfis (JSON-LD sameAs). */
export const seoSameAs = [
  'https://www.behance.net/layanemds',
  'https://www.instagram.com/layanemoura.png/',
  'https://www.threads.com/@layanemoura.png',
  'https://www.linkedin.com/in/layanemds/',
  'https://wa.me/5563992429380',
] as const;

export const seoConfig = {
  /** Sobrescrever com NUXT_PUBLIC_SITE_URL em produção. */
  defaultSiteUrl: 'https://layanemoura.com',
  siteName: site.name,
  email: site.email,
  /** Imagem padrão para redes (retrato / marca). */
  defaultOgImage: '/images/layane.jpg',
  contactOgImage: '/images/about.JPG',
  twitterHandle: '@layanemoura',
  localeOg: {
    en: 'en_US',
    pt: 'pt_BR',
  } as const,
  sameAs: [...seoSameAs],
} as const;
