---
name: nuxt-seo
description: >-
  Implements SEO for Nuxt SSR sites: centralized useSiteSeo composable, Open Graph
  and Twitter meta, JSON-LD (WebSite, Person, ContactPage), hreflang via
  useLocaleHead, dynamic sitemap.xml and robots.txt, legacy redirects, and
  noindex rules. Use when adding meta tags, structured data, sitemaps, canonical
  URLs, or fixing Google Search Console issues in Nuxt.
---

# Nuxt SEO

Centralize SEO in one composable. Pages pass overrides; defaults come from config + i18n.

## Core requirements

- `NUXT_PUBLIC_SITE_URL` set at build (canonical, OG, sitemap)
- SSR — meta must render in initial HTML, not client-only
- Bilingual sites: hreflang via `@nuxtjs/i18n` (`useLocaleHead`)

## useSiteSeo composable

```ts
export interface SiteSeoOptions {
  title?: string;
  description?: string;
  image?: string;           // /public path or absolute URL
  imageAlt?: string;
  ogImageWidth?: number;
  ogImageHeight?: number;
  type?: 'website' | 'article' | 'profile';
  robots?: string;
  noindex?: boolean;
  jsonLd?: Record<string, unknown> | Record<string, unknown>[];
}

export function useSiteSeo(pageOptions?: MaybeRefOrGetter<SiteSeoOptions | undefined>) {
  const { t, locale } = useI18n();
  const route = useRoute();
  const siteUrl = usePublicSiteUrl(); // from NUXT_PUBLIC_SITE_URL
  const i18nHead = useLocaleHead({ seo: true });

  const resolved = computed(() => {
    const input = toValue(pageOptions) ?? {};
    return {
      title: input.title ?? t('meta.defaultTitle'),
      description: input.description ?? t('meta.defaultDescription'),
      image: input.image ?? '/images/og-default.jpg',
      robots: input.robots ?? (input.noindex ? 'noindex, nofollow' : 'index, follow'),
      jsonLd: input.jsonLd,
    };
  });

  useSeoMeta({
    title: () => resolved.value.title,
    description: () => resolved.value.description,
    ogTitle: () => resolved.value.title,
    ogDescription: () => resolved.value.description,
    ogImage: () => toAbsoluteUrl(resolved.value.image, siteUrl.value),
    ogUrl: () => toAbsoluteUrl(route.path, siteUrl.value),
    ogLocale: () => (locale.value.startsWith('pt') ? 'pt_BR' : 'en_US'),
    twitterCard: 'summary_large_image',
    robots: () => resolved.value.robots,
  });

  useHead(() => ({
    htmlAttrs: { lang: i18nHead.value.htmlAttrs?.lang },
    link: normalizeLinks(i18nHead.value.link, siteUrl.value),
    meta: i18nHead.value.meta ?? [],
    script: resolved.value.jsonLd
      ? [{ type: 'application/ld+json', innerHTML: escapeJsonLd(resolved.value.jsonLd) }]
      : [],
  }));
}
```

### Page usage

```ts
// pages/index.vue
useSiteSeo({
  title: t('meta.homeTitle'),
  description: t('meta.homeDescription'),
  jsonLd: [buildWebSiteJsonLd(siteUrl), buildPersonJsonLd(siteUrl)],
});
```

## JSON-LD — safe patterns

```ts
function buildWebSiteJsonLd(siteUrl: string) {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'Site Name',
    url: siteUrl,
    inLanguage: ['en', 'pt-BR'],
  };
}

function buildPersonJsonLd(siteUrl: string, person: { name: string; image?: string }) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: person.name,
    url: siteUrl,
    image: toAbsoluteUrl(person.image, siteUrl),
  };
}

function buildContactPageJsonLd(siteUrl: string, path: string) {
  return {
    '@context': 'https://schema.org',
    '@type': 'ContactPage',
    url: toAbsoluteUrl(path, siteUrl),
  };
}
```

Multiple blocks → merge into `@graph` or pass array to composable.

### Avoid

| Pattern | Problem |
|---------|---------|
| `Review` with `itemReviewed: Person` | Google Search Console: invalid `itemReviewed` |
| Testimonials as `Review` schema | Use visible HTML only, or valid `itemReviewed` type |
| Hardcoded `localhost` in canonical | Guard `NUXT_PUBLIC_SITE_URL` at build |
| Client-only `useHead` without SSR | Verifiers won't see meta |

## Sitemap (dynamic route)

`server/routes/sitemap.xml.ts`:

```ts
export default defineEventHandler((event) => {
  const siteUrl = useRuntimeConfig(event).public.siteUrl;
  const xml = buildSitemapXml(siteUrl);
  setHeader(event, 'content-type', 'application/xml');
  return xml;
});
```

Include every public locale with `xhtml:link` alternates:

```xml
<xhtml:link rel="alternate" hreflang="en" href="https://domain.com/" />
<xhtml:link rel="alternate" hreflang="pt-BR" href="https://domain.com/pt/" />
<xhtml:link rel="alternate" hreflang="x-default" href="https://domain.com/" />
```

Maintain a single source of truth (`data/sitemap.ts`) listing public paths — update when adding pages.

## robots.txt

```ts
// server/routes/robots.txt.ts
export default defineEventHandler(() => {
  return [
    'User-agent: *',
    'Allow: /',
    'Disallow: /_studio',
    'Disallow: /api/',
    `Sitemap: ${siteUrl}/sitemap.xml`,
  ].join('\n');
});
```

## Legacy redirects

For migrated URLs (old CMS, www, trailing slashes):

```ts
// data/legacyRedirects.ts
export const LEGACY_EXACT_REDIRECTS: Record<string, string> = {
  '/old-path': '/new-path',
  '/pt/old-path': '/pt/new-path', // include all locale variants
};

// server/middleware/legacy-redirects.ts
export default defineEventHandler((event) => {
  const path = getRequestURL(event).pathname;
  const target = LEGACY_EXACT_REDIRECTS[path];
  if (target) return sendRedirect(event, target, 301);
});
```

Also add `routeRules` in `nuxt.config.ts` for static redirect maps.

**Include localized old paths** — `/pt/foo` returning 200 with empty content is a soft 404.

## noindex pages

Admin, setup, and utility routes:

```ts
// nuxt.config.ts
routeRules: {
  '/studio-setup': { index: false },
  '/_studio/**': { index: false },
},
```

Or per-page: `useSiteSeo({ noindex: true })`.

## Utilities

```ts
function toAbsoluteUrl(path: string, siteUrl: string): string {
  if (/^https?:\/\//i.test(path)) return path;
  return `${siteUrl.replace(/\/+$/, '')}/${path.replace(/^\/+/, '')}`;
}

function escapeJsonLd(data: unknown): string {
  return JSON.stringify(data).replace(/</g, '\\u003c');
}
```

Default OG image: static file in `public/images/` (e.g. 1200×630 JPG).

## Verification checklist

```
- [ ] View source: <title>, meta description, og:* present in SSR HTML
- [ ] Canonical and hreflang links correct for both locales
- [ ] /sitemap.xml lists all public URLs + alternates
- [ ] /robots.txt references sitemap
- [ ] JSON-LD validates in Google Rich Results Test
- [ ] Legacy URLs return 301 (test EN and prefixed locales)
- [ ] Admin routes noindex
- [ ] NUXT_PUBLIC_SITE_URL matches production domain (no localhost)
```

## Pitfalls

| Symptom | Fix |
|---------|-----|
| GSC "Valid with warnings" on Review | Remove invalid Review JSON-LD |
| Canonical points to localhost | Set `NUXT_PUBLIC_SITE_URL` before build |
| PT old URLs still indexed | Add `/pt/...` to redirect map |
| og:url wrong on PT pages | Merge `useLocaleHead` links with absolute site URL |
| Sitemap missing locale | Generate one `<url>` block per locale per page |

## Related skills

- **nuxt-i18n-bilingual** — locale routing, `useLocaleHead`, bilingual meta defaults
- **nuxt-studio** — exclude `/_studio` from sitemap and indexing
