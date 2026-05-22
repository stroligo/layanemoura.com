function isProduction() {
  return process.env.NODE_ENV === 'production';
}

/** Content-Security-Policy alinhada com fontes Google, imagens locais/remotas e Nuxt. */
export function buildContentSecurityPolicy(nonce?: string) {
  const scriptSrc = ["'self'", "'unsafe-inline'"];
  if (nonce) scriptSrc.push(`'nonce-${nonce}'`);

  const directives = [
    "default-src 'self'",
    "base-uri 'self'",
    "object-src 'none'",
    "frame-ancestors 'none'",
    "form-action 'self' mailto:",
    `script-src ${scriptSrc.join(' ')}`,
    "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
    "font-src 'self' https://fonts.gstatic.com data:",
    "img-src 'self' data: https: blob:",
    "connect-src 'self'",
    "media-src 'self'",
    "worker-src 'self' blob:",
    "manifest-src 'self'",
  ];

  if (isProduction()) {
    directives.push('upgrade-insecure-requests');
  }

  return directives.join('; ');
}

export function buildSecurityHeaders(options?: { siteOrigin?: string }) {
  const headers: Record<string, string> = {
    'X-Content-Type-Options': 'nosniff',
    'X-Frame-Options': 'DENY',
    'X-Permitted-Cross-Domain-Policies': 'none',
    'Referrer-Policy': 'strict-origin-when-cross-origin',
    'Cross-Origin-Opener-Policy': 'same-origin',
    'Cross-Origin-Resource-Policy': 'same-site',
    'Permissions-Policy':
      'accelerometer=(), camera=(), geolocation=(), gyroscope=(), magnetometer=(), microphone=(), payment=(), usb=()',
    'Content-Security-Policy': buildContentSecurityPolicy(),
  };

  if (isProduction()) {
    headers['Strict-Transport-Security'] = 'max-age=31536000; includeSubDomains; preload';
  }

  return headers;
}
