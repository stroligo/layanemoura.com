<template>
  <div class="gallery-filter" role="toolbar" :aria-label="t('gallery.filterAria')">
    <div class="container-fluid wrap">
      <div class="gallery-filter-bar">
        <ul
          v-if="categoryChips.length"
          class="gallery-tag-chips"
          role="list"
          :aria-label="t('gallery.tagChipsAria')"
        >
          <li>
            <button
              type="button"
              class="gallery-tag-chip"
              :class="{ active: highlightCategory === null }"
              @click="emit('update:highlight-category', null)"
            >
              {{ t('gallery.tags.all') }}
            </button>
          </li>
          <li v-for="chip in categoryChips" :key="chip.id">
            <button
              type="button"
              class="gallery-tag-chip"
              :class="{ active: highlightCategory === chip.id }"
              @click="emit('update:highlight-category', chip.id)"
            >
              {{ chip.label }}
            </button>
          </li>
        </ul>

        <div class="gallery-filter-actions">
          <ul class="gallery-filter-pills" role="list">
            <li v-for="filter in galleryGroupFilters" :key="filter.id">
              <button
                type="button"
                class="filter-pill"
                :class="{ active: group === filter.id }"
                @click="emit('update:group', filter.id)"
              >
                {{ filter.label }}
              </button>
            </li>
          </ul>

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
import type { GalleryGroup, ProjectCategory } from '~/data/site';

const { t } = useI18n();
const localePath = useLocalePath();
const { galleryGroupFilters, categoryChipsForGroup } = useGalleryI18n();

const props = defineProps<{
  group: GalleryGroup;
  highlightCategory: ProjectCategory | null;
}>();

const emit = defineEmits<{
  'update:group': [value: GalleryGroup];
  'update:highlight-category': [value: ProjectCategory | null];
}>();

const categoryChips = computed(() => categoryChipsForGroup(props.group));
</script>
