import { usePrefersReducedMotion } from '~/composables/usePrefersReducedMotion';

const DEFAULT_INTERVAL_MS = 5500;

export function useProjectDetailCarousel(
  images: MaybeRefOrGetter<string[]>,
  options?: { intervalMs?: number },
) {
  const { prefersReducedMotion } = usePrefersReducedMotion();
  const activeIndex = ref(0);
  let timer: ReturnType<typeof setInterval> | null = null;

  const list = computed(() => toValue(images));
  const hasMultiple = computed(() => list.value.length > 1);
  const activeSrc = computed(() => list.value[activeIndex.value] ?? list.value[0]);

  function clampIndex(index: number) {
    const len = list.value.length;
    if (!len) return 0;
    return ((index % len) + len) % len;
  }

  function goTo(index: number) {
    activeIndex.value = clampIndex(index);
  }

  function next() {
    goTo(activeIndex.value + 1);
  }

  function prev() {
    goTo(activeIndex.value - 1);
  }

  function stopAutoplay() {
    if (timer) {
      clearInterval(timer);
      timer = null;
    }
  }

  function startAutoplay() {
    stopAutoplay();
    if (
      !import.meta.client ||
      list.value.length <= 1 ||
      prefersReducedMotion.value
    ) {
      return;
    }

    timer = setInterval(next, options?.intervalMs ?? DEFAULT_INTERVAL_MS);
  }

  watch(
    list,
    () => {
      activeIndex.value = 0;
      startAutoplay();
    },
    { immediate: true },
  );

  watch(prefersReducedMotion, () => {
    if (prefersReducedMotion.value) stopAutoplay();
    else startAutoplay();
  });

  onMounted(startAutoplay);
  onUnmounted(stopAutoplay);

  return {
    activeIndex,
    activeSrc,
    hasMultiple,
    goTo,
    next,
    prev,
    startAutoplay,
    stopAutoplay,
  };
}
