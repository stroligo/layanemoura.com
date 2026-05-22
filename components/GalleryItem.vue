<template>
  <button
    ref="root"
    type="button"
    class="gallery-item"
    :class="[
      `gallery-item--${project.layout}`,
      {
        'gallery-item--dimmed': dimmed,
        'gallery-item--portrait': isPortrait,
      },
    ]"
    :style="gridRowEnd ? { gridRowEnd } : undefined"
    :disabled="dimmed"
    :aria-disabled="dimmed || undefined"
    :aria-label="
      t('gallery.viewProject', {
        title: project.title,
        subtitle: project.subtitle,
      })
    "
    @click="$emit('select', project)"
  >
    <div class="gallery-item-visual" :style="visualAspectStyle">
      <img
        v-if="coverImage"
        :src="coverImage"
        alt=""
        class="gallery-item-img"
        :width="imageWidth"
        :height="imageHeight"
        sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 280px"
        :loading="priority ? 'eager' : 'lazy'"
        decoding="async"
        :fetchpriority="priority ? 'high' : 'auto'"
        @load="onImageReady"
      />
    </div>
  </button>
</template>

<script setup lang="ts">
import type { Project } from '~/types/project';
import { projectCoverImage } from '~/types/project';

const { t } = useI18n();

const props = withDefaults(
  defineProps<{ project: Project; dimmed?: boolean; priority?: boolean }>(),
  { dimmed: false, priority: false },
);

const imageDimensions = computed(() => {
  switch (props.project.layout) {
    case 'tall':
      return { width: 320, height: 400 };
    case 'wide':
      return { width: 480, height: 300 };
    default:
      return { width: 320, height: 240 };
  }
});

const imageWidth = computed(() => imageDimensions.value.width);
const imageHeight = computed(() => imageDimensions.value.height);

defineEmits<{
  select: [project: Project];
}>();

const coverImage = computed(() => projectCoverImage(props.project));

const root = ref<HTMLElement | null>(null);
const { gridRowEnd, displayAspect, isPortrait, onImageLoad, remeasure } =
  useGalleryItemSpan(root, props.project.layout);

const layoutAspect = computed(() => {
  switch (props.project.layout) {
    case 'tall':
      return '4 / 5';
    case 'wide':
      return '16 / 10';
    default:
      return '4 / 3';
  }
});

const visualAspectStyle = computed(() => ({
  aspectRatio: displayAspect.value ?? layoutAspect.value,
}));

function onImageReady(event: Event) {
  onImageLoad(event);
}

watch(
  () => coverImage.value,
  () => nextTick(remeasure),
);

watch(
  () => props.project.layout,
  () => nextTick(remeasure),
);

onMounted(() => {
  nextTick(remeasure);

  if (!import.meta.client || !coverImage.value) return;

  const img = root.value?.querySelector<HTMLImageElement>('.gallery-item-img');
  if (img?.complete && img.naturalWidth > 0) {
    remeasure();
  }
});
</script>
