import { resolveSiteUrl, toAbsoluteUrl } from '~/utils/seo';

const PUBLIC_PAGES = [
  { path: '/', changefreq: 'weekly', priority: '1.0' },
  { path: '/get-in-touch', changefreq: 'monthly', priority: '0.8' },
] as const;

const LOCALES = [
  { code: 'en', hreflang: 'en', prefix: '' },
  { code: 'pt', hreflang: 'pt-BR', prefix: '/pt' },
] as const;

function localePath(prefix: string, path: string) {
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

export default defineEventHandler((event) => {
  const config = useRuntimeConfig(event);
  const base = resolveSiteUrl(config.public.siteUrl as string | undefined);
  const lastmod = new Date().toISOString().slice(0, 10);

  const urlBlocks = PUBLIC_PAGES.map((page) => {
    const defaultHref = toAbsoluteUrl(
      localePath(LOCALES[0].prefix, page.path),
      base,
    );

    const alternates = [
      ...LOCALES.map((loc) => {
        const path = localePath(loc.prefix, page.path);
        const href = toAbsoluteUrl(path, base);
        return `    <xhtml:link rel="alternate" hreflang="${xmlEscape(loc.hreflang)}" href="${xmlEscape(href)}" />`;
      }),
      `    <xhtml:link rel="alternate" hreflang="x-default" href="${xmlEscape(defaultHref)}" />`,
    ].join('\n');

    const locEntries = LOCALES.map((loc) => {
      const path = localePath(loc.prefix, page.path);
      const locUrl = toAbsoluteUrl(path, base);
      return `  <url>
    <loc>${xmlEscape(locUrl)}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>${page.changefreq}</changefreq>
    <priority>${page.priority}</priority>
${alternates}
  </url>`;
    }).join('\n');

    return locEntries;
  }).join('\n');

  const body = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:xhtml="http://www.w3.org/1999/xhtml">
${urlBlocks}
</urlset>`;

  setHeader(event, 'Content-Type', 'application/xml; charset=utf-8');
  setHeader(event, 'Cache-Control', 'public, max-age=3600');
  return body;
});
