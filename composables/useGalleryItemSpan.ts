import type { GalleryLayout } from '~/types/project';

const ROW_UNIT_PX = 8;
/** Proporção aproximada (largura × altura) quando ainda não há imagem */
const LAYOUT_SIZE: Record<GalleryLayout, { w: number; h: number }> = {
  tall: { w: 4, h: 5 },
  wide: { w: 16, h: 10 },
  normal: { w: 4, h: 3 },
};

const MAX_H_VAR: Record<GalleryLayout, string> = {
  normal: '--gallery-max-h-normal',
  wide: '--gallery-max-h-wide',
  tall: '--gallery-max-h-tall',
};

function readCssPx(varName: string, fallback: number) {
  if (!import.meta.client) return fallback;
  const raw = getComputedStyle(document.documentElement)
    .getPropertyValue(varName)
    .trim();
  if (!raw) return fallback;
  const rootPx = Number.parseFloat(getComputedStyle(document.documentElement).fontSize) || 16;
  if (raw.endsWith('rem')) return Number.parseFloat(raw) * rootPx;
  if (raw.endsWith('px')) return Number.parseFloat(raw);
  return fallback;
}

function readAspectTallThreshold() {
  if (!import.meta.client) return 1.3;
  const raw = getComputedStyle(document.documentElement)
    .getPropertyValue('--gallery-aspect-tall')
    .trim();
  const n = Number.parseFloat(raw);
  return Number.isFinite(n) && n > 0 ? n : 1.3;
}

export function useGalleryItemSpan(
  root: Ref<HTMLElement | null>,
  layout: GalleryLayout,
) {
  const gridRowEnd = ref<string | undefined>();
  /** Proporção do cartão na grelha (largura / altura visível, com max-height). */
  const displayAspect = ref<string | null>(null);
  const isPortrait = ref(false);

  function getGridMetrics(grid: HTMLElement) {
    const style = getComputedStyle(grid);
    const gap = Number.parseFloat(style.rowGap || style.gap) || 16;
    const template = style.gridTemplateColumns;
    const colCount = template.split(' ').filter(Boolean).length || 1;
    const gridWidth = grid.clientWidth;
    const colWidth = (gridWidth - gap * (colCount - 1)) / colCount;

    return { gap, colCount, colWidth };
  }

  function getColumnSpan(
    el: HTMLElement,
    colCount: number,
    aspect: number,
  ) {
    const tallThreshold = readAspectTallThreshold();
    if (aspect >= tallThreshold) return 1;
    if (el.classList.contains('gallery-item--wide')) {
      return Math.min(2, colCount);
    }
    return 1;
  }

  function getMaxDisplayHeight(colSpan: number, aspect: number) {
    const tallThreshold = readAspectTallThreshold();
    if (aspect >= tallThreshold) {
      return readCssPx('--gallery-max-h-tall', 512);
    }
    if (colSpan >= 2) {
      return readCssPx('--gallery-max-h-wide', 448);
    }
    if (layout === 'tall') {
      return readCssPx('--gallery-max-h-tall', 512);
    }
    return readCssPx(MAX_H_VAR[layout], 352);
  }

  function applySpan(width: number, height: number) {
    const el = root.value;
    const grid = el?.closest('.gallery-organic') as HTMLElement | null;
    if (!el || !grid || width <= 0 || height <= 0) return;

    const aspect = height / width;
    const tallThreshold = readAspectTallThreshold();
    isPortrait.value = aspect >= tallThreshold;

    const { gap, colCount, colWidth } = getGridMetrics(grid);
    const colSpan = getColumnSpan(el, colCount, aspect);
    const itemWidth = colSpan * colWidth + gap * (colSpan - 1);
    const naturalHeight = itemWidth * aspect;
    const maxHeight = getMaxDisplayHeight(colSpan, aspect);
    const displayHeight = Math.min(naturalHeight, maxHeight);
    const span = Math.max(
      1,
      Math.ceil((displayHeight + gap) / (ROW_UNIT_PX + gap)),
    );

    gridRowEnd.value = `span ${span}`;
    displayAspect.value = `${Math.round(itemWidth)} / ${Math.round(displayHeight)}`;
  }

  function measureFromImage(img: HTMLImageElement) {
    if (img.naturalWidth > 0 && img.naturalHeight > 0) {
      applySpan(img.naturalWidth, img.naturalHeight);
    }
  }

  function measureFromLayout() {
    const { w, h } = LAYOUT_SIZE[layout];
    displayAspect.value = `${w} / ${h}`;
    applySpan(w, h);
  }

  function remeasure() {
    const img = root.value?.querySelector<HTMLImageElement>('.gallery-item-img');
    if (img?.complete && img.naturalWidth > 0 && img.naturalHeight > 0) {
      measureFromImage(img);
      return;
    }
    measureFromLayout();
  }

  function onImageLoad(event: Event) {
    const target = event.target;
    if (!(target instanceof HTMLImageElement)) return;
    if (target.naturalWidth > 0 && target.naturalHeight > 0) {
      measureFromImage(target);
    }
  }

  onMounted(() => {
    if (!import.meta.client) return;

    nextTick(remeasure);

    const grid = root.value?.closest('.gallery-organic');
    if (!grid) return;

    const observer = new ResizeObserver(() => remeasure());
    observer.observe(grid);
    onUnmounted(() => observer.disconnect());
  });

  return {
    gridRowEnd,
    displayAspect,
    isPortrait,
    onImageLoad,
    remeasure,
  };
}
