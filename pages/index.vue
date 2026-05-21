<template>
  <div class="home-gallery">
    <GalleryToolbar
      :group="activeGroup"
      :highlight-category="highlightCategory"
      @update:group="setActiveGroup"
      @update:highlight-category="setHighlightCategory"
    />

    <section class="home-gallery__projects !py-0 !pb-6 md:!pb-10">
      <div class="container-fluid wrap">
        <GalleryGrouped
          v-if="galleryGroups.length"
          :groups="galleryGroups"
          :active-group="activeGroup"
          :highlight-category="highlightCategory"
          @select="openProject"
        />
      </div>
    </section>

    <ReviewsCarousel />

    <ProjectModal
      :project="selectedProject"
      @close="closeProject"
    />
  </div>
</template>

<script setup lang="ts">
import { projects } from '~/data/projects';

const { t } = useI18n();

const {
  galleryGroups,
  activeGroup,
  highlightCategory,
  selectedProject,
  setActiveGroup,
  setHighlightCategory,
  openProject,
  closeProject,
} = useProjects();

const projectImageUrls = computed(() =>
  projects.map((p) => p.image).filter(Boolean),
);

/** Primeiras capas no `<head>`; restante via composable */
useHead(() => ({
  link: projectImageUrls.value.slice(0, 8).map((href) => ({
    rel: 'preload',
    as: 'image',
    href,
    fetchpriority: 'high' as const,
  })),
}));

usePreloadProjectImages(projectImageUrls);

useSeoMeta({
  title: () => t('meta.homeTitle'),
  description: () => t('meta.homeDescription'),
});
</script>
