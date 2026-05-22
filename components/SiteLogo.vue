<template>
  <NuxtLink
    :to="localePath('/')"
    class="site-logo group leading-none no-underline"
    :class="variant === 'footer' ? 'site-logo--footer' : ''"
    :aria-label="t('nav.homeAria', { name: site.name })"
    @click="onLogoClick"
  >
    <LogoSignatureDraw
      :animate="variant === 'default'"
      :inverted="variant === 'footer'"
    />
  </NuxtLink>
</template>

<script setup lang="ts">
import { site } from '~/data/site';

const { t } = useI18n();
const localePath = useLocalePath();

withDefaults(defineProps<{ variant?: 'default' | 'footer' }>(), {
  variant: 'default',
});

const route = useRoute();

function normalizePath(path: string) {
  const trimmed = path.replace(/\/+$/, '');
  return trimmed || '/';
}

function isOnHome() {
  return normalizePath(route.path) === normalizePath(localePath('/'));
}

function scrollToTop() {
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  window.scrollTo({ top: 0, behavior: reduced ? 'auto' : 'smooth' });
}

function onLogoClick(event: MouseEvent) {
  if (!import.meta.client || !isOnHome()) return;

  event.preventDefault();
  scrollToTop();
}
</script>
