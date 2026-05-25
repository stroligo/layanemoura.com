/** Variantes geradas por `npm run images:optimize`. */
export type ImageVariant = 'thumb' | 'lg' | 'modalThumb' | 'full';

const VARIANT_SUFFIX: Record<Exclude<ImageVariant, 'full'>, string> = {
  thumb: 'thumb',
  lg: 'lg',
};

const LOCAL_IMAGE = /^\/images\//i;
const RASTER_EXT = /\.(jpe?g|png|webp|avif)$/i;
const GENERATED_EXT = /\.(thumb|lg)\.(jpe?g|webp|avif)$/i;

export function isOptimizableLocalImage(src: string): boolean {
  const path = src.trim();
  if (!LOCAL_IMAGE.test(path) || /^https?:\/\//i.test(path)) return false;
  if (!RASTER_EXT.test(path)) return false;
  if (GENERATED_EXT.test(path)) return false;
  return true;
}

/** Caminho base sem extensão: `/images/projects/foo.jpg` → `/images/projects/foo`. */
export function imageBasePath(src: string): string {
  return src.replace(RASTER_EXT, '');
}

export function imageVariantPath(
  src: string,
  variant: Exclude<ImageVariant, 'full'>,
  format: 'webp' | 'jpeg',
): string {
  return `${imageBasePath(src)}.${VARIANT_SUFFIX[variant]}.${format === 'jpeg' ? 'jpg' : 'webp'}`;
}

export function imageVariantSources(src: string, variant: Exclude<ImageVariant, 'full'>) {
  if (!isOptimizableLocalImage(src)) {
    return { webp: src, jpeg: src, fallback: src };
  }
  return {
    webp: imageVariantPath(src, variant, 'webp'),
    jpeg: imageVariantPath(src, variant, 'jpeg'),
    fallback: imageVariantPath(src, variant, 'jpeg'),
  };
}

/** Capa da grelha (~800px, alta qualidade). */
export function galleryCoverSources(src: string) {
  return imageVariantSources(src, 'thumb');
}

/** Modal / lightbox — ficheiro original (máxima qualidade). */
export function galleryDetailSources(src: string) {
  const path = src.trim();
  return { webp: path, jpeg: path, fallback: path };
}

/** Miniaturas no modal — variantes `.lg` em alta qualidade (só navegação). */
export function galleryModalThumbSources(src: string) {
  if (!isOptimizableLocalImage(src)) {
    return galleryDetailSources(src);
  }
  return imageVariantSources(src, 'lg');
}
