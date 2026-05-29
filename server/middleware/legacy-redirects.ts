import { getRequestURL, sendRedirect } from 'h3';
import { resolveLegacyRedirect } from '~/data/legacyRedirects';
import { seoConfig } from '~/data/seo';

/**
 * 301 para URLs legadas e canonical host (sem www).
 * Corrige 404 / soft-404 no Google Search Console.
 */
export default defineEventHandler((event) => {
  const url = getRequestURL(event);
  const host = url.host.toLowerCase();
  const pathname = url.pathname;

  if (host === 'www.layanemoura.com') {
    const target = `${seoConfig.defaultSiteUrl}${pathname}${url.search}`;
    return sendRedirect(event, target, 301);
  }

  const target = resolveLegacyRedirect(pathname);
  if (target && target !== pathname) {
    return sendRedirect(event, `${target}${url.search}`, 301);
  }
});
