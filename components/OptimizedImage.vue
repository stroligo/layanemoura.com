<template>
  <img
    :src="displaySrc"
    :alt="alt"
    :class="imgClass"
    :style="imgStyle"
    :width="width"
    :height="height"
    :sizes="sizes"
    :loading="loading"
    :decoding="decoding"
    :fetchpriority="fetchpriority"
    :draggable="draggable"
    @load="emit('load', $event)"
    @error="onImgError"
  />
</template>

<script setup lang="ts">
import {
  galleryCoverSources,
  galleryDisplaySources,
  galleryModalThumbSources,
  imageDisplayUrl,
  imageThumbUrl,
  isOptimizableLocalImage,
  type ImageVariant,
} from '~/utils/imageVariants';

const props = withDefaults(
  defineProps<{
    src: string;
    alt?: string;
    variant?: ImageVariant;
    imgClass?: string;
    width?: number;
    height?: number;
    sizes?: string;
    loading?: 'eager' | 'lazy' | undefined;
    decoding?: 'async' | 'auto' | 'sync';
    fetchpriority?: 'high' | 'low' | 'auto';
    imgStyle?: Record<string, string | number>;
    draggable?: boolean | 'true' | 'false';
  }>(),
  {
    alt: '',
    variant: 'thumb',
    decoding: 'async',
    fetchpriority: 'auto',
  },
);

const emit = defineEmits<{
  load: [event: Event];
}>();

const displaySrc = computed(() => {
  if (!isOptimizableLocalImage(props.src)) return props.src.trim();
  if (props.variant === 'display') {
    return galleryDisplaySources(props.src).webp;
  }
  if (props.variant === 'modalThumb') {
    return galleryModalThumbSources(props.src).webp;
  }
  return galleryCoverSources(props.src).webp;
});

function onImgError(event: Event) {
  const img = event.target as HTMLImageElement | null;
  if (!img || img.dataset.fallback === '1') return;
  const master = props.src.trim();
  if (!isOptimizableLocalImage(master)) return;

  const primary =
    props.variant === 'display' ? imageDisplayUrl(master) : imageThumbUrl(master);
  if (!img.src.includes(primary)) return;

  img.dataset.fallback = '1';
  img.src = master;
}
</script>
