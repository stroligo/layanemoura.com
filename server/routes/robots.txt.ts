import { resolveSiteUrl } from '~/utils/seo';

export default defineEventHandler((event) => {
  const config = useRuntimeConfig(event);
  const siteUrl = resolveSiteUrl(config.public.siteUrl as string | undefined);

  const body = `User-agent: *
Allow: /

Disallow: /uikit
Disallow: /_studio

Sitemap: ${siteUrl}/sitemap.xml
`;

  setHeader(event, 'Content-Type', 'text/plain; charset=utf-8');
  setHeader(event, 'Cache-Control', 'public, max-age=3600');
  return body;
});
