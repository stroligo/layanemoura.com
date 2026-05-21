import { defineNuxtConfig } from 'nuxt/config';
import tailwindcss from '@tailwindcss/vite';

export default defineNuxtConfig({
  compatibilityDate: '2026-05-08',

  devtools: { enabled: true },

  css: ['~/src/css/main.css'],

  modules: ['nuxt-svgo', '@nuxt/eslint', '@nuxtjs/i18n'],

  i18n: {
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
    detectBrowserLanguage: {
      useCookie: true,
      cookieKey: 'lm_locale',
      redirectOn: 'root',
    },
  },

  svgo: {
    autoImportPath: './assets/images/icons',
    svgoConfig: {
      plugins: [
        {
          name: 'removeAttrs',
          params: {
            attrs: '(fill|stroke)',
          },
        },
      ],
    },
  },

  vite: {
    plugins: [tailwindcss()],
  },

  app: {
    baseURL: '/',
    head: {
      htmlAttrs: { lang: 'en' }, // atualizado em runtime pelo @nuxtjs/i18n
      title: 'Layane Moura — Illustrator & Map Maker',
      meta: [
        {
          name: 'description',
          content:
            'Brazilian illustrator turning real and imaginary places into sensitive, organic narratives. Fantasy maps, travel illustration, book covers and editorial work.',
        },
        { property: 'og:type', content: 'website' },
        {
          property: 'og:title',
          content: 'Layane Moura — Illustrator & Map Maker',
        },
        {
          property: 'og:description',
          content:
            'Fantasy maps, travel illustration, book covers and editorial work by Layane Moura.',
        },
        { property: 'og:image', content: '/share-img.svg' },
        { name: 'twitter:card', content: 'summary_large_image' },
      ],
      link: [
        { rel: 'icon', href: '/favicon.svg', type: 'image/svg+xml' },
        { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
        {
          rel: 'preconnect',
          href: 'https://fonts.gstatic.com',
          crossorigin: '',
        },
        {
          rel: 'stylesheet',
          href: 'https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,500;0,600;0,700;1,400&family=Delius&family=Inter:wght@400;500;600&display=swap',
        },
      ],
    },
  },

  nitro: {
    output: {
      publicDir: 'build',
    },
  },

  routeRules: {
    '/about': { redirect: '/get-in-touch' },
    '/contact': { redirect: '/get-in-touch' },
    '/services': { redirect: '/' },
    '/projects': { redirect: '/' },
    '/projects/**': { redirect: '/' },
  },
});
