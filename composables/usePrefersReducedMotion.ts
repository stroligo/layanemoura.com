export function usePrefersReducedMotion() {
  const prefersReducedMotion = ref(false);

  onMounted(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    const update = () => {
      prefersReducedMotion.value = mq.matches;
    };
    update();
    mq.addEventListener('change', update);
    onUnmounted(() => mq.removeEventListener('change', update));
  });

  return { prefersReducedMotion };
}
