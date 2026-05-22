export function delay(ms: number) {
  return new Promise<void>((resolve) => setTimeout(resolve, ms));
}

export function rafTwice(): Promise<void> {
  return new Promise((resolve) => {
    requestAnimationFrame(() => requestAnimationFrame(() => resolve()));
  });
}

export function normalizeSrc(src: string) {
  if (!import.meta.client) return src;
  try {
    return new URL(src, window.location.origin).href;
  } catch {
    return src;
  }
}

export function preloadImage(src: string): Promise<void> {
  return new Promise((resolve) => {
    const img = new Image();
    img.decoding = 'async';
    img.onload = () => resolve();
    img.onerror = () => resolve();
    img.src = src;
  });
}

export async function preloadAll(urls: string[], concurrency = 6) {
  const unique = [...new Set(urls.filter(Boolean))];
  for (let i = 0; i < unique.length; i += concurrency) {
    const batch = unique.slice(i, i + concurrency);
    await Promise.all(batch.map((src) => preloadImage(src)));
  }
}

function waitImageElement(img: HTMLImageElement): Promise<void> {
  if (img.complete && img.naturalWidth > 0) return Promise.resolve();
  return new Promise((resolve) => {
    img.addEventListener('load', () => resolve(), { once: true });
    img.addEventListener('error', () => resolve(), { once: true });
  });
}

function imageMatchesExpected(img: HTMLImageElement, expected: Set<string>) {
  const src = img.currentSrc || img.getAttribute('src') || '';
  if (!src) return false;
  return expected.has(normalizeSrc(src));
}

export type WaitForImagesOptions = {
  rootSelector?: string;
  imgSelector?: string;
  maxAttempts?: number;
};

/**
 * Espera preload + <img> no DOM (opcionalmente dentro de um contentor).
 */
export async function waitForImagesReady(
  expectedUrls: string[],
  options: WaitForImagesOptions = {},
): Promise<void> {
  if (!import.meta.client) return;

  const expected = new Set(expectedUrls.map(normalizeSrc));
  const rootSelector = options.rootSelector;
  const imgSelector = options.imgSelector ?? 'img[src]';
  const maxAttempts = options.maxAttempts ?? 80;

  if (expected.size) {
    await preloadAll([...expected]);
  }

  for (let attempt = 0; attempt < maxAttempts; attempt++) {
    await nextTick();
    await rafTwice();

    const root = rootSelector
      ? document.querySelector(rootSelector)
      : document;
    const imgs = root
      ? Array.from(root.querySelectorAll<HTMLImageElement>(imgSelector))
      : [];

    const targets =
      expected.size > 0
        ? imgs.filter((img) => imageMatchesExpected(img, expected))
        : imgs;

    if (expected.size > 0 && targets.length < expected.size) {
      await delay(50);
      continue;
    }

    if (expected.size === 0 && targets.length === 0) {
      await delay(50);
      continue;
    }

    const pending = targets.filter(
      (img) => !img.complete || img.naturalWidth === 0,
    );

    if (pending.length === 0) {
      await rafTwice();
      return;
    }

    await Promise.all(pending.map(waitImageElement));
    await rafTwice();
    return;
  }
}
