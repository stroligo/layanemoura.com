import { seoConfig } from '~/data/seo';
import { site } from '~/data/site';
import { escapeJsonLd, resolveSiteUrl, toAbsoluteUrl } from '~/utils/seo';

export interface SiteSeoOptions {
  title?: string;
  description?: string;
  /** Caminho em /public ou URL absoluta. */
  image?: string;
  imageAlt?: string;
  type?: 'website' | 'article' | 'profile';
  robots?: string;
  noindex?: boolean;
  jsonLd?: Record<string, unknown> | Record<string, unknown>[];
}

type SiteSeoInput = MaybeRefOrGetter<SiteSeoOptions | undefined>;

function toGraph(
  jsonLd: Record<string, unknown> | Record<string, unknown>[],
): Record<string, unknown> {
  const items = Array.isArray(jsonLd) ? jsonLd : [jsonLd];
  if (items.length === 1) return items[0]!;
  return { '@context': 'https://schema.org', '@graph': items };
}

export function useSiteSeo(pageOptions?: SiteSeoInput) {
  const { t, locale } = useI18n();
  const route = useRoute();
  const runtimeConfig = useRuntimeConfig();
  const siteUrl = computed(() =>
    resolveSiteUrl(runtimeConfig.public.siteUrl as string | undefined),
  );

  const i18nHead = useLocaleHead({ seo: true });

  const resolved = computed(() => {
    const input = toValue(pageOptions) ?? {};
    return {
      title: input.title ?? t('meta.homeTitle'),
      description: input.description ?? t('meta.homeDescription'),
      image: input.image ?? seoConfig.defaultOgImage,
      imageAlt: input.imageAlt ?? t('seo.ogImageAlt', { name: site.name }),
      type: input.type ?? 'website',
      robots:
        input.robots ??
        (input.noindex ? 'noindex, nofollow' : 'index, follow, max-image-preview:large'),
      jsonLd: input.jsonLd,
    };
  });

  const ogImage = computed(() =>
    toAbsoluteUrl(resolved.value.image, siteUrl.value),
  );

  const ogLocale = computed(() =>
    locale.value.startsWith('pt')
      ? seoConfig.localeOg.pt
      : seoConfig.localeOg.en,
  );

  useSeoMeta({
    title: () => resolved.value.title,
    description: () => resolved.value.description,
    ogTitle: () => resolved.value.title,
    ogDescription: () => resolved.value.description,
    ogType: () => resolved.value.type,
    ogSiteName: seoConfig.siteName,
    ogImage: () => ogImage.value,
    ogImageAlt: () => resolved.value.imageAlt,
    ogLocale: () => ogLocale.value,
    ogUrl: () => toAbsoluteUrl(route.path, siteUrl.value),
    twitterCard: 'summary_large_image',
    twitterTitle: () => resolved.value.title,
    twitterDescription: () => resolved.value.description,
    twitterImage: () => ogImage.value,
    robots: () => resolved.value.robots,
  });

  useHead(() => {
    const scripts = resolved.value.jsonLd
      ? [
          {
            key: 'site-jsonld',
            type: 'application/ld+json',
            innerHTML: escapeJsonLd(toGraph(resolved.value.jsonLd)),
          },
        ]
      : [];

    return {
      htmlAttrs: {
        lang: i18nHead.value.htmlAttrs?.lang,
        dir: i18nHead.value.htmlAttrs?.dir,
      },
      link: [...(i18nHead.value.link ?? [])],
      meta: [
        ...(i18nHead.value.meta ?? []),
        { name: 'author', content: site.name },
        { name: 'theme-color', content: '#2d4a3e' },
      ],
      script: scripts,
    };
  });

  return { siteUrl, ogImage };
}

export function buildWebSiteJsonLd(siteUrl: string) {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: seoConfig.siteName,
    url: siteUrl,
    inLanguage: ['en', 'pt-BR'],
    publisher: { '@type': 'Person', name: site.name },
  };
}

export function buildPersonJsonLd(siteUrl: string, imagePath?: string) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: site.name,
    url: siteUrl,
    image: toAbsoluteUrl(imagePath ?? seoConfig.defaultOgImage, siteUrl),
    email: `mailto:${site.email}`,
    jobTitle: ['Illustrator', 'Map Maker'],
    knowsAbout: [
      'Illustration',
      'Fantasy maps',
      'Travel illustration',
      'Book cover illustration',
      'Editorial illustration',
    ],
    sameAs: seoConfig.sameAs,
  };
}

export function buildContactPageJsonLd(siteUrl: string, contactPath: string) {
  return {
    '@context': 'https://schema.org',
    '@type': 'ContactPage',
    name: `${site.name} — Contact`,
    url: toAbsoluteUrl(contactPath, siteUrl),
    about: { '@type': 'Person', name: site.name, url: siteUrl },
  };
}
