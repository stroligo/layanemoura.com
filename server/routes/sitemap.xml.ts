import { getRequestURL } from 'h3';
import { buildSitemapXml } from '~/data/sitemap';
import { resolveSiteUrl } from '~/utils/seo';

export default defineEventHandler((event) => {
  const config = useRuntimeConfig(event);
  const origin = getRequestURL(event).origin;
  const base = resolveSiteUrl(config.public.siteUrl as string | undefined, origin);
  const body = buildSitemapXml(base);

  setHeader(event, 'Content-Type', 'application/xml; charset=utf-8');
  setHeader(event, 'Cache-Control', 'public, max-age=3600');
  return body;
});
