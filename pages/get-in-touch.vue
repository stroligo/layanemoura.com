<template>
  <section class="!pt-8 md:!pt-12">
    <div class="container-fluid wrap">
      <PageBreadcrumbs :current-label="t('nav.getInTouch')" class="mb-5 md:mb-6" />

      <div class="contact-layout">
        <figure class="contact-photo">
          <div class="contact-photo-frame">
            <img
              :src="site.photo"
              :alt="photoAlt"
              class="aspect-[4/5] w-full object-cover"
              width="600"
              height="750"
            />
          </div>
        </figure>

        <div class="contact-content">
          <p
            class="font-inter text-xs font-medium uppercase tracking-[0.25em] text-terracotta"
          >
            {{ t('contact.eyebrow') }}
          </p>
          <h1 class="mt-3 font-cormorant text-4xl text-cocoa md:text-5xl">
            {{ t('contact.title') }}
          </h1>

          <div class="prose-site mt-8 space-y-5">
            <p v-for="(paragraph, i) in about" :key="i">
              {{ paragraph }}
            </p>
            <p>{{ t('contact.aboutEmail', { email: site.email }) }}</p>
          </div>

          <div class="mt-10 border-t border-border pt-10">
            <h2 class="font-cormorant text-2xl text-cocoa">{{ t('contact.heading') }}</h2>
            <a
              :href="`mailto:${site.email}`"
              class="mt-3 inline-block font-cormorant text-2xl text-terracotta transition-colors hover:text-terracotta-dark md:text-3xl"
            >
              {{ site.email }}
            </a>
            <SocialLinks class="mt-8" />
            <dl class="mt-8 grid gap-4 font-inter text-sm sm:grid-cols-2">
              <div>
                <dt class="font-medium uppercase tracking-wide text-ink-muted">
                  {{ t('contact.basedIn') }}
                </dt>
                <dd class="mt-1 text-cocoa">{{ t('contact.basedInValue') }}</dd>
              </div>
              <div>
                <dt class="font-medium uppercase tracking-wide text-ink-muted">
                  {{ t('contact.languages') }}
                </dt>
                <dd class="mt-1 text-cocoa">{{ t('contact.languagesValue') }}</dd>
              </div>
              <div>
                <dt class="font-medium uppercase tracking-wide text-ink-muted">
                  {{ t('contact.availability') }}
                </dt>
                <dd class="mt-1 text-cocoa">{{ t('contact.availabilityValue') }}</dd>
              </div>
            </dl>
          </div>

          <form
            class="mt-10 rounded-[var(--radius-ui)] border border-border bg-surface/50 p-8 shadow-elevation-1"
            @submit.prevent="onSubmit"
          >
            <h2 class="font-cormorant text-xl text-cocoa">{{ t('contact.formTitle') }}</h2>
            <div class="mt-6 space-y-5">
              <div>
                <label for="name" class="label-ui mb-1.5 block">{{ t('contact.name') }}</label>
                <input
                  id="name"
                  v-model="form.name"
                  type="text"
                  required
                  autocomplete="name"
                  class="input-field"
                />
              </div>
              <div>
                <label for="email" class="label-ui mb-1.5 block">{{ t('contact.email') }}</label>
                <input
                  id="email"
                  v-model="form.email"
                  type="email"
                  required
                  autocomplete="email"
                  class="input-field"
                />
              </div>
              <div>
                <label for="message" class="label-ui mb-1.5 block">{{ t('contact.message') }}</label>
                <textarea
                  id="message"
                  v-model="form.message"
                  required
                  rows="5"
                  class="input-field min-h-[120px] resize-y"
                />
              </div>
            </div>
            <button type="submit" class="btn-primary mt-6">
              {{ t('contact.submit') }}
            </button>
          </form>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { site } from '~/data/site';

const { t } = useI18n();
const { about, photoAlt } = useSiteContent();

const form = reactive({
  name: '',
  email: '',
  message: '',
});

function onSubmit() {
  const subject = encodeURIComponent(
    t('contact.mailSubject', { name: form.name }),
  );
  const body = encodeURIComponent(
    t('contact.mailBody', {
      name: form.name,
      email: form.email,
      message: form.message,
    }),
  );
  window.location.href = `mailto:${site.email}?subject=${subject}&body=${body}`;
}

useSeoMeta({
  title: () => t('meta.contactTitle'),
  description: () => t('meta.contactDescription'),
});
</script>
