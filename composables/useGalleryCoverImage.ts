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
    () => toValue(src),
    (url) => {
      if (!url) {
        isVisible.value = false;
        return;
      }
      // Só esconde ao trocar de imagem; não ao mudar priority (reordenação por tag).
      if (import.meta.server || Boolean(toValue(options?.eager))) {
        isVisible.value = true;
        return;
      }
      isVisible.value = false;
    },
    { immediate: true },
  );

  watch(
    () => Boolean(toValue(options?.eager)),
    (eager) => {
      if (eager) isVisible.value = true;
    },
  );

  return { isVisible, reveal };
}
