<template>
  <div class="gallery-filter" role="group" :aria-label="t('gallery.filterAria')">
    <div class="container-fluid wrap">
      <div
        class="gallery-filter-bar"
        :class="{ 'gallery-filter-bar--no-tags': !showTagChips }"
      >
        <ul
          v-if="showTagChips"
          class="gallery-tag-chips"
          role="list"
          :aria-label="t('gallery.tagChipsAria')"
        >
          <li>
            <button
              type="button"
              class="gallery-tag-chip"
              :class="{ active: highlightTag === null }"
              :aria-pressed="highlightTag === null"
              @click="emit('update:highlight-tag', null)"
            >
              {{ t('gallery.tags.all') }}
            </button>
          </li>
          <li v-for="chip in tagChips" :key="chip.id">
            <button
              type="button"
              class="gallery-tag-chip"
              :class="{ active: highlightTag === chip.id }"
              :aria-pressed="highlightTag === chip.id"
              @click="emit('update:highlight-tag', chip.id)"
            >
              {{ chip.label }}
            </button>
          </li>
        </ul>

        <div class="gallery-filter-actions">
          <div
            class="gallery-filter-pills"
            role="group"
            :aria-label="t('gallery.sectionGroupAria')"
          >
            <button
              v-for="filter in galleryGroupFilters"
              :key="filter.id"
              type="button"
              class="filter-pill"
              :class="{ active: group === filter.id }"
              :aria-pressed="group === filter.id"
              @click="emit('update:group', filter.id)"
            >
              {{ filter.label }}
            </button>
          </div>

          <NuxtLink
            :to="localePath('/get-in-touch')"
            class="btn-primary gallery-filter-cta shrink-0"
          >
            {{ t('nav.getInTouch') }}
          </NuxtLink>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { GalleryGroup, ProjectTag } from '~/data/site';

const { t } = useI18n();
const localePath = useLocalePath();
const { galleryGroupFilters } = useGalleryI18n();

const props = defineProps<{
  group: GalleryGroup;
  highlightTag: ProjectTag | null;
  tagChips: { id: ProjectTag; label: string }[];
}>();

const emit = defineEmits<{
  'update:group': [value: GalleryGroup];
  'update:highlight-tag': [value: ProjectTag | null];
}>();

/** Só mostra chips se houver pelo menos uma tag nos projetos da secção. */
const showTagChips = computed(() => props.tagChips.length > 0);
</script>
