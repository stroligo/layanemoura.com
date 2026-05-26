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
            {{ content.aboutTeaser.title }}
          </h2>

          <div class="prose-site home-about__prose">
            <p v-for="(paragraph, index) in content.aboutTeaser.paragraphs" :key="index">
              {{ paragraph }}
            </p>
            <AboutEmailLine
              :line="content.aboutTeaser.aboutEmail"
              :email="contactContent.email"
            />
          </div>

          <div class="home-about__connect">
            <SocialLinks class="home-about__social" />
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
