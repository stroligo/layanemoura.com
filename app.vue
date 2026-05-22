<template>
  <NuxtLayout>
    <NuxtPage />
  </NuxtLayout>
  <ClientOnly>
    <PageLoadingOverlay />
    <FloatingPageActions />
  </ClientOnly>
</template>
