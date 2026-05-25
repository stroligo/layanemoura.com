import { getRequestURL } from 'h3';
import { resolveSiteUrl } from '~/utils/seo';

export default defineEventHandler((event) => {
  const config = useRuntimeConfig(event);
  const origin = getRequestURL(event).origin;
  const siteUrl = resolveSiteUrl(config.public.siteUrl as string | undefined, origin);

  const body = `User-agent: *
Allow: /

Disallow: /uikit
Disallow: /pt/uikit
Disallow: /_studio
Disallow: /studio-setup
Disallow: /pt/studio-setup

Sitemap: ${siteUrl}/sitemap.xml
`;

  setHeader(event, 'Content-Type', 'text/plain; charset=utf-8');
  setHeader(event, 'Cache-Control', 'public, max-age=3600');
  return body;
});
