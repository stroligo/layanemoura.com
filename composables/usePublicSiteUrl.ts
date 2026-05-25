import { resolveSiteUrl } from '~/utils/seo';

/** URL pública reactiva (canonical, OG, JSON-LD) com fallback ao host do pedido. */
export function usePublicSiteUrl() {
  const runtimeConfig = useRuntimeConfig();
  const requestURL = useRequestURL();

  return computed(() =>
    resolveSiteUrl(
      runtimeConfig.public.siteUrl as string | undefined,
      requestURL.origin,
    ),
  );
}
