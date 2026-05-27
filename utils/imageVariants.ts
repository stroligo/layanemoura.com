/** Variantes geradas por `npm run images:optimize`. */
export type ImageVariant = 'thumb' | 'display' | 'modalThumb';

const LOCAL_IMAGE = /^\/images\//i;
const RASTER_EXT = /\.(jpe?g|png|webp|avif)$/i;
const GENERATED_EXT = /\.(thumb|display)\.webp$/i;

export function isOptimizableLocalImage(src: string): boolean {
  const path = src.trim();
  if (!LOCAL_IMAGE.test(path) || /^https?:\/\//i.test(path)) return false;
  if (!RASTER_EXT.test(path)) return false;
  if (GENERATED_EXT.test(path)) return false;
  return true;
}

export function imageBasePath(src: string): string {
  return src.replace(RASTER_EXT, '');
}

function variantPath(src: string, suffix: 'thumb' | 'display'): string {
  return `${imageBasePath(src)}.${suffix}.webp`;
}

/** ~800px — grelha + miniaturas do slider. */
export function imageThumbUrl(src: string): string {
  if (!isOptimizableLocalImage(src)) return src.trim();
  return variantPath(src, 'thumb');
}

/** ~2000px — imagem principal do slider no modal. */
export function imageDisplayUrl(src: string): string {
  if (!isOptimizableLocalImage(src)) return src.trim();
  return variantPath(src, 'display');
}

/** Master WebP (YAML) — só lightbox. */
export function projectMasterSrc(src: string): string {
  return src.trim();
}

export function galleryCoverSources(src: string) {
  const url = imageThumbUrl(src);
  return { webp: url, src: url };
}

export function galleryModalThumbSources(src: string) {
  const url = imageThumbUrl(src);
  return { webp: url, src: url };
}

export function galleryDisplaySources(src: string) {
  const url = imageDisplayUrl(src);
  return { webp: url, src: url };
}
