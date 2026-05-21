/** Qualquer scroll fora do topo ativa logo compacta */
const DEFAULT_THRESHOLD = 0;

export function useNavCompact(threshold = DEFAULT_THRESHOLD) {
  const isCompact = ref(false);

  function update() {
    isCompact.value = window.scrollY > threshold;
  }

  function syncHtmlClass(compact: boolean) {
    document.documentElement.classList.toggle('nav-compact', compact);
  }

  if (import.meta.client) {
    onMounted(() => {
      update();
      syncHtmlClass(isCompact.value);
      window.addEventListener('scroll', update, { passive: true });
    });

    watch(isCompact, syncHtmlClass);

    onUnmounted(() => {
      window.removeEventListener('scroll', update);
      document.documentElement.classList.remove('nav-compact');
    });
  }

  return { isCompact };
}
