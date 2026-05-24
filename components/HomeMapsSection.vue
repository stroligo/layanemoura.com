<template>
  <section
    v-if="mapsAboutPublished"
    class="maps-about"
    aria-labelledby="maps-about-heading"
  >
    <div class="container-fluid wrap">
      <div class="maps-about__grid">
        <figure class="maps-about__visual">
          <div class="maps-about__frame">
            <img
              :src="content.mapsAbout.photoSrc"
              :alt="content.mapsAbout.photoAlt"
              class="maps-about__img"
              width="720"
              height="900"
              loading="lazy"
              decoding="async"
            />
          </div>
        </figure>

        <div class="maps-about__content">
          <p class="maps-about__eyebrow">
            {{ content.mapsAbout.eyebrow }}
          </p>
          <h2 id="maps-about-heading" class="maps-about__title">
            {{ content.mapsAbout.title }}
          </h2>

          <div class="maps-about__prose prose-site">
            <p v-for="(paragraph, index) in content.mapsAbout.paragraphs" :key="index">
              {{ paragraph }}
            </p>
          </div>

          <NuxtLink :to="localePath('/get-in-touch')" class="btn-secondary maps-about__cta">
            {{ content.mapsAbout.cta }}
          </NuxtLink>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
const localePath = useLocalePath();
const { content, mapsAboutPublished } = useHomeContent();
</script>
