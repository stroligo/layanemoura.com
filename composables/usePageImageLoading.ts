import { waitForImagesReady } from '~/utils/imageLoading';

function setPageLoadingActive(active: boolean) {
  if (!import.meta.client) return;
  document.body.style.overflow = active ? 'hidden' : '';
}

let activeRun = 0;

/** Loading de página inteira (ex.: foto em Get in touch). */
export function usePageImageLoading() {
  const isLoading = useState('page-image-loading', () => false);

  function beginLoading() {
    if (!import.meta.client) return;
    isLoading.value = true;
    setPageLoadingActive(true);
  }

  async function waitForPageImages(urls: string[] = []) {
    if (!import.meta.client) return;

    const runId = ++activeRun;
    beginLoading();

    try {
      await waitForImagesReady(urls);
    } finally {
      if (runId === activeRun) {
        isLoading.value = false;
        setPageLoadingActive(false);
      }
    }
  }

  return { isLoading, beginLoading, waitForPageImages };
}
