<template>
  <section class="!pt-4">
    <div class="container-fluid wrap">
      <PageBreadcrumbs :current-label="t('nav.getInTouch')" class="mb-5 md:mb-6" />

      <ErrorState v-if="contactLoadFailed" :status-code="500" @retry="refreshContact" />

      <div v-else class="contact-layout">
        <figure class="contact-photo">
          <div class="contact-photo-frame">
            <img
              :src="content.photoSrc"
              :alt="content.photoAlt"
              class="contact-photo__img"
              width="600"
              height="750"
              decoding="async"
            />
          </div>
        </figure>

        <div class="contact-content">
          <p class="font-inter text-xs font-medium uppercase tracking-[0.25em] text-terracotta">
            {{ content.eyebrow }}
          </p>
          <h1 class="mt-3 font-cormorant text-4xl text-cocoa md:text-5xl">
            {{ content.title }}
          </h1>

          <div class="prose-site mt-8 space-y-5">
            <p v-for="(paragraph, i) in content.aboutParagraphs" :key="i">
              {{ paragraph }}
            </p>
            <p>{{ content.aboutEmail }}</p>
          </div>

          <div class="mt-10 border-t border-border pt-10">
            <h2 class="font-cormorant text-2xl text-cocoa">{{ content.heading }}</h2>
            <a
              :href="`mailto:${content.email}`"
              class="mt-3 inline-block font-cormorant text-2xl text-terracotta transition-colors hover:text-terracotta-dark md:text-3xl"
            >
              {{ content.email }}
            </a>
            <SocialLinks class="mt-8" />
            <dl class="contact-meta">
              <div class="contact-meta__item">
                <dt class="contact-meta__label">
                  {{ content.basedIn.label }}
                </dt>
                <dd class="contact-meta__value">{{ content.basedIn.value }}</dd>
              </div>
              <div class="contact-meta__item">
                <dt class="contact-meta__label">
                  {{ content.languages.label }}
                </dt>
                <dd class="contact-meta__value">{{ content.languages.value }}</dd>
              </div>
              <div class="contact-meta__item contact-meta__item--wide">
                <dt class="contact-meta__label">
                  {{ content.availability.label }}
                </dt>
                <dd class="contact-meta__value">{{ content.availability.value }}</dd>
              </div>
            </dl>
          </div>

          <form class="contact-form" @submit.prevent="onSubmit">
            <h2 class="contact-form__title">{{ t('contact.form.title') }}</h2>
            <div class="contact-form__fields">
              <div class="contact-form__row">
                <div class="contact-form__field">
                  <label for="name" class="contact-form__label">
                    {{ t('contact.form.name') }}
                  </label>
                  <input
                    id="name"
                    v-model="form.name"
                    type="text"
                    required
                    autocomplete="name"
                    class="input-field"
                  />
                </div>
                <div class="contact-form__field">
                  <label for="email" class="contact-form__label">
                    {{ t('contact.form.email') }}
                  </label>
                  <input
                    id="email"
                    v-model="form.email"
                    type="email"
                    inputmode="email"
                    required
                    autocomplete="email"
                    spellcheck="false"
                    class="input-field"
                    :class="{ 'input-field--error': fieldErrors.email }"
                    :aria-invalid="fieldErrors.email ? 'true' : undefined"
                    :aria-describedby="fieldErrors.email ? 'email-error' : undefined"
                    @blur="validateEmailField"
                    @input="onEmailInput"
                  />
                  <p v-if="fieldErrors.email" id="email-error" class="field-error" role="alert">
                    {{ fieldErrors.email }}
                  </p>
                </div>
              </div>
              <div class="contact-form__field">
                <label for="message" class="contact-form__label">
                  {{ t('contact.form.message') }}
                </label>
                <textarea
                  id="message"
                  v-model="form.message"
                  required
                  rows="4"
                  class="input-field contact-form__textarea"
                />
              </div>
              <div class="contact-form__honeypot" aria-hidden="true">
                <label for="website">Website</label>
                <input id="website" v-model="form.website" type="text" tabindex="-1" autocomplete="off" />
              </div>
            </div>
            <button type="submit" class="btn-primary contact-form__submit" :disabled="formSubmitting">
              {{ t('contact.form.submit') }}
            </button>

            <div
              v-if="formStatus"
              class="contact-form__feedback"
              :class="
                formStatus === 'success' ? 'contact-form__feedback--success' : 'contact-form__feedback--error'
              "
              role="status"
              aria-live="polite"
            >
              <p class="contact-form__feedback-title">
                {{ formStatus === 'success' ? t('contact.form.successTitle') : t('contact.form.errorTitle') }}
              </p>
              <p class="contact-form__feedback-text">
                {{ feedbackMessage }}
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { seoConfig } from '~/data/seo';
import { buildContactPageJsonLd, buildPersonJsonLd, useSiteSeo } from '~/composables/useSiteSeo';
import { resolveSiteUrl } from '~/utils/seo';
import { isSafeEmailAddress, stripControlChars } from '~/utils/security';

const { t, locale } = useI18n();
const {
  content,
  pending: contactPending,
  error: contactError,
  refresh: refreshContact,
} = useGetInTouchContent();

const contactLoadFailed = computed(() => !contactPending.value && Boolean(contactError.value));

const form = reactive({
  name: '',
  email: '',
  message: '',
  website: '',
});

type FormStatus = 'success' | 'error';
type FormErrorReason = 'invalid' | 'server' | 'rateLimit' | 'notConfigured';

const formStatus = ref<FormStatus | null>(null);
const formErrorReason = ref<FormErrorReason>('invalid');
const formSubmitting = ref(false);
const fieldErrors = reactive({
  email: '',
});

function validateEmailField(): boolean {
  const email = stripControlChars(form.email);

  if (!email) {
    fieldErrors.email = t('contact.form.emailRequired');
    return false;
  }

  if (!isSafeEmailAddress(email)) {
    fieldErrors.email = t('contact.form.emailInvalid');
    return false;
  }

  fieldErrors.email = '';
  return true;
}

function onEmailInput() {
  if (fieldErrors.email) {
    validateEmailField();
  }
}

const feedbackMessage = computed(() => {
  const email = content.value.email;
  if (formStatus.value === 'success') {
    return t('contact.form.successMessage');
  }
  if (formErrorReason.value === 'notConfigured') {
    return t('contact.form.errorNotConfigured', { email });
  }
  if (formErrorReason.value === 'rateLimit') {
    return t('contact.form.errorRateLimit');
  }
  if (formErrorReason.value === 'server') {
    return t('contact.form.errorServer', { email });
  }
  return t('contact.form.errorInvalid', { email });
});

function resetFormFeedback() {
  formStatus.value = null;
}

function resetFormFields() {
  form.name = '';
  form.email = '';
  form.message = '';
  form.website = '';
  fieldErrors.email = '';
}

function mapSubmitError(statusCode?: number): FormErrorReason {
  if (statusCode === 503) return 'notConfigured';
  if (statusCode === 429) return 'rateLimit';
  if (statusCode === 400) return 'invalid';
  return 'server';
}

async function onSubmit() {
  if (!import.meta.client) return;

  formSubmitting.value = true;
  resetFormFeedback();

  const name = stripControlChars(form.name);
  const emailValid = validateEmailField();
  const message = stripControlChars(form.message);

  if (!name || !message || !emailValid) {
    formErrorReason.value = 'invalid';
    formStatus.value = 'error';
    formSubmitting.value = false;
    if (!emailValid) {
      document.getElementById('email')?.focus();
    }
    return;
  }

  const email = stripControlChars(form.email);

  const localeCode = locale.value.startsWith('pt') ? 'pt' : 'en';

  try {
    await $fetch('/api/contact', {
      method: 'POST',
      body: {
        name,
        email,
        message,
        website: form.website,
        locale: localeCode,
      },
    });
    resetFormFields();
    formStatus.value = 'success';
    await nextTick();
    document.querySelector('.contact-form__feedback')?.scrollIntoView({
      behavior: 'smooth',
      block: 'nearest',
    });
  } catch (error) {
    const statusCode =
      error && typeof error === 'object' && 'statusCode' in error
        ? Number((error as { statusCode?: number }).statusCode)
        : undefined;
    formErrorReason.value = mapSubmitError(statusCode);
    formStatus.value = 'error';
  } finally {
    formSubmitting.value = false;
  }
}

const localePath = useLocalePath();
const runtimeConfig = useRuntimeConfig();

const publicSiteUrl = computed(() => resolveSiteUrl(runtimeConfig.public.siteUrl as string | undefined));

useSiteSeo(() => ({
  title: t('meta.contactTitle'),
  description: t('meta.contactDescription'),
  image: content.value.photoSrc || seoConfig.contactOgImage,
  imageAlt: content.value.photoAlt,
  type: 'profile',
  jsonLd: [
    buildPersonJsonLd(publicSiteUrl.value, content.value.photoSrc),
    buildContactPageJsonLd(publicSiteUrl.value, localePath('/get-in-touch')),
  ],
}));
</script>
