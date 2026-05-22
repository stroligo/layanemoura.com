import { preloadAll } from '~/utils/imageLoading';

let activeRun = 0;

/** Pré-carrega capas da galeria sem bloquear o layout (skeletons mantêm o grid). */
export function useGalleryImageLoading() {
  async function waitForGalleryCovers(coverUrls: string[]) {
    if (!import.meta.client) return;

    const urls = [...new Set(coverUrls.filter(Boolean))];
    if (!urls.length) return;

    const runId = ++activeRun;
    try {
      await preloadAll(urls);
    } finally {
      if (runId !== activeRun) return;
    }
  }

  return { waitForGalleryCovers };
}
