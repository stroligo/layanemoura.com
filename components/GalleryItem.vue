<template>
  <button
    ref="root"
    type="button"
    class="gallery-item"
    :class="[
      `gallery-item--${project.layout}`,
      { 'gallery-item--dimmed': dimmed, 'gallery-item--portrait': isPortrait },
    ]"
    :style="gridRowEnd ? { gridRowEnd } : undefined"
    :aria-label="`View ${project.title} — ${project.subtitle}`"
    @click="$emit('select', project)"
  >
    <div class="gallery-item-visual">
      <img
        v-if="project.image"
        :src="project.image"
        :alt="`${project.title}, ${project.subtitle}`"
        class="gallery-item-img"
        loading="lazy"
        decoding="async"
        @load="onImageLoad"
      />
      <div
        v-else
        class="gallery-item-placeholder"
        :style="placeholderStyle"
        aria-hidden="true"
      />
    </div>
  </button>
</template>

<script setup lang="ts">
import type { Project } from '~/data/projects';

const props = withDefaults(
  defineProps<{ project: Project; dimmed?: boolean }>(),
  { dimmed: false },
);

defineEmits<{
  select: [project: Project];
}>();

const root = ref<HTMLElement | null>(null);
const { gridRowEnd, isPortrait, onImageLoad, remeasure } = useGalleryItemSpan(
  root,
  props.project.layout,
);

const placeholderStyle = computed(() => ({
  aspectRatio: String(
    props.project.layout === 'tall'
      ? '4 / 5'
      : props.project.layout === 'wide'
        ? '16 / 10'
        : '4 / 3',
  ),
  background: `linear-gradient(165deg, color-mix(in srgb, ${props.project.thumbFrom} 75%, #faf8f4) 0%, color-mix(in srgb, ${props.project.thumbTo} 60%, #5a3e2b) 100%)`,
}));

watch(
  () => props.project.image,
  () => nextTick(remeasure),
);

onMounted(() => {
  if (!props.project.image) {
    nextTick(remeasure);
  }
});
</script>
