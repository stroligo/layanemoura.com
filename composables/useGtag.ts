const GTAG_ID_PATTERN = /^G-[A-Z0-9]+$/;

export function isValidGtagId(id: string) {
  return GTAG_ID_PATTERN.test(id.trim());
}

/**
 * Em dev (NUXT_PUBLIC_GTAG_DEV=true) injeta gtag no head.
 * Em produção os scripts vêm do nuxt.config (SSR, detectável pelo Google).
 */
export function useGtag() {
  const config = useRuntimeConfig();
  const id = (config.public.gtagId as string)?.trim() ?? '';
  const enabledInDev = config.public.gtagDev === true;
  const active =
    Boolean(id && isValidGtagId(id))
    && (import.meta.prod || enabledInDev);

  if (active && import.meta.dev && enabledInDev) {
    const initScript = [
      'window.dataLayer=window.dataLayer||[];',
      'function gtag(){dataLayer.push(arguments);}',
      "gtag('js',new Date());",
      `gtag('config','${id}');`,
    ].join('');

    useHead({
      script: [
        {
          key: 'gtag-js',
          src: `https://www.googletagmanager.com/gtag/js?id=${id}`,
          async: true,
        },
        {
          key: 'gtag-init',
          innerHTML: initScript,
          type: 'text/javascript',
        },
      ],
    });
  }

  return { id, active };
}
