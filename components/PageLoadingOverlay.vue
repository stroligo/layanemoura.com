<template>
  <Teleport to="body">
    <Transition name="page-loading">
      <div
        v-if="isLoading"
        class="page-loading-overlay"
        role="status"
        aria-live="polite"
        aria-busy="true"
        :aria-label="t('loading.aria')"
      >
        <div class="page-loading-spinner" aria-hidden="true" />
      </div>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
const { t } = useI18n();
const { isLoading } = usePageImageLoading();
</script>
