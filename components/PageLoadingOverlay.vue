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
        <img
          src="/design/loading.png"
          alt=""
          class="page-loading-spinner"
          width="50"
          height="50"
          decoding="async"
        />
      </div>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
const { t } = useI18n();
const { isLoading } = usePageImageLoading();
</script>
