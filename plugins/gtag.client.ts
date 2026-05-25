/**
 * Page views em navegação SPA (gtag já está no <head> via useGtag em app.vue).
 */
export default defineNuxtPlugin(() => {
  const config = useRuntimeConfig();
  const id = (config.public.gtagId as string)?.trim();
  if (!id || !isValidGtagId(id)) return;

  const enabledInDev = config.public.gtagDev === true;
  if (!import.meta.prod && !enabledInDev) return;

  const router = useRouter();
  router.afterEach((to) => {
    window.gtag?.('config', id, { page_path: to.fullPath });
  });
});

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
  }
}
