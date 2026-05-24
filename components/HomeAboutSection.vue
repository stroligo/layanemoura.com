<template>
  <section
    v-if="aboutTeaserPublished"
    class="home-about"
    aria-labelledby="home-about-heading"
  >
    <div class="container-fluid wrap">
      <div class="contact-layout home-about__layout">
        <div class="contact-content">
          <p class="home-about__eyebrow">
            {{ content.aboutTeaser.eyebrow }}
          </p>
          <h2 id="home-about-heading" class="home-about__title">
            {{ contactContent.title }}
          </h2>

          <div class="prose-site home-about__prose">
            <p v-for="(paragraph, index) in contactContent.aboutParagraphs" :key="index">
              {{ paragraph }}
            </p>
            <p>{{ contactContent.aboutEmail }}</p>
          </div>

          <div class="home-about__connect">
            <h3 class="home-about__connect-title">
              {{ contactContent.heading }}
            </h3>
            <a :href="`mailto:${contactContent.email}`" class="home-about__email">
              {{ contactContent.email }}
            </a>
            <SocialLinks class="home-about__social" />
            <dl class="contact-meta">
              <div class="contact-meta__item">
                <dt class="contact-meta__label">
                  {{ contactContent.basedIn.label }}
                </dt>
                <dd class="contact-meta__value">{{ contactContent.basedIn.value }}</dd>
              </div>
              <div class="contact-meta__item">
                <dt class="contact-meta__label">
                  {{ contactContent.languages.label }}
                </dt>
                <dd class="contact-meta__value">{{ contactContent.languages.value }}</dd>
              </div>
              <div class="contact-meta__item contact-meta__item--wide">
                <dt class="contact-meta__label">
                  {{ contactContent.availability.label }}
                </dt>
                <dd class="contact-meta__value">{{ contactContent.availability.value }}</dd>
              </div>
            </dl>
          </div>

          <ContactForm
            :contact-email="contactContent.email"
            form-id="home-about-contact"
            class="home-about__form"
          />
        </div>

        <figure class="contact-photo">
          <div class="contact-photo-frame">
            <img
              :src="contactContent.photoSrc"
              :alt="contactContent.photoAlt"
              class="contact-photo__img home-about__photo"
              width="600"
              height="750"
              loading="lazy"
              decoding="async"
            />
          </div>
        </figure>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
const { content, aboutTeaserPublished } = useHomeContent();
const { content: contactContent } = useGetInTouchContent();
</script>
