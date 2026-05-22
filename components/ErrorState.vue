<template>
  <div class="error-state" role="alert">
    <p class="error-state__code" aria-hidden="true">{{ statusCode }}</p>
    <h2 class="error-state__title font-cormorant">{{ title }}</h2>
    <p class="error-state__message">{{ message }}</p>
    <div class="error-state__actions">
      <button
        v-if="showRetry"
        type="button"
        class="btn-primary"
        @click="emit('retry')"
      >
        {{ t('error.retry') }}
      </button>
      <NuxtLink :to="localePath('/')" class="btn-secondary">
        {{ t('error.home') }}
      </NuxtLink>
      <NuxtLink
        v-if="showContact"
        :to="localePath('/get-in-touch')"
        class="btn-tertiary"
      >
        {{ t('nav.getInTouch') }}
        <span class="btn-tertiary-arrow" aria-hidden="true">→</span>
      </NuxtLink>
    </div>
  </div>
</template>

<script setup lang="ts">
import { errorPageKey } from '~/utils/errorPage';

const props = withDefaults(
  defineProps<{
    statusCode?: number;
    title?: string;
    message?: string;
    showRetry?: boolean;
    showContact?: boolean;
  }>(),
  {
    statusCode: 500,
    showRetry: true,
    showContact: true,
  },
);

const emit = defineEmits<{ retry: [] }>();

const { t } = useI18n();
const localePath = useLocalePath();

const pageKey = computed(() => errorPageKey(props.statusCode));

const title = computed(
  () => props.title ?? t(`error.${pageKey.value}.title`),
);
const message = computed(
  () => props.message ?? t(`error.${pageKey.value}.description`),
);
</script>
