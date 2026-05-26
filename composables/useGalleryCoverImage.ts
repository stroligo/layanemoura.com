/**
 * Fade-in da capa na grelha. Não bloqueia no preload — o <img> e os preloads no head tratam disso.
 */
export function useGalleryCoverImage(
  src: MaybeRefOrGetter<string | undefined>,
  options?: { eager?: MaybeRefOrGetter<boolean> },
) {
  const isVisible = ref(false);

  function reveal() {
    isVisible.value = true;
  }

  watch(
    () => ({
      url: toValue(src),
      eager: Boolean(toValue(options?.eager)),
    }),
    ({ url, eager }) => {
      if (!url) {
        isVisible.value = false;
        return;
      }
      // SSR + capas prioritárias: visíveis de imediato (HTML já traz a grelha)
      if (import.meta.server || eager) {
        isVisible.value = true;
        return;
      }
      isVisible.value = false;
    },
    { immediate: true },
  );

  return { isVisible, reveal };
}
