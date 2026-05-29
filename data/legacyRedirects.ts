/**
 * URLs antigas (site anterior, WordPress, projetos por slug) → destino atual.
 * Usado em nuxt.config routeRules e server/middleware/legacy-redirects.ts.
 */
export const LEGACY_EXACT_REDIRECTS: Record<string, string> = {
  '/about': '/get-in-touch',
  '/contact': '/get-in-touch',
  '/contato': '/pt/get-in-touch',
  '/services': '/',
  '/portfolio': '/',
  '/work': '/',
  '/galeria': '/pt',
  '/pt/about': '/pt/get-in-touch',
  '/pt/contact': '/pt/get-in-touch',
  '/pt/contato': '/pt/get-in-touch',
  '/pt/services': '/pt',
  '/pt/portfolio': '/pt',
  '/pt/work': '/pt',
  '/pt/galeria': '/pt',
  '/index.html': '/',
  '/pt/index.html': '/pt',
};

/** Padrões Nitro routeRules (`**` = qualquer segmento). */
export const LEGACY_WILDCARD_REDIRECTS: Record<string, string> = {
  '/projects': '/',
  '/projects/**': '/',
  '/pt/projects': '/pt',
  '/pt/projects/**': '/pt',
  '/wp-admin': '/',
  '/wp-admin/**': '/',
  '/wp-content/**': '/',
  '/wp-includes/**': '/',
  '/wp-json/**': '/',
  '/tag/**': '/',
  '/category/**': '/',
  '/pt/tag/**': '/pt',
  '/pt/category/**': '/pt',
};

export type LegacyPatternRedirect = {
  test: (pathname: string) => boolean;
  to: string;
};

/** Fallback no middleware (regex) para o que routeRules não cobrir. */
export const LEGACY_PATTERN_REDIRECTS: LegacyPatternRedirect[] = [
  { test: (p) => /^\/pt\/projects(\/.*)?$/i.test(p), to: '/pt' },
  { test: (p) => /^\/projects(\/.*)?$/i.test(p), to: '/' },
  { test: (p) => /^\/pt\/(about|contact|contato)\/?$/i.test(p), to: '/pt/get-in-touch' },
  { test: (p) => /^\/(about|contact)\/?$/i.test(p), to: '/get-in-touch' },
  { test: (p) => /^\/contato\/?$/i.test(p), to: '/pt/get-in-touch' },
  { test: (p) => /^\/pt\/(services|portfolio|work|galeria)\/?$/i.test(p), to: '/pt' },
  { test: (p) => /^\/(services|portfolio|work|galeria)\/?$/i.test(p), to: '/' },
  { test: (p) => /^\/wp-/i.test(p), to: '/' },
  { test: (p) => /^\/(tag|category)(\/|$)/i.test(p), to: '/' },
  { test: (p) => /^\/pt\/(tag|category)(\/|$)/i.test(p), to: '/pt' },
  { test: (p) => /^\/feed\/?$/i.test(p), to: '/' },
  { test: (p) => /^\/pt\/feed\/?$/i.test(p), to: '/pt' },
];

export function resolveLegacyRedirect(pathname: string): string | null {
  const path = pathname.replace(/\/+$/, '') || '/';
  const exact = LEGACY_EXACT_REDIRECTS[path] ?? LEGACY_EXACT_REDIRECTS[`${path}/`];
  if (exact) return exact;

  for (const rule of LEGACY_PATTERN_REDIRECTS) {
    if (rule.test(path)) return rule.to;
  }
  return null;
}
