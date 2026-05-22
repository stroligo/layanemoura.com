<template>
  <div
    class="gallery-loading-overlay"
    role="status"
    aria-live="polite"
    aria-busy="true"
    :aria-label="t('loading.aria')"
  >
    <div class="gallery-loading-spinner" aria-hidden="true" />
  </div>
</template>

<script setup lang="ts">
const { t } = useI18n();
</script>
