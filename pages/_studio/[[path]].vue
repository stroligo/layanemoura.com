<script setup lang="ts">
/**
 * Em desenvolvimento o Studio abre pelo botão flutuante na home (sem OAuth).
 * /_studio em produção exige STUDIO_GITHUB_* no .env — ver .env.example.
 */
definePageMeta({
  layout: false,
});

const config = useRuntimeConfig();
const route = useRoute();

if (config.public.studioDev) {
  await navigateTo('/', { replace: true });
} else if (import.meta.client) {
  await navigateTo(route.fullPath, { external: true });
}
</script>

<template>
  <p class="p-8 font-inter text-sm text-ink-muted">
    A redirecionar…
  </p>
</template>
