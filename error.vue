<template>
  <NuxtLayout>
    <section class="error-page">
      <div class="container-fluid wrap error-page__inner">
        <p class="error-page__code font-inter" aria-hidden="true">
          {{ statusCode }}
        </p>
        <h1 class="error-page__title font-cormorant">{{ title }}</h1>
        <p class="error-page__message">{{ message }}</p>
        <div class="error-page__actions">
          <button
            v-if="showRetry"
            type="button"
            class="btn-primary"
            @click="clearErrorAndRetry"
          >
            {{ t('error.retry') }}
          </button>
          <NuxtLink :to="localePath('/')" class="btn-secondary" @click="dismissError">
            {{ t('error.home') }}
          </NuxtLink>
          <NuxtLink
            :to="localePath('/get-in-touch')"
            class="btn-tertiary"
            @click="dismissError"
          >
            {{ t('nav.getInTouch') }}
            <span class="btn-tertiary-arrow" aria-hidden="true">→</span>
          </NuxtLink>
        </div>
      </div>
    </section>
  </NuxtLayout>
</template>

<script setup lang="ts">
import type { NuxtError } from '#app';
import { errorPageKey } from '~/utils/errorPage';

const props = defineProps<{ error: NuxtError }>();

const { t } = useI18n();
const localePath = useLocalePath();

const statusCode = computed(() => props.error.statusCode ?? 500);
const pageKey = computed(() => errorPageKey(statusCode.value));

const title = computed(() => {
  if (props.error.statusMessage && pageKey.value === 'generic') {
    return props.error.statusMessage;
  }
  return t(`error.${pageKey.value}.title`);
});

const message = computed(() => {
  const custom =
    typeof props.error.message === 'string' ? props.error.message : '';
  if (custom && custom !== props.error.statusMessage) return custom;
  return t(`error.${pageKey.value}.description`);
});

const showRetry = computed(() => statusCode.value !== 404);

function dismissError() {
  clearError({ redirect: '' });
}

function clearErrorAndRetry() {
  clearError({ redirect: '' });
  if (import.meta.client) {
    window.location.reload();
  }
}

useSiteSeo({
  title: `${statusCode.value} — ${title.value}`,
  description: message.value,
  noindex: true,
});
</script>
