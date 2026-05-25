<template>
  <NuxtLayout>
    <NuxtPage />
  </NuxtLayout>
  <ClientOnly>
    <PageLoadingOverlay />
    <FloatingPageActions />
  </ClientOnly>
</template>

<script setup lang="ts">
useGtag();
</script>
