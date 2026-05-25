/**
 * Google Analytics 4 (gtag.js) — page views em navegação SPA.
 * Ativo em produção; em dev só com NUXT_PUBLIC_GTAG_DEV=true.
 */
declare global {
  interface Window {
    dataLayer?: unknown[];
    gtag?: (...args: unknown[]) => void;
  }
}

export default defineNuxtPlugin(() => {
  const config = useRuntimeConfig();
  const id = (config.public.gtagId as string)?.trim();
  if (!id) return;

  const enabledInDev = config.public.gtagDev === true;
  if (!import.meta.prod && !enabledInDev) return;

  if (document.getElementById('lm-gtag-js')) return;

  window.dataLayer = window.dataLayer || [];
  window.gtag = function gtag(...args: unknown[]) {
    window.dataLayer!.push(args);
  };
  window.gtag('js', new Date());
  window.gtag('config', id);

  const loader = document.createElement('script');
  loader.id = 'lm-gtag-js';
  loader.async = true;
  loader.src = `https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(id)}`;
  document.head.appendChild(loader);

  const router = useRouter();
  router.afterEach((to) => {
    window.gtag?.('config', id, { page_path: to.fullPath });
  });
});
