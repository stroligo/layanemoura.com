import { buildSecurityHeaders } from '../utils/securityHeaders';

export default defineEventHandler((event) => {
  const path = event.path ?? '';

  // Studio: não indexar; reforço anti-embed (OAuth próprio do módulo).
  if (path.startsWith('/_studio')) {
    setHeader(event, 'X-Robots-Tag', 'noindex, nofollow, noarchive');
    setHeader(event, 'Cache-Control', 'no-store');
  }

  const headers = buildSecurityHeaders();
  for (const [name, value] of Object.entries(headers)) {
    setHeader(event, name, value);
  }
});
