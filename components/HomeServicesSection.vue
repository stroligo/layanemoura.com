<template>
  <section
    v-if="servicesHeaderPublished"
    class="services-section"
    aria-labelledby="services-heading"
  >
    <div class="container-fluid wrap">
      <header class="services-header">
        <p class="services-eyebrow">
          {{ content.servicesHeader.eyebrow }}
        </p>
        <h2 id="services-heading" class="services-title">
          {{ content.servicesHeader.title }}
        </h2>
      </header>

      <ul class="services-grid">
        <li
          v-for="(service, index) in services"
          :key="service.id"
          class="services-grid__item"
          :style="{ '--service-index': index }"
        >
          <article class="service-card">
            <header class="service-card__head">
              <div class="service-card__icon-wrap" aria-hidden="true">
                <ServiceIcon :name="service.id" />
              </div>
              <h3 class="service-card__title">
                {{ service.title }}
              </h3>
            </header>
            <p class="service-card__desc">
              {{ service.description }}
            </p>
          </article>
        </li>
      </ul>

      <div class="services-footer">
        <NuxtLink :to="localePath('/get-in-touch')" class="btn-secondary services-cta">
          {{ content.servicesHeader.cta }}
        </NuxtLink>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
const localePath = useLocalePath();
const { content, servicesHeaderPublished } = useHomeContent();
const { services } = useServiceCollection();
</script>
