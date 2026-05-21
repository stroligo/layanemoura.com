type PreloadOptions = {
  /** Primeiras imagens com prioridade imediata */
  priorityCount?: number;
  /** Downloads paralelos no restante */
  concurrency?: number;
};

const DEFAULT_PRIORITY = 12;
const DEFAULT_CONCURRENCY = 6;

function collectUrls(sources: Array<string | undefined>): string[] {
  return [...new Set(sources.filter((src): src is string => Boolean(src)))];
}

function preloadImage(src: string): Promise<void> {
  return new Promise((resolve) => {
    const img = new Image();
    img.decoding = 'async';
    img.onload = () => resolve();
    img.onerror = () => resolve();
    img.src = src;
  });
}

async function preloadQueue(
  urls: string[],
  concurrency: number,
): Promise<void> {
  for (let i = 0; i < urls.length; i += concurrency) {
    const batch = urls.slice(i, i + concurrency);
    await Promise.all(batch.map(preloadImage));
  }
}

/**
 * Pré-carrega capas da galeria no cache do browser (fetch via Image).
 */
export function usePreloadProjectImages(
  sources: MaybeRefOrGetter<Array<string | undefined>>,
  options: PreloadOptions = {},
) {
  const loaded = new Set<string>();

  async function preloadAll() {
    if (!import.meta.client) return;

    const priorityCount = options.priorityCount ?? DEFAULT_PRIORITY;
    const concurrency = options.concurrency ?? DEFAULT_CONCURRENCY;
    const urls = collectUrls(toValue(sources)).filter((src) => !loaded.has(src));

    if (!urls.length) return;

    const priority = urls.slice(0, priorityCount);
    const rest = urls.slice(priorityCount);

    await Promise.all(
      priority.map(async (src) => {
        await preloadImage(src);
        loaded.add(src);
      }),
    );

    const pending = rest.filter((src) => !loaded.has(src));
    await preloadQueue(pending, concurrency);
    pending.forEach((src) => loaded.add(src));
  }

  function schedulePreload() {
    if (!import.meta.client) return;

    const run = () => preloadAll();

    if ('requestIdleCallback' in window) {
      requestIdleCallback(run, { timeout: 2500 });
    } else {
      setTimeout(run, 150);
    }
  }

  onMounted(schedulePreload);

  return { preloadAll };
}
