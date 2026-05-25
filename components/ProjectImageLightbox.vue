<template>
  <Teleport to="body">
    <div
      class="image-lightbox"
      role="dialog"
      aria-modal="true"
      :aria-label="t('modal.lightboxAria')"
      @keydown.escape.prevent="emit('close')"
    >
      <button
        type="button"
        class="image-lightbox__backdrop"
        tabindex="-1"
        :aria-label="t('modal.close')"
        @click="emit('close')"
      />

      <div class="image-lightbox__chrome">
        <div class="image-lightbox__toolbar" role="toolbar" :aria-label="t('modal.lightboxToolbar')">
          <button
            type="button"
            class="image-lightbox__tool"
            :aria-label="t('modal.lightboxZoomOut')"
            :disabled="scale <= 1"
            @click="zoomOut"
          >
            <span aria-hidden="true">−</span>
          </button>
          <button
            type="button"
            class="image-lightbox__tool"
            :aria-label="t('modal.lightboxReset')"
            :disabled="scale === 1 && translateX === 0 && translateY === 0"
            @click="resetView"
          >
            <span aria-hidden="true">◎</span>
          </button>
          <button
            type="button"
            class="image-lightbox__tool"
            :aria-label="t('modal.lightboxZoomIn')"
            :disabled="scale >= 5"
            @click="zoomIn"
          >
            <span aria-hidden="true">+</span>
          </button>
        </div>

        <button
          type="button"
          class="image-lightbox__close"
          :aria-label="t('modal.close')"
          @click="emit('close')"
        >
          <span aria-hidden="true">×</span>
        </button>
      </div>

      <div
        ref="viewportRef"
        class="image-lightbox__viewport"
        :class="{ 'image-lightbox__viewport--pan': canPan }"
        tabindex="0"
        @wheel.prevent="onWheel"
        @pointerdown="onPointerDown"
        @pointermove="onPointerMove"
        @pointerup="onPointerUp"
        @pointercancel="onPointerUp"
      >
        <img
          :src="src"
          :alt="alt"
          class="image-lightbox__img"
          :style="transformStyle"
          decoding="async"
          fetchpriority="high"
          draggable="false"
        />
      </div>
    </div>
  </Teleport>
</template>

<script setup lang="ts">
const props = defineProps<{
  src: string;
  alt: string;
}>();

const emit = defineEmits<{
  close: [];
}>();

const { t } = useI18n();
const viewportRef = ref<HTMLElement | null>(null);

const {
  scale,
  translateX,
  translateY,
  canPan,
  transformStyle,
  resetView,
  zoomIn,
  zoomOut,
  applyWheelZoom,
  onPointerDown,
  onPointerMove,
  onPointerUp,
} = useImageZoomPan();

function onWheel(event: WheelEvent) {
  applyWheelZoom(event.deltaY);
}

watch(
  () => props.src,
  () => resetView(),
);

onMounted(() => {
  resetView();
  viewportRef.value?.focus();
});
</script>
