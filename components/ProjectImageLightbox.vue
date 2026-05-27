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
            :disabled="imageLoading || scale <= 1"
            @click="zoomOut"
          >
            <span aria-hidden="true">−</span>
          </button>
          <button
            type="button"
            class="image-lightbox__tool"
            :aria-label="t('modal.lightboxReset')"
            :disabled="imageLoading || (scale === 1 && translateX === 0 && translateY === 0)"
            @click="resetView"
          >
            <span aria-hidden="true">◎</span>
          </button>
          <button
            type="button"
            class="image-lightbox__tool"
            :aria-label="t('modal.lightboxZoomIn')"
            :disabled="imageLoading || scale >= 5"
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
        :class="{ 'image-lightbox__viewport--pan': canPan && !imageLoading }"
        :aria-busy="imageLoading"
        tabindex="0"
        @wheel.prevent="onWheel"
        @pointerdown="onPointerDown"
        @pointermove="onPointerMove"
        @pointerup="onPointerUp"
        @pointercancel="onPointerUp"
      >
        <div
          v-show="imageLoading"
          class="image-lightbox__loading"
          role="status"
          aria-live="polite"
        >
          <img
            src="/design/loading.png"
            alt=""
            class="image-lightbox__loading-spinner"
            width="50"
            height="50"
            decoding="async"
          />
          <p class="image-lightbox__loading-text">
            {{ t('modal.lightboxLoading') }}
          </p>
        </div>

        <img
          ref="imageRef"
          :key="src"
          :src="src"
          :alt="alt"
          class="image-lightbox__img"
          :class="{ 'image-lightbox__img--ready': !imageLoading }"
          :style="transformStyle"
          decoding="async"
          fetchpriority="high"
          draggable="false"
          @load="onImageLoad"
          @error="onImageError"
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
const imageRef = ref<HTMLImageElement | null>(null);

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
  if (imageLoading.value) return;
  applyWheelZoom(event.deltaY);
}

const imageLoading = ref(true);

function onImageLoad() {
  imageLoading.value = false;
}

function onImageError() {
  imageLoading.value = false;
}

function syncImageAlreadyLoaded() {
  const img = imageRef.value;
  if (img?.complete && img.naturalWidth > 0) {
    imageLoading.value = false;
  }
}

watch(
  () => props.src,
  () => {
    imageLoading.value = true;
    resetView();
    nextTick(syncImageAlreadyLoaded);
  },
);

onMounted(() => {
  resetView();
  nextTick(() => {
    syncImageAlreadyLoaded();
    viewportRef.value?.focus();
  });
});
</script>
