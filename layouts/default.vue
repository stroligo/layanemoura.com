<template>
  <div class="flex min-h-screen flex-col">
    <a href="#main-content" class="skip-link">{{ t('a11y.skipToContent') }}</a>
    <Header />
    <main id="main-content" class="main-with-nav" tabindex="-1">
      <slot />
    </main>
    <Footer />
  </div>
</template>

<script setup lang="ts">
const { t } = useI18n();
const route = useRoute();
const localePath = useLocalePath();
const { beginLoading, waitForPageImages } = usePageImageLoading();

function isHomePath(path: string) {
  const home = localePath('/');
  const normalized = path.replace(/\/+$/, '') || '/';
  const homeNorm = home.replace(/\/+$/, '') || '/';
  return normalized === homeNorm;
}

watch(
  () => route.path,
  async (path) => {
    if (isHomePath(path)) return;
    beginLoading();
    await nextTick();
    waitForPageImages([]);
  },
  { immediate: true },
);
</script>
