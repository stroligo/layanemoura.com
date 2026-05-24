<template>
  <section
    v-if="reviews.length"
    class="reviews-section"
    aria-labelledby="reviews-heading"
  >
    <div class="container-fluid wrap">
      <header class="reviews-header">
        <p class="reviews-eyebrow">
          {{ t('reviews.eyebrow') }}
        </p>
        <h2 id="reviews-heading" class="reviews-title">
          {{ t('reviews.title') }}
        </h2>
      </header>

      <div
        ref="carouselRoot"
        class="reviews-carousel"
        @mouseenter="stopAutoplay"
        @mouseleave="startAutoplay"
        @focusin="stopAutoplay"
        @focusout="startAutoplay"
      >
        <div
          class="reviews-carousel-viewport"
          role="group"
          aria-roledescription="carousel"
          :aria-label="
            t('reviews.carouselLabel', {
              current: activePage + 1,
              total: pageCount,
            })
          "
        >
          <div
            class="reviews-track"
            :style="trackStyle"
            :data-pages="pageCount"
          >
            <div
              v-for="(page, pageIndex) in reviewPages"
              :key="pageIndex"
              class="reviews-slide"
              :aria-hidden="pageIndex !== activePage"
              :inert="pageIndex !== activePage"
            >
              <article
                v-for="review in page"
                :key="review.id"
                class="review-card"
              >
                <blockquote class="review-quote font-cormorant">
                  “{{ review.text }}”
                </blockquote>

                <footer class="review-author">
                  <p class="review-author-name">
                    {{ review.clientName }}
                    <template v-if="review.projectType">
                      <span class="review-author-sep" aria-hidden="true"> · </span>
                      <span class="review-project-type">{{ review.projectType }}</span>
                    </template>
                  </p>
                  <p class="review-author-meta">
                    <span>{{ review.clientRole }}</span>
                    <template v-if="review.clientCompany">
                      <span class="review-author-sep" aria-hidden="true"> · </span>
                      <span>{{ review.clientCompany }}</span>
                    </template>
                  </p>
                </footer>
              </article>
            </div>
          </div>
        </div>

        <div
          v-if="pageCount > 1"
          class="reviews-controls"
        >
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
              v-for="(_, pageIndex) in reviewPages"
              :key="pageIndex"
              type="button"
              class="reviews-dot"
              :class="{ active: pageIndex === activePage }"
              role="tab"
              :aria-selected="pageIndex === activePage"
              :tabindex="pageIndex === activePage ? 0 : -1"
              :aria-label="dotLabel(pageIndex)"
              @click="goTo(pageIndex)"
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
import type { ClientReview } from '~/types/review';
import { usePrefersReducedMotion } from '~/composables/usePrefersReducedMotion';

const { t, locale } = useI18n();
const { reviews } = useSiteContent();
const { prefersReducedMotion } = usePrefersReducedMotion();

const carouselRoot = ref<HTMLElement | null>(null);
const activePage = ref(0);
const perView = ref(1);

let autoplayTimer: ReturnType<typeof setInterval> | null = null;
const AUTOPLAY_MS = 5500;
const DESKTOP_QUERY = '(min-width: 1024px)';

const reviewPages = computed((): ClientReview[][] => {
  const items = reviews.value;
  const size = Math.max(1, perView.value);
  const pages: ClientReview[][] = [];
  for (let i = 0; i < items.length; i += size) {
    pages.push(items.slice(i, i + size));
  }
  return pages;
});

function updatePerView() {
  if (!import.meta.client) return;
  perView.value = window.matchMedia(DESKTOP_QUERY).matches ? 2 : 1;
  clampActivePage();
}

const pageCount = computed(() => reviewPages.value.length);

const trackStyle = computed(() => {
  const pages = Math.max(1, pageCount.value);
  const pageWidth = 100 / pages;
  return {
    '--reviews-pages': String(pages),
    width: `${pages * 100}%`,
    transform: `translate3d(-${activePage.value * pageWidth}%, 0, 0)`,
  };
});

function maxPage() {
  return Math.max(0, pageCount.value - 1);
}

function clampActivePage() {
  activePage.value = Math.min(activePage.value, maxPage());
}

function dotLabel(pageIndex: number) {
  const page = reviewPages.value[pageIndex];
  const name = page?.[0]?.clientName ?? '';
  return t('reviews.pageBy', { current: pageIndex + 1, name });
}

function goTo(page: number) {
  activePage.value = Math.max(0, Math.min(page, maxPage()));
}

function next() {
  if (!pageCount.value) return;
  goTo(activePage.value >= maxPage() ? 0 : activePage.value + 1);
}

function prev() {
  if (!pageCount.value) return;
  goTo(activePage.value <= 0 ? maxPage() : activePage.value - 1);
}

function startAutoplay() {
  if (pageCount.value <= 1 || prefersReducedMotion.value) return;
  stopAutoplay();
  autoplayTimer = setInterval(next, AUTOPLAY_MS);
}

function stopAutoplay() {
  if (autoplayTimer) {
    clearInterval(autoplayTimer);
    autoplayTimer = null;
  }
}

watch(locale, () => {
  activePage.value = 0;
});

watch(pageCount, () => {
  clampActivePage();
  startAutoplay();
});

watch(prefersReducedMotion, () => {
  if (prefersReducedMotion.value) stopAutoplay();
  else startAutoplay();
});

watch(
  () => reviews.value.length,
  () => {
    if (import.meta.client) startAutoplay();
  },
);

useCarouselKeyboard(carouselRoot, { onPrev: prev, onNext: next });

onMounted(() => {
  if (!import.meta.client) return;

  updatePerView();
  window.matchMedia(DESKTOP_QUERY).addEventListener('change', updatePerView);
  startAutoplay();
});

onUnmounted(() => {
  stopAutoplay();
  window.matchMedia(DESKTOP_QUERY).removeEventListener('change', updatePerView);
});
</script>
