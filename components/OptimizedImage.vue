<template>
  <picture v-if="useVariants">
    <source :type="webpType" :srcset="sources.webp" />
    <img
      :src="sources.jpeg"
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
  </picture>
  <img
    v-else
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
  galleryDetailSources,
  galleryModalThumbSources,
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

const webpType = 'image/webp';

const sources = computed(() => {
  if (props.variant === 'full') return galleryDetailSources(props.src);
  if (props.variant === 'modalThumb') return galleryModalThumbSources(props.src);
  if (props.variant === 'lg') return galleryModalThumbSources(props.src);
  return galleryCoverSources(props.src);
});

const useVariants = computed(() => {
  if (props.variant === 'full') return false;
  return (
    sources.value.webp !== props.src.trim()
    && sources.value.jpeg !== props.src.trim()
  );
});

const displaySrc = computed(() =>
  useVariants.value ? sources.value.jpeg : props.src.trim(),
);

function onImgError(event: Event) {
  const img = event.target as HTMLImageElement | null;
  if (!img || img.dataset.fallback === '1') return;
  const original = props.src.trim();
  if (img.src.includes(original) || !useVariants.value) return;
  img.dataset.fallback = '1';
  img.src = original;
}
</script>
