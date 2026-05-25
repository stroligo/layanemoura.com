import { seoConfig } from '~/data/seo';

export function normalizeSiteUrl(url: string): string {
  const trimmed = url.trim().replace(/\/+$/, '');
  if (!trimmed) return seoConfig.defaultSiteUrl;
  if (/^https?:\/\//i.test(trimmed)) return trimmed;
  return `https://${trimmed}`;
}

export function isLocalhostSiteUrl(url: string): boolean {
  try {
    const host = new URL(normalizeSiteUrl(url)).hostname;
    return host === 'localhost' || host === '127.0.0.1';
  } catch {
    return false;
  }
}

/**
 * URL pública para canonical, OG, sitemap e robots.
 * Em produção ignora localhost no .env e usa o Host do pedido ou o domínio padrão.
 */
export function resolveSiteUrl(runtimeUrl?: string, requestOrigin?: string): string {
  const fromEnv = runtimeUrl?.trim();
  const isDev = process.env.NODE_ENV === 'development';

  if (fromEnv && (!isLocalhostSiteUrl(fromEnv) || isDev)) {
    return normalizeSiteUrl(fromEnv);
  }
  if (requestOrigin && !isLocalhostSiteUrl(requestOrigin)) {
    return normalizeSiteUrl(requestOrigin);
  }
  return seoConfig.defaultSiteUrl;
}

/** Caminho ou URL → URL absoluta para OG / JSON-LD. */
export function toAbsoluteUrl(pathOrUrl: string, siteUrl: string): string {
  const base = normalizeSiteUrl(siteUrl);
  const value = pathOrUrl.trim();
  if (!value) return base;
  if (/^https?:\/\//i.test(value)) return value;
  const path = value.startsWith('/') ? value : `/${value}`;
  return `${base}${path}`;
}

/** Substitui origem localhost (ou placeholder) pela URL pública correta. */
export function rewriteUrlOrigin(href: string, siteUrl: string): string {
  try {
    const parsed = new URL(href);
    if (!isLocalhostSiteUrl(parsed.origin)) return href;
    const path = `${parsed.pathname}${parsed.search}${parsed.hash}`;
    return toAbsoluteUrl(path || '/', siteUrl);
  } catch {
    return href;
  }
}

type HeadLink = { rel?: string; href?: string; hreflang?: string; [key: string]: unknown };

/** Corrige alternates/canonical do i18n e remove hreflang `pt` duplicado (fica `pt-BR`). */
export function normalizeSeoHeadLinks(
  links: HeadLink[] | undefined,
  siteUrl: string,
): HeadLink[] {
  if (!links?.length) return [];

  return links
    .filter((link) => link.hreflang !== 'pt')
    .map((link) =>
      link.href ? { ...link, href: rewriteUrlOrigin(link.href, siteUrl) } : link,
    );
}

export function escapeJsonLd(value: unknown): string {
  return JSON.stringify(value).replace(/</g, '\\u003c');
}
