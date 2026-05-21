<template>
  <div
    ref="sentinel"
    class="gallery-sentinel"
    :class="{ 'gallery-sentinel--loading': loading }"
    aria-hidden="true"
  >
    <p
      v-if="loading"
      class="py-8 text-center font-inter text-sm text-ink-muted"
    >
      Loading more work…
    </p>
  </div>
</template>

<script setup lang="ts">
const props = defineProps<{
  enabled: boolean;
}>();

const emit = defineEmits<{
  'load-more': [];
}>();

const sentinel = ref<HTMLElement | null>(null);
const loading = ref(false);
let observer: IntersectionObserver | null = null;
let loadTimeout: ReturnType<typeof setTimeout> | null = null;

function loadMore() {
  if (!props.enabled || loading.value) return;
  loading.value = true;
  emit('load-more');

  loadTimeout = setTimeout(() => {
    loading.value = false;
  }, 400);
}

onMounted(() => {
  if (!import.meta.client || !sentinel.value) return;

  observer = new IntersectionObserver(
    (entries) => {
      if (entries[0]?.isIntersecting && props.enabled) {
        loadMore();
      }
    },
    {
      root: null,
      rootMargin: '320px 0px',
      threshold: 0,
    },
  );

  observer.observe(sentinel.value);
});

watch(
  () => props.enabled,
  (enabled) => {
    if (!enabled) {
      loading.value = false;
      if (loadTimeout) clearTimeout(loadTimeout);
    }
  },
);

onUnmounted(() => {
  observer?.disconnect();
  if (loadTimeout) clearTimeout(loadTimeout);
});
</script>
