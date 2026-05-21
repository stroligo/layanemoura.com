const TOP_THRESHOLD = 24;
/** Ignora micro-movimentos de scroll */
const SCROLL_DELTA = 6;

/**
 * Barra visível no topo ou ao rolar para cima; oculta ao rolar para baixo.
 */
export function useScrollRevealBar() {
  const isVisible = ref(true);
  let lastScrollY = 0;

  function update() {
    const y = window.scrollY;

    if (y <= TOP_THRESHOLD) {
      isVisible.value = true;
    } else if (y < lastScrollY - SCROLL_DELTA) {
      isVisible.value = true;
    } else if (y > lastScrollY + SCROLL_DELTA) {
      isVisible.value = false;
    }

    lastScrollY = y;
  }

  if (import.meta.client) {
    onMounted(() => {
      lastScrollY = window.scrollY;
      update();
      window.addEventListener('scroll', update, { passive: true });
    });

    onUnmounted(() => {
      window.removeEventListener('scroll', update);
    });
  }

  return { isVisible };
}
