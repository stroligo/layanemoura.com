import { toAbsoluteUrl } from '~/utils/seo';

export const SITEMAP_LOCALES = [
  { code: 'en', hreflang: 'en', prefix: '' },
  { code: 'pt', hreflang: 'pt-BR', prefix: '/pt' },
] as const;

export const SITEMAP_PUBLIC_PAGES = [
  { path: '/', changefreq: 'weekly', priority: '1.0' },
  { path: '/get-in-touch', changefreq: 'monthly', priority: '0.8' },
] as const;

export function sitemapLocalePath(prefix: string, path: string) {
  if (path === '/') return prefix || '/';
  return `${prefix}${path}`;
}

function xmlEscape(value: string) {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

/** Gera o XML do sitemap (páginas públicas EN + PT, com hreflang). */
export function buildSitemapXml(siteUrl: string, lastmod = new Date().toISOString().slice(0, 10)) {
  const base = siteUrl.replace(/\/+$/, '');

  const urlBlocks = SITEMAP_PUBLIC_PAGES.map((page) => {
    const defaultHref = toAbsoluteUrl(
      sitemapLocalePath(SITEMAP_LOCALES[0].prefix, page.path),
      base,
    );

    const alternates = [
      ...SITEMAP_LOCALES.map((loc) => {
        const path = sitemapLocalePath(loc.prefix, page.path);
        const href = toAbsoluteUrl(path, base);
        return `    <xhtml:link rel="alternate" hreflang="${xmlEscape(loc.hreflang)}" href="${xmlEscape(href)}" />`;
      }),
      `    <xhtml:link rel="alternate" hreflang="x-default" href="${xmlEscape(defaultHref)}" />`,
    ].join('\n');

    return SITEMAP_LOCALES.map((loc) => {
      const path = sitemapLocalePath(loc.prefix, page.path);
      const locUrl = toAbsoluteUrl(path, base);
      return `  <url>
    <loc>${xmlEscape(locUrl)}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>${page.changefreq}</changefreq>
    <priority>${page.priority}</priority>
${alternates}
  </url>`;
    }).join('\n');
  }).join('\n');

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:xhtml="http://www.w3.org/1999/xhtml">
${urlBlocks}
</urlset>`;
}
