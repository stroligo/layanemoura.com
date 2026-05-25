import { preloadImage } from '~/utils/imageLoading';
import { galleryCoverSources } from '~/utils/imageVariants';

/**
 * Pré-carrega a capa e expõe quando pode aparecer com fade-in.
 */
export function useGalleryCoverImage(
  src: MaybeRefOrGetter<string | undefined>,
) {
  const isVisible = ref(false);
  let activeRun = 0;

  function reveal() {
    isVisible.value = true;
  }

  async function startPreload() {
    const url = toValue(src);
    const run = ++activeRun;

    if (!url) {
      isVisible.value = false;
      return;
    }

    if (!import.meta.client) {
      isVisible.value = false;
      return;
    }

    isVisible.value = false;
    const { webp, jpeg } = galleryCoverSources(url);
    await preloadImage(webp).catch(() => preloadImage(jpeg));
    if (run === activeRun) reveal();
  }

  watch(() => toValue(src), () => startPreload(), { immediate: true });

  return { isVisible, reveal };
}
