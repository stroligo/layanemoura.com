<template>
  <div
    class="gallery-loading-overlay"
    role="status"
    aria-live="polite"
    aria-busy="true"
    :aria-label="t('loading.aria')"
  >
    <img
      src="/loading.png"
      alt=""
      class="gallery-loading-spinner"
      width="50"
      height="50"
      decoding="async"
    />
  </div>
</template>

<script setup lang="ts">
const { t } = useI18n();
</script>
