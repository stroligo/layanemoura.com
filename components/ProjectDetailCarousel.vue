<template>
  <div
    ref="carouselRoot"
    class="project-detail-carousel"
    role="region"
    :aria-label="t('modal.galleryAria')"
    @mouseenter="stopAutoplay"
    @mouseleave="startAutoplay"
    @focusin="stopAutoplay"
    @focusout="startAutoplay"
  >
    <div v-if="images.length" class="project-detail-carousel-inner">
      <div
        class="project-detail-carousel-stage"
        role="tabpanel"
        :id="panelId"
        :aria-labelledby="activeThumbId"
        aria-live="polite"
        aria-atomic="true"
      >
        <button
          type="button"
          class="project-detail-carousel-zoom-trigger"
          :aria-label="t('modal.galleryZoomOpen')"
          @click="openLightbox"
        >
          <Transition name="project-slide-fade" mode="out-in">
            <img
              :key="activeSrc"
              :src="activeSrc"
              :alt="slideAlt"
              class="project-detail-carousel-img"
              decoding="async"
              fetchpriority="high"
            />
          </Transition>
          <span class="project-detail-carousel-zoom-badge" aria-hidden="true">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="1.75"
              stroke-linecap="round"
              stroke-linejoin="round"
              class="project-detail-carousel-zoom-badge__icon"
            >
              <circle cx="11" cy="11" r="7" />
              <path d="m21 21-4.35-4.35M11 8v6M8 11h6" />
            </svg>
          </span>
        </button>

        <template v-if="hasMultiple">
          <button
            type="button"
            class="project-detail-carousel-nav project-detail-carousel-nav--prev"
            :aria-label="t('modal.galleryPrev')"
            @click="prev"
          >
            <span aria-hidden="true">←</span>
          </button>
          <button
            type="button"
            class="project-detail-carousel-nav project-detail-carousel-nav--next"
            :aria-label="t('modal.galleryNext')"
            @click="next"
          >
            <span aria-hidden="true">→</span>
          </button>
        </template>
      </div>

      <div
        v-if="hasMultiple"
        class="project-detail-carousel-thumbs"
        role="tablist"
        :aria-label="t('modal.galleryThumbs')"
      >
        <button
          v-for="(src, index) in images"
          :key="`${src}-${index}`"
          :id="thumbId(index)"
          type="button"
          class="project-detail-carousel-thumb"
          :class="{ active: index === activeIndex }"
          role="tab"
          :aria-selected="index === activeIndex"
          :aria-controls="panelId"
          :tabindex="index === activeIndex ? 0 : -1"
          :aria-label="t('modal.galleryGoTo', { n: index + 1 })"
          @click="goTo(index)"
        >
          <OptimizedImage
            :src="src"
            variant="modalThumb"
            alt=""
            img-class="project-detail-carousel-thumb-img"
            decoding="async"
            loading="lazy"
          />
        </button>
      </div>
    </div>

    <ProjectImageLightbox
      v-if="lightboxOpen && activeSrc"
      :src="activeSrc"
      :alt="slideAlt"
      @close="closeLightbox"
    />
  </div>
</template>

<script setup lang="ts">
import { preloadAll } from '~/utils/imageLoading';

const props = defineProps<{
  images: string[];
  alt: string;
}>();

const { t } = useI18n();
const carouselRoot = ref<HTMLElement | null>(null);
const panelId = 'project-detail-carousel-panel';

const {
  activeIndex,
  activeSrc,
  hasMultiple,
  goTo,
  next,
  prev,
  startAutoplay,
  stopAutoplay,
} = useProjectDetailCarousel(() => props.images);

const activeThumbId = computed(() => thumbId(activeIndex.value));
const lightboxOpen = ref(false);

function openLightbox() {
  lightboxOpen.value = true;
}

function closeLightbox() {
  lightboxOpen.value = false;
}

watch(activeSrc, () => {
  if (lightboxOpen.value) closeLightbox();
});

watch(
  () => props.images,
  (urls) => {
    if (!import.meta.client || !urls.length) return;
    preloadAll(urls);
  },
  { immediate: true },
);

const slideAlt = computed(() => {
  if (!hasMultiple.value) return props.alt;
  return t('modal.gallerySlide', {
    alt: props.alt,
    current: activeIndex.value + 1,
    total: props.images.length,
  });
});

function thumbId(index: number) {
  return `project-detail-carousel-thumb-${index}`;
}

useCarouselKeyboard(carouselRoot, { onPrev: prev, onNext: next });
</script>
