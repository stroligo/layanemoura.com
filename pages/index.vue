<template>
  <div class="home-gallery">
    <h1 class="sr-only">{{ t('seo.homeH1', { name: site.name }) }}</h1>
    <GalleryToolbar
      :group="activeGroup"
      :highlight-tag="highlightTag"
      :tag-chips="tagChips"
      @update:group="setActiveGroup"
      @update:highlight-tag="setHighlightTag"
    />

    <section
      class="home-gallery__projects !py-0 !pb-6 md:!pb-10"
      aria-labelledby="gallery-heading"
    >
      <h2 id="gallery-heading" class="sr-only">
        {{ t('gallery.sectionTitle') }}
      </h2>
      <div class="container-fluid wrap">
        <div class="gallery-loading-host">
          <GalleryLoadingOverlay v-if="projectsPending" />

          <ErrorState
            v-else-if="projectsLoadFailed"
            :status-code="500"
            :message="t('error.galleryLoad')"
            @retry="refreshProjects"
          />

          <GalleryGrouped
            v-else-if="galleryGroups.length"
            :groups="galleryGroups"
            :active-group="activeGroup"
            :highlight-tag="highlightTag"
            @select="openProject"
          />
        </div>
      </div>
    </section>

    <LazyReviewsCarousel />

    <ProjectModal
      :project="selectedProject"
      :show-project-nav="canNavigateProjects"
      @close="closeProject"
      @prev="goToPrevProject"
      @next="goToNextProject"
    />
  </div>
</template>

<script setup lang="ts">
import { site } from '~/data/site';
import {
  GALLERY_BACKGROUND_PRELOAD_COUNT,
  GALLERY_HEAD_PRELOAD_COUNT,
} from '~/data/performance';
import { projectCoverImage } from '~/types/project';
import { resolveSiteUrl } from '~/utils/seo';
import {
  buildPersonJsonLd,
  buildWebSiteJsonLd,
  useSiteSeo,
} from '~/composables/useSiteSeo';

const { t } = useI18n();
const runtimeConfig = useRuntimeConfig();

const {
  pending: projectsPending,
  highlightProjects,
  error: projectsError,
  refresh: refreshProjects,
  projects,
} = useProjectCollection();

const projectsLoadFailed = computed(
  () =>
    !projectsPending.value &&
    Boolean(projectsError.value) &&
    projects.value.length === 0,
);

const {
  galleryGroups,
  activeGroup,
  highlightTag,
  tagChips,
  selectedProject,
  setActiveGroup,
  setHighlightTag,
  openProject,
  closeProject,
  canNavigateProjects,
  goToPrevProject,
  goToNextProject,
} = useProjects();

const galleryCoverUrls = computed(() => {
  const group = galleryGroups.value[0];
  if (!group) return [];
  return group.projects
    .map((p) => projectCoverImage(p))
    .filter((url): url is string => Boolean(url));
});

const img = useImage();

useHead(() => ({
  link: galleryCoverUrls.value
    .slice(0, GALLERY_HEAD_PRELOAD_COUNT)
    .map((href) => ({
      rel: 'preload',
      as: 'image',
      href: img(href, { width: 480, format: 'webp', quality: 82 }),
      fetchpriority: 'high' as const,
    })),
}));

/** Pré-carrega capas em segundo plano (a grelha já mostra skeletons). */
const { waitForGalleryCovers } = useGalleryImageLoading();

watch(
  [galleryCoverUrls, projectsPending],
  ([covers, pending]) => {
    if (!import.meta.client || pending || !covers.length) return;
    waitForGalleryCovers(covers.slice(0, GALLERY_BACKGROUND_PRELOAD_COUNT));
  },
  { immediate: true },
);

const highlightOgImage = computed(() => {
  const cover = highlightProjects.value[0];
  return cover ? projectCoverImage(cover) : undefined;
});

const publicSiteUrl = computed(() =>
  resolveSiteUrl(runtimeConfig.public.siteUrl as string | undefined),
);

useSiteSeo(() => ({
  title: t('meta.homeTitle'),
  description: t('meta.homeDescription'),
  image: highlightOgImage.value,
  type: 'website',
  jsonLd: [
    buildWebSiteJsonLd(publicSiteUrl.value),
    buildPersonJsonLd(publicSiteUrl.value, highlightOgImage.value),
  ],
}));
</script>
