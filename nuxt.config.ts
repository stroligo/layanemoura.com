import { defineNuxtConfig } from 'nuxt/config';
import tailwindcss from '@tailwindcss/vite';
import { STATIC_CACHE_MAX_AGE } from './data/performance';

const studioRepositoryOwner = process.env.STUDIO_REPOSITORY_OWNER;
const studioRepositoryRepo = process.env.STUDIO_REPOSITORY_REPO;
const studioRepositoryConfigured = Boolean(
  studioRepositoryOwner && studioRepositoryRepo,
);
/** Em produção o módulo entra no build só com repo no .env (Hostinger: definir ANTES de npm run build). */
const studioModuleEnabled =
  process.env.NODE_ENV === 'development' || studioRepositoryConfigured;

/** Evita canonical/OG com localhost se o .env de build estiver errado. */
function buildPublicSiteUrl() {
  const raw = process.env.NUXT_PUBLIC_SITE_URL?.trim();
  if (!raw) return 'https://layanemoura.com';
  if (/^https?:\/\/(localhost|127\.0\.0\.1)(:\d+)?$/i.test(raw)) {
    return 'https://layanemoura.com';
  }
  return raw.replace(/\/+$/, '');
}

const siteUrl = buildPublicSiteUrl();

const gtagId = process.env.NUXT_PUBLIC_GTAG_ID?.trim() || 'G-75RXBJWSZC';
const gtagDisabled = process.env.NUXT_PUBLIC_GTAG_ID === '';

/** Tag no <head> do HTML (SSR) — o verificador do Google exige isto, não só JS no cliente. */
function buildGtagHeadScripts() {
  if (gtagDisabled || !/^G-[A-Z0-9]+$/.test(gtagId)) return [];
  if (process.env.NODE_ENV !== 'production') return [];

  const init = [
    'window.dataLayer=window.dataLayer||[];',
    'function gtag(){dataLayer.push(arguments);}',
    "gtag('js',new Date());",
    `gtag('config','${gtagId}');`,
  ].join('');

  return [
    {
      src: `https://www.googletagmanager.com/gtag/js?id=${gtagId}`,
      async: true,
    },
    {
      innerHTML: init,
      type: 'text/javascript',
    },
  ];
}

export default defineNuxtConfig({
  compatibilityDate: '2026-05-08',

  runtimeConfig: {
    /** Apenas servidor — nunca expor em `public`. */
    studioGithubClientId: process.env.STUDIO_GITHUB_CLIENT_ID || '',
    studioGithubClientSecret: process.env.STUDIO_GITHUB_CLIENT_SECRET || '',
    /** Formulário de contacto (SMTP). Ver `.env.example`. */
    contactToEmail: process.env.CONTACT_TO_EMAIL || 'hi@layanemoura.com',
    contactFromEmail: process.env.CONTACT_FROM_EMAIL || '',
    contactFromName: process.env.CONTACT_FROM_NAME || 'Layane Moura Website',
    smtpHost: process.env.SMTP_HOST || '',
    smtpPort: process.env.SMTP_PORT || '587',
    smtpSecure: process.env.SMTP_SECURE === 'true',
    smtpUser: process.env.SMTP_USER || '',
    smtpPass: process.env.SMTP_PASS || '',
    /** Aviso no WhatsApp da Layane quando o formulário é enviado (CallMeBot ou webhook). */
    whatsappNotifyEnabled: process.env.WHATSAPP_NOTIFY_ENABLED === 'true',
    whatsappNotifyPhone: process.env.WHATSAPP_NOTIFY_PHONE || '5563992429380',
    callmebotApiKey: process.env.CALLMEBOT_API_KEY || '',
    whatsappNotifyWebhook: process.env.WHATSAPP_NOTIFY_WEBHOOK || '',
    public: {
      siteUrl,
      /** Google Analytics 4 (gtag). Vazio = desligado. */
      gtagId: gtagDisabled ? '' : gtagId,
      /** true = carregar gtag também em `nuxt dev` */
      gtagDev: process.env.NUXT_PUBLIC_GTAG_DEV === 'true',
      /** Indica modo dev do Studio (botão local); não é segredo. */
      studioDev: process.env.NODE_ENV === 'development',
      /** false = build sem nuxt-studio → /_studio mostra guia de configuração */
      studioInBuild: studioModuleEnabled && studioRepositoryConfigured,
    },
  },

  ignore: [
    'ARQUIVOS/**',
    '.arq-match/**',
    '.arq-preview/**',
    'Projeto/**',
  ],

  devtools: { enabled: process.env.NODE_ENV === 'development' },


  css: ['~/src/css/main.css'],

  modules: [
    '@nuxt/content',
    'nuxt-svgo',
    '@nuxt/eslint',
    '@nuxtjs/i18n',
    ...(studioModuleEnabled ? (['nuxt-studio'] as const) : []),
  ],

  ...(studioModuleEnabled
    ? {
        studio: {
          route: '/_studio',
          dev: process.env.NODE_ENV === 'development',
          i18n: {
            defaultLocale: 'en',
          },
          git: {
            commit: {
              messagePrefix: 'content:',
            },
          },
          repository: studioRepositoryConfigured
            ? {
                provider: 'github' as const,
                owner: studioRepositoryOwner!,
                repo: studioRepositoryRepo!,
                branch: process.env.STUDIO_REPOSITORY_BRANCH || 'main',
              }
            : undefined,
        },
      }
    : {}),

  content: {},

  i18n: {
    baseUrl: siteUrl,
    compilation: {
      strictMessage: false,
    },
    locales: [
      { code: 'en', language: 'en', file: 'en.json' },
      { code: 'pt', language: 'pt-BR', file: 'pt.json' },
    ],
    langDir: 'locales',
    defaultLocale: 'en',
    strategy: 'prefix_except_default',
    // Studio usa /_studio (rota Nitro) — não prefixar com /pt
    pages: {
      _studio: false,
    },
    detectBrowserLanguage: {
      useCookie: true,
      cookieKey: 'lm_locale',
      redirectOn: 'root',
      cookieSecure: process.env.NODE_ENV === 'production',
      cookieCrossOrigin: false,
    },
  },

  svgo: {
    autoImportPath: './assets/images/icons',
    svgoConfig: {
      plugins: [
        {
          name: 'removeAttrs',
          params: {
            attrs: 'stroke',
          },
        },
      ],
    },
  },

  // Pastas com centenas de imagens fora do site — evita EMFILE no file watcher (macOS).
  watchers: {
    chokidar: {
      usePolling: true,
      interval: 1000,
      ignoreInitial: true,
      ignored: [
        '**/ARQUIVOS/**',
        '**/.arq-match/**',
        '**/.arq-preview/**',
        '**/Projeto/**',
        '**/.output/**',
        '**/build/**',
        '**/node_modules/**',
      ],
    },
  },

  vite: {
    plugins: [tailwindcss()],
    optimizeDeps: {
      include: ['@vue/devtools-core', '@vue/devtools-kit'],
    },
    server: {
      watch: {
        ignored: [
          '**/ARQUIVOS/**',
          '**/.arq-match/**',
          '**/.arq-preview/**',
          '**/Projeto/**',
          '**/.output/**',
          '**/build/**',
        ],
      },
    },
  },

  app: {
    baseURL: '/',
    head: {
      charset: 'utf-8',
      viewport: 'width=device-width, initial-scale=1',
      title: 'Layane Moura',
      link: [
        { rel: 'icon', href: '/favicon.png', type: 'image/png' },
        { rel: 'icon', href: '/favicon-32.png', sizes: '32x32', type: 'image/png' },
        { rel: 'apple-touch-icon', href: '/apple-touch-icon.png', sizes: '180x180' },
        { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
        {
          rel: 'preconnect',
          href: 'https://fonts.gstatic.com',
          crossorigin: '',
        },
        { rel: 'preconnect', href: 'https://www.googletagmanager.com' },
      ],
      script: buildGtagHeadScripts(),
    },
  },

  nitro: {
    compressPublicAssets: true,
  },

  routeRules: {
    '/about': { redirect: '/get-in-touch' },
    '/contact': { redirect: '/get-in-touch' },
    '/services': { redirect: '/' },
    '/projects': { redirect: '/' },
    '/projects/**': { redirect: '/' },
    // Home/contact: conteúdo do Studio — sem SWR longo (evita HTML antigo após deploy)
    '/': { swr: false },
    '/pt': { swr: false },
    '/get-in-touch': { swr: 600 },
    '/pt/get-in-touch': { swr: 600 },
    '/uikit': { index: false },
    '/_studio/**': { ssr: true, index: false },
    '/studio-setup': { index: false },
    '/robots.txt': { headers: { 'cache-control': 'public, max-age=3600' } },
    '/sitemap.xml': { headers: { 'cache-control': 'public, max-age=3600' } },
    '/images/**': {
      headers: {
        'cache-control': `public, max-age=${STATIC_CACHE_MAX_AGE}, immutable`,
      },
    },
    '/fonts/**': {
      headers: {
        'cache-control': `public, max-age=${STATIC_CACHE_MAX_AGE}, immutable`,
      },
    },
    '/favicon.png': {
      headers: {
        'cache-control': `public, max-age=${STATIC_CACHE_MAX_AGE}, immutable`,
      },
    },
    '/favicon-32.png': {
      headers: {
        'cache-control': `public, max-age=${STATIC_CACHE_MAX_AGE}, immutable`,
      },
    },
    '/apple-touch-icon.png': {
      headers: {
        'cache-control': `public, max-age=${STATIC_CACHE_MAX_AGE}, immutable`,
      },
    },
    '/loading.png': {
      headers: { 'cache-control': 'public, max-age=86400' },
    },
    '/_nuxt/**': {
      headers: {
        'cache-control': `public, max-age=${STATIC_CACHE_MAX_AGE}, immutable`,
      },
    },
    '/.well-known/security.txt': {
      headers: { 'cache-control': 'public, max-age=86400' },
    },
  },
});
