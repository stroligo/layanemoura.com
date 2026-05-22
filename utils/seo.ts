import { seoConfig } from '~/data/seo';

export function normalizeSiteUrl(url: string): string {
  const trimmed = url.trim().replace(/\/+$/, '');
  if (!trimmed) return seoConfig.defaultSiteUrl;
  if (/^https?:\/\//i.test(trimmed)) return trimmed;
  return `https://${trimmed}`;
}

export function resolveSiteUrl(runtimeUrl?: string): string {
  return normalizeSiteUrl(runtimeUrl || seoConfig.defaultSiteUrl);
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

export function escapeJsonLd(value: unknown): string {
  return JSON.stringify(value).replace(/</g, '\\u003c');
}
