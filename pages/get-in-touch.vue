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

          <ContactForm :contact-email="content.email" form-id="contact-page" />
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { seoConfig } from '~/data/seo';
import { buildContactPageJsonLd, buildPersonJsonLd, useSiteSeo } from '~/composables/useSiteSeo';
const { t } = useI18n();
const {
  content,
  pending: contactPending,
  error: contactError,
  refresh: refreshContact,
} = useGetInTouchContent();

const contactLoadFailed = computed(() => !contactPending.value && Boolean(contactError.value));

const localePath = useLocalePath();
const publicSiteUrl = usePublicSiteUrl();

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
