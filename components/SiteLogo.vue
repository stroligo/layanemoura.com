<template>
  <NuxtLink
    :to="localePath('/')"
    class="site-logo group leading-none no-underline"
    :aria-label="t('nav.homeAria', { name: site.name })"
    @click="onLogoClick"
  >
    <img
      :src="logoSrc"
      :alt="site.name"
      class="site-logo-img"
      :class="variant === 'footer' ? 'site-logo-img--footer' : ''"
      decoding="async"
    />
  </NuxtLink>
</template>

<script setup lang="ts">
import { site } from '~/data/site';
import logoSrc from '~/assets/images/logo.png';

const { t } = useI18n();
const localePath = useLocalePath();

const props = withDefaults(
  defineProps<{ variant?: 'default' | 'footer' }>(),
  { variant: 'default' },
);

const route = useRoute();

function normalizePath(path: string) {
  const trimmed = path.replace(/\/+$/, '');
  return trimmed || '/';
}

function isOnHome() {
  return normalizePath(route.path) === normalizePath(localePath('/'));
}

function onLogoClick(event: MouseEvent) {
  if (props.variant === 'footer' || !import.meta.client || !isOnHome()) return;

  event.preventDefault();
  window.scrollTo({ top: 0, behavior: 'smooth' });
}
</script>
