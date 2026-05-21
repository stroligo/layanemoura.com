<template>
  <div class="gallery-toolbar-anchor">
    <div
      class="gallery-toolbar-spacer"
      :style="spacerStyle"
      aria-hidden="true"
    />
    <div
      ref="toolbarEl"
      class="gallery-toolbar"
      :class="{ 'gallery-toolbar--hidden': !isVisible }"
    >
      <GalleryFilter
        :group="group"
        :highlight-category="highlightCategory"
        @update:group="emit('update:group', $event)"
        @update:highlight-category="emit('update:highlight-category', $event)"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import type { GalleryGroup, ProjectCategory } from '~/data/site';

defineProps<{
  group: GalleryGroup;
  highlightCategory: ProjectCategory | null;
}>();

const emit = defineEmits<{
  'update:group': [value: GalleryGroup];
  'update:highlight-category': [value: ProjectCategory | null];
}>();

const { isVisible } = useScrollRevealBar();
const toolbarEl = ref<HTMLElement | null>(null);
const toolbarHeight = ref(0);

const spacerStyle = computed(() =>
  toolbarHeight.value > 0 ? { height: `${toolbarHeight.value}px` } : undefined,
);

function measureToolbar() {
  if (toolbarEl.value) {
    toolbarHeight.value = toolbarEl.value.offsetHeight;
  }
}

if (import.meta.client) {
  onMounted(() => {
    measureToolbar();
    const observer = new ResizeObserver(measureToolbar);
    if (toolbarEl.value) observer.observe(toolbarEl.value);
    onUnmounted(() => observer.disconnect());
  });
}
</script>
