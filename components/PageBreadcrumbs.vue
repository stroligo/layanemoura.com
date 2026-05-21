<template>
  <nav class="page-breadcrumbs" :aria-label="t('nav.breadcrumbAria')">
    <ol class="page-breadcrumbs__list">
      <li class="page-breadcrumbs__item">
        <NuxtLink :to="localePath('/')" class="page-breadcrumbs__link">
          <span class="page-breadcrumbs__icon" aria-hidden="true">←</span>
          {{ t('nav.home') }}
        </NuxtLink>
      </li>
      <li
        v-if="currentLabel"
        class="page-breadcrumbs__item page-breadcrumbs__item--current"
        aria-current="page"
      >
        <span class="page-breadcrumbs__sep" aria-hidden="true">/</span>
        <span class="page-breadcrumbs__current">{{ currentLabel }}</span>
      </li>
    </ol>
  </nav>
</template>

<script setup lang="ts">
defineProps<{
  currentLabel?: string;
}>();

const { t } = useI18n();
const localePath = useLocalePath();
</script>
