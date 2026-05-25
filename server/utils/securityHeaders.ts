function isProduction() {
  return process.env.NODE_ENV === 'production';
}

/** Content-Security-Policy alinhada com fontes Google, imagens locais/remotas e Nuxt. */
export function buildContentSecurityPolicy(options?: {
  nonce?: string;
  /** Nuxt Studio (editor): ícones Iconify + WASM/SQLite no cliente. */
  relaxForStudio?: boolean;
}) {
  const scriptSrc = ["'self'", "'unsafe-inline'", 'https://www.googletagmanager.com'];
  if (options?.nonce) scriptSrc.push(`'nonce-${options.nonce}'`);

  const connectSrc = [
    "'self'",
    'https://www.google-analytics.com',
    'https://analytics.google.com',
    'https://www.googletagmanager.com',
    'https://region1.google-analytics.com',
    'https://region1.analytics.google.com',
  ];
  const frameSrc = ["'none'"];
  if (options?.relaxForStudio) {
    scriptSrc.push("'unsafe-eval'", "'wasm-unsafe-eval'");
    connectSrc.push(
      'https://api.iconify.design',
      'https://api.unisvg.com',
      'https://api.simplesvg.com',
      'https://github.com',
      'https://api.github.com',
    );
    frameSrc.length = 0;
    frameSrc.push("'self'", 'https://github.com');
  }

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
    `connect-src ${connectSrc.join(' ')}`,
    `frame-src ${frameSrc.join(' ')}`,
    "media-src 'self'",
    "worker-src 'self' blob:",
    "manifest-src 'self'",
  ];

  if (isProduction()) {
    directives.push('upgrade-insecure-requests');
  }

  return directives.join('; ');
}

export function buildSecurityHeaders(options?: {
  siteOrigin?: string;
  relaxForStudio?: boolean;
}) {
  const headers: Record<string, string> = {
    'X-Content-Type-Options': 'nosniff',
    'X-Frame-Options': options?.relaxForStudio ? 'SAMEORIGIN' : 'DENY',
    'X-Permitted-Cross-Domain-Policies': 'none',
    'Referrer-Policy': 'strict-origin-when-cross-origin',
    'Cross-Origin-Opener-Policy': options?.relaxForStudio
      ? 'same-origin-allow-popups'
      : 'same-origin',
    'Cross-Origin-Resource-Policy': 'same-site',
    'Permissions-Policy':
      'accelerometer=(), camera=(), geolocation=(), gyroscope=(), magnetometer=(), microphone=(), payment=(), usb=()',
    'Content-Security-Policy': buildContentSecurityPolicy({
      relaxForStudio: options?.relaxForStudio,
    }),
  };

  if (isProduction()) {
    headers['Strict-Transport-Security'] = 'max-age=31536000; includeSubDomains; preload';
  }

  return headers;
}
