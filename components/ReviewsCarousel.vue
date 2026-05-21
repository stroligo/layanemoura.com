<template>
  <section class="reviews-section" aria-labelledby="reviews-heading">
    <div class="container-fluid wrap">
      <header class="reviews-header">
        <p class="font-inter text-xs font-medium uppercase tracking-[0.25em] text-terracotta">
          {{ t('reviews.eyebrow') }}
        </p>
        <h2 id="reviews-heading" class="mt-2 font-cormorant text-3xl text-cocoa md:text-4xl">
          {{ t('reviews.title') }}
        </h2>
      </header>

      <div
        class="reviews-carousel"
        @mouseenter="stopAutoplay"
        @mouseleave="startAutoplay"
        @focusin="stopAutoplay"
        @focusout="startAutoplay"
      >
        <div
          ref="viewportRef"
          class="reviews-carousel-viewport"
          role="group"
          aria-roledescription="carousel"
          :aria-label="
            t('reviews.carouselLabel', {
              current: activeIndex + 1,
              total: pageCount,
            })
          "
          @scroll.passive="syncIndexFromScroll"
        >
          <div class="reviews-track">
            <article
              v-for="(review, index) in reviews"
              :key="review.id"
              class="review-card"
              :aria-hidden="!isCardVisible(index)"
              :aria-current="index === activeIndex ? 'true' : undefined"
            >
              <blockquote class="review-quote font-cormorant">
                “{{ review.text }}”
              </blockquote>

              <footer class="review-author">
                <p class="review-author-name">{{ review.clientName }}</p>
                <p class="review-author-meta">
                  <span>{{ review.clientRole }}</span>
                  <template v-if="review.clientCompany">
                    <span class="review-author-sep" aria-hidden="true"> · </span>
                    <span>{{ review.clientCompany }}</span>
                  </template>
                </p>
                <p
                  v-if="review.projectType"
                  class="review-project-type"
                >
                  {{ review.projectType }}
                </p>
              </footer>
            </article>
          </div>
        </div>

        <div class="reviews-controls">
          <button
            type="button"
            class="reviews-nav-btn"
            :aria-label="t('reviews.prev')"
            @click="prev"
          >
            <span aria-hidden="true">←</span>
          </button>

          <div class="reviews-dots" role="tablist" :aria-label="t('reviews.choose')">
            <button
              v-for="page in pageCount"
              :key="page"
              type="button"
              class="reviews-dot"
              :class="{ active: page - 1 === activeIndex }"
              role="tab"
              :aria-selected="page - 1 === activeIndex"
              :aria-label="
                t('reviews.by', {
                  name: reviews[page - 1]?.clientName ?? '',
                })
              "
              @click="goTo(page - 1)"
            />
          </div>

          <button
            type="button"
            class="reviews-nav-btn"
            :aria-label="t('reviews.next')"
            @click="next"
          >
            <span aria-hidden="true">→</span>
          </button>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
const { t, locale } = useI18n();
const { reviews } = useSiteContent();

const viewportRef = ref<HTMLElement | null>(null);
const activeIndex = ref(0);
const perView = ref(1);

let autoplayTimer: ReturnType<typeof setInterval> | null = null;
let resizeObserver: ResizeObserver | null = null;
const AUTOPLAY_MS = 7000;
const MD_QUERY = '(min-width: 768px)';

const pageCount = computed(() => {
  const total = reviews.value.length;
  if (!total) return 0;
  return Math.max(1, total - perView.value + 1);
});

function updatePerView() {
  if (!import.meta.client) return;
  perView.value = window.matchMedia(MD_QUERY).matches ? 2 : 1;
  clampActiveIndex();
  nextTick(() => scrollToIndex(activeIndex.value, false));
}

function maxIndex() {
  return Math.max(0, pageCount.value - 1);
}

function clampActiveIndex() {
  activeIndex.value = Math.min(activeIndex.value, maxIndex());
}

function isCardVisible(index: number) {
  return index >= activeIndex.value && index < activeIndex.value + perView.value;
}

function getSlideStride(): number {
  const viewport = viewportRef.value;
  if (!viewport) return 0;
  const card = viewport.querySelector<HTMLElement>('.review-card');
  if (!card) return 0;
  const track = viewport.querySelector<HTMLElement>('.reviews-track');
  const gap = track
    ? Number.parseFloat(getComputedStyle(track).columnGap || getComputedStyle(track).gap || '0')
    : 0;
  return card.offsetWidth + gap;
}

function scrollToIndex(index: number, smooth = true) {
  const viewport = viewportRef.value;
  if (!viewport) return;

  const clamped = Math.max(0, Math.min(index, maxIndex()));
  const stride = getSlideStride();
  if (!stride) return;

  viewport.scrollTo({
    left: clamped * stride,
    behavior: smooth ? 'smooth' : 'instant',
  });
  activeIndex.value = clamped;
}

function syncIndexFromScroll() {
  const viewport = viewportRef.value;
  const stride = getSlideStride();
  if (!viewport || !stride) return;

  const index = Math.round(viewport.scrollLeft / stride);
  activeIndex.value = Math.max(0, Math.min(index, maxIndex()));
}

function goTo(index: number) {
  scrollToIndex(index);
}

function next() {
  if (!pageCount.value) return;
  scrollToIndex(activeIndex.value >= maxIndex() ? 0 : activeIndex.value + 1);
}

function prev() {
  if (!pageCount.value) return;
  scrollToIndex(activeIndex.value <= 0 ? maxIndex() : activeIndex.value - 1);
}

function startAutoplay() {
  stopAutoplay();
  autoplayTimer = setInterval(next, AUTOPLAY_MS);
}

function stopAutoplay() {
  if (autoplayTimer) {
    clearInterval(autoplayTimer);
    autoplayTimer = null;
  }
}

function onKeydown(e: KeyboardEvent) {
  if (e.key === 'ArrowLeft') prev();
  if (e.key === 'ArrowRight') next();
}

watch(locale, () => {
  activeIndex.value = 0;
  nextTick(() => scrollToIndex(0, false));
});

onMounted(() => {
  if (!import.meta.client) return;

  updatePerView();
  window.matchMedia(MD_QUERY).addEventListener('change', updatePerView);

  resizeObserver = new ResizeObserver(() => {
    syncIndexFromScroll();
  });
  if (viewportRef.value) {
    resizeObserver.observe(viewportRef.value);
  }

  startAutoplay();
  window.addEventListener('keydown', onKeydown);
});

onUnmounted(() => {
  stopAutoplay();
  window.matchMedia(MD_QUERY).removeEventListener('change', updatePerView);
  resizeObserver?.disconnect();
  if (import.meta.client) {
    window.removeEventListener('keydown', onKeydown);
  }
});
</script>
