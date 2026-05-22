<template>
  <div
    class="lang-switcher"
    role="group"
    :aria-label="t('nav.langAria')"
  >
    <template v-for="(loc, index) in locales" :key="loc.code">
      <span
        v-if="index > 0"
        class="lang-switcher-sep"
        aria-hidden="true"
      >/</span>
      <NuxtLink
        :to="switchLocalePath(loc.code)"
        class="lang-switcher-link"
        :class="{ 'lang-switcher-link--active': locale === loc.code }"
        :aria-current="locale === loc.code ? 'page' : undefined"
        :hreflang="loc.code"
        @click="onSwitch"
      >
        {{ loc.code === 'pt' ? 'PT' : 'EN' }}
      </NuxtLink>
    </template>
  </div>
</template>

<script setup lang="ts">
const { locale, locales, t } = useI18n();
const switchLocalePath = useSwitchLocalePath();

function onSwitch() {
  if (!import.meta.client) return;
  window.scrollTo({ top: 0, behavior: 'auto' });
}
</script>
